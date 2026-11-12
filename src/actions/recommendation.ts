"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { rateLimit, RateLimits } from "@/lib/rate-limit";

interface Recommendation {
  companyName: string;
  industry: string;
  stage: string;
  matchScore: number;
  reasoning: string;
  risks: string;
  opportunity: string;
}

export async function generateRecommendations(): Promise<{
  success: boolean;
  recommendations?: Recommendation[];
  error?: string;
  model?: string;
}> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const limitCheck = rateLimit(userId, RateLimits.RECOMMENDATIONS);
  if (!limitCheck.success) {
    return {
      success: false,
      error: `Recommendation generation rate limit exceeded. Please wait ${Math.ceil(
        limitCheck.resetMs / 1000
      )}s before regenerating matches.`,
    };
  }

  // 1. Get user's internal DB record
  let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!dbUser) {
    const clerkUser = await currentUser();
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email:
          clerkUser?.emailAddresses[0]?.emailAddress ||
          `${userId}@user.finiq`,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
      },
    });
  }

  // 2. Fetch the user's investment profile
  const profile = await prisma.investmentProfile.findUnique({
    where: { userId: dbUser.id },
  });

  if (!profile) {
    return {
      success: false,
      error: "NO_PROFILE",
    };
  }

  // 3. Fetch startups the user is tracking
  const startups = await prisma.startup.findMany({
    where: { userId: dbUser.id },
  });

  // 4. Fetch user's financial context for portfolio-aware recommendations
  let financialSummary = "";
  try {
    const documents = await prisma.document.findMany({
      where: { userId },
      select: { netIncome: true, portfolioValue: true },
    });

    const analyzedDocs = documents.filter(
      (d) => d.netIncome || d.portfolioValue
    );

    if (analyzedDocs.length > 0) {
      const totalIncome = analyzedDocs.reduce((acc, d) => {
        const val = parseFloat(
          (d.netIncome || "0").replace(/[^0-9.-]+/g, "")
        );
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      const totalPortfolio = analyzedDocs.reduce((acc, d) => {
        const val = parseFloat(
          (d.portfolioValue || "0").replace(/[^0-9.-]+/g, "")
        );
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      if (totalIncome > 0 || totalPortfolio > 0) {
        financialSummary = `\nThe investor's approximate annual income is ₹${totalIncome.toLocaleString("en-IN")} and current portfolio value is ₹${totalPortfolio.toLocaleString("en-IN")}.`;
      }
    }
  } catch {
    // Continue without financial context
  }

  // 5. Build Gemini prompt
  const startupsContext =
    startups.length > 0
      ? `\nStartups the investor is currently tracking:\n${startups.map((s) => `- ${s.companyName} (${s.industry}, ${s.stage}): ${s.description || "No description"}`).join("\n")}`
      : "";

  const prompt = `You are FinIQ's AI investment analyst. Generate exactly 5 startup investment recommendations for an angel investor with this profile:

Risk Tolerance: ${profile.riskTolerance}
Preferred Investment Stage: ${profile.preferredStage}
Sector Interests: ${profile.interests.join(", ")}
${financialSummary}
${startupsContext}

IMPORTANT RULES:
1. Generate 5 fictional but realistic Indian startup recommendations that match the investor's profile.
2. Each recommendation MUST be a plausible early-stage Indian startup.
3. Match scores should range 65-98 based on how well they fit the investor's risk, stage, and sector preferences.
4. Tailor risks and opportunities to the specific stage and industry.
5. If the investor tracks startups in certain sectors, recommend complementary or adjacent opportunities.

Return ONLY a valid JSON array with exactly 5 objects matching this structure:
[
  {
    "companyName": "Startup Name",
    "industry": "Sector",
    "stage": "Funding Stage",
    "matchScore": 85,
    "reasoning": "2-3 sentence explanation of why this is a good match",
    "risks": "1-2 sentence key risk factors",
    "opportunity": "1-2 sentence upside potential"
  }
]

Sort by matchScore descending.`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  };

  // 6. Call Gemini with fallback cascade
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];

  let lastErrorDetails = "";

  for (const modelName of candidateModels) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
          throw new Error("Empty response from AI");
        }

        // Clean markdown fences if present
        let cleanJson = aiText.trim();
        if (cleanJson.startsWith("```json")) {
          cleanJson = cleanJson
            .replace(/^```json\s*/i, "")
            .replace(/```\s*$/, "");
        } else if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson
            .replace(/^```\s*/, "")
            .replace(/```\s*$/, "");
        }

        const recommendations: Recommendation[] = JSON.parse(
          cleanJson.trim()
        );
        console.log(
          `Recommendations generated via ${modelName}: ${recommendations.length} results`
        );

        return {
          success: true,
          recommendations,
          model: modelName,
        };
      }

      const errText = await res.text();
      lastErrorDetails = `${modelName}: HTTP ${res.status} — ${errText.slice(0, 120)}`;
      console.warn(`Recommendation model ${modelName} returned ${res.status}`);
    } catch (fetchErr: any) {
      lastErrorDetails = `${modelName}: ${fetchErr?.message || fetchErr}`;
      console.warn(`Recommendation fetch error (${modelName}):`, fetchErr?.message);
    }
  }

  console.error("All recommendation models exhausted:", lastErrorDetails);
  return {
    success: false,
    error: "AI recommendation engine is temporarily unavailable. Please try again shortly.",
  };
}
