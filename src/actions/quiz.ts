"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
}

// Built-in curated question bank for zero-latency instant play & offline fallback
const CURATED_QUIZ_BANK: Record<string, QuizQuestion[]> = {
  "Angel Investing 101": [
    {
      id: 1,
      question: "What is a SAFE (Simple Agreement for Future Equity)?",
      options: [
        "A debt instrument with a fixed monthly interest repayment schedule",
        "A convertible financing agreement that converts into equity at a future priced round",
        "A government grant designed specifically for early-stage seed startups",
        "A permanent equity share with voting rights and board seat guarantees",
      ],
      correctAnswer: 1,
      explanation:
        "A SAFE is a contractual agreement created by Y Combinator that allows investors to invest cash into a startup in exchange for the right to receive equity shares during a future priced funding round (such as Series A).",
    },
    {
      id: 2,
      question: "How does a 'Valuation Cap' protect an early angel investor in a convertible note or SAFE?",
      options: [
        "It limits the maximum amount of money the startup is legally permitted to raise",
        "It sets an upper limit on the effective company valuation used to calculate the investor's share price",
        "It guarantees the investor will receive 100% of their money back if the company pivots",
        "It prevents founders from selling secondary shares to new institutional venture funds",
      ],
      correctAnswer: 1,
      explanation:
        "A valuation cap ensures that if the company skyrockets in value by the next round, the early investor's price per share is capped at that limit, rewarding them with a higher ownership percentage for taking early risk.",
    },
    {
      id: 3,
      question: "What is the primary difference between Pre-Money and Post-Money valuation?",
      options: [
        "Pre-Money is the company value before new investment; Post-Money is Pre-Money plus the new invested capital",
        "Pre-Money is for profitable companies; Post-Money is for loss-making startups",
        "Pre-Money excludes intellectual property; Post-Money includes goodwill and patents",
        "Pre-Money includes founder salaries; Post-Money deducts employee equity pools",
      ],
      correctAnswer: 0,
      explanation:
        "Post-Money Valuation = Pre-Money Valuation + Investment Amount. An investor's initial ownership percentage equals their investment divided by the Post-Money Valuation.",
    },
    {
      id: 4,
      question: "What does 'Pro-Rata Rights' entitle an investor to do?",
      options: [
        "Demand an annual dividend before common shareholders receive compensation",
        "Maintain their initial ownership percentage by participating in future financing rounds",
        "Veto hiring and firing decisions made by the startup's executive leadership team",
        "Liquidate company assets if the startup misses consecutive quarterly revenue milestones",
      ],
      correctAnswer: 1,
      explanation:
        "Pro-rata rights give investors the option (not obligation) to invest additional capital in subsequent rounds to avoid dilution and maintain their existing percentage ownership of the startup.",
    },
    {
      id: 5,
      question: "What is a standard 'Vesting Schedule' with a 'Cliff' for startup founders and early employees?",
      options: [
        "Immediate 100% equity ownership upon signing the formal employment agreement",
        "4-year vesting with a 1-year cliff (0% in year 1, 25% at 12 months, monthly thereafter)",
        "Equal monthly disbursements across 10 years with no performance reviews",
        "Equity awarded only upon an IPO or secondary acquisition event",
      ],
      correctAnswer: 1,
      explanation:
        "The startup industry benchmark is a 4-year vesting schedule with a 1-year cliff. If a founder or employee leaves within the first year, they earn zero equity. At month 12, 25% vests at once, followed by 1/48th per month.",
    },
  ],
  "Valuation & Cap Tables": [
    {
      id: 1,
      question: "What is 'Dilution' in equity financing?",
      options: [
        "The decrease in existing shareholders' ownership percentage when new shares are issued",
        "The reduction in company cash reserves caused by excessive marketing expenditure",
        "The markdown of startup book valuation by external auditing agencies",
        "The removal of voting rights from minority angel investors",
      ],
      correctAnswer: 0,
      explanation:
        "Dilution occurs when a company issues new shares of stock during an investment round or option pool expansion. While existing shareholders own more valuable shares, their overall ownership percentage decreases.",
    },
    {
      id: 2,
      question: "What is an ESOP (Employee Stock Ownership Plan) pool, and who usually absorbs its dilution in seed rounds?",
      options: [
        "A pool of shares reserved for future hires, typically carved out of existing pre-money founder equity",
        "A cash bonus reserve funded exclusively by incoming venture investors",
        "A legal trust created by banks to underwrite startup debt financing",
        "A retirement fund that matches employee salaries rupee-for-rupee",
      ],
      correctAnswer: 0,
      explanation:
        "An ESOP pool (usually 10-15%) is reserved for recruiting key talent. In seed rounds, investors commonly require the pool to be created 'pre-money', meaning founders bear the dilution before the investor's cash enters.",
    },
    {
      id: 3,
      question: "In liquidation preference, what does '1x Non-Participating Preferred' mean?",
      options: [
        "The investor receives 1x their initial money back OR converts to common shares to share the exit proceeds",
        "The investor receives 1x their money back AND also takes their full common percentage share",
        "The investor is paid after all common shareholders and founders have been paid",
        "The investor receives 100% of the entire exit payout regardless of purchase price",
      ],
      correctAnswer: 0,
      explanation:
        "1x Non-Participating Preferred is the founder-friendly standard. On an exit, investors choose whichever is higher: getting their initial investment back (1x) or converting to common stock and sharing pro-rata.",
    },
    {
      id: 4,
      question: "If an angel invests ₹50 Lakhs at a ₹4.5 Crore Pre-Money valuation, what is the investor's ownership?",
      options: [
        "11.11%",
        "10.00%",
        "9.09%",
        "12.50%",
      ],
      correctAnswer: 1,
      explanation:
        "Post-Money = Pre-Money (₹4.5 Cr) + Investment (₹0.5 Cr) = ₹5.0 Crore. Ownership = ₹0.5 Cr / ₹5.0 Cr = 10.00%.",
    },
    {
      id: 5,
      question: "What is a '409A Valuation'?",
      options: [
        "An independent appraisal of the fair market value of a private company's common stock for tax purposes",
        "A pitch deck scoring system used by Silicon Valley accelerators",
        "A regulatory penalty levied on startups that exceed their seed round cap",
        "A financial audit required only after an initial public offering (IPO)",
      ],
      correctAnswer: 0,
      explanation:
        "A 409A valuation is an independent third-party appraisal of private startup common stock, required to legally set strike prices for employee stock options without triggering tax liabilities.",
    },
  ],
  "Indian Startup Taxation & Regulation": [
    {
      id: 1,
      question: "What was India's historic 'Angel Tax' (Section 56(2)(viib)), and what happened to it in Budget 2024?",
      options: [
        "A tax on investments above Fair Market Value (FMV) in unlisted companies, which was completely abolished in 2024",
        "A 30% flat tax on all seed investments, which was doubled to 60% in 2024",
        "A municipal property tax on startup incubator desks in Bengaluru and Mumbai",
        "A mandatory CSR levy applied to startups from their first day of incorporation",
      ],
      correctAnswer: 0,
      explanation:
        "Section 56(2)(viib) taxed capital raised by unlisted startups above Fair Market Value as 'income from other sources'. In the Union Budget 2024, the Indian government completely abolished Angel Tax for all classes of investors.",
    },
    {
      id: 2,
      question: "Under DPIIT Startup India recognition, what is the Section 80-IAC tax holiday benefit?",
      options: [
        "100% tax deduction on profits for 3 consecutive financial years out of the first 10 years",
        "Complete exemption from Goods and Services Tax (GST) indefinitely",
        "Zero personal income tax for founders for their entire lifetime",
        "Exemption from paying employee provident fund (PF) contributions",
      ],
      correctAnswer: 0,
      explanation:
        "Eligible DPIIT-recognized startups incorporated after April 1, 2016 can apply for 100% tax exemption on profits under Section 80-IAC for any 3 consecutive years out of their first 10 years.",
    },
    {
      id: 3,
      question: "What is the Long-Term Capital Gains (LTCG) holding period for unlisted equity shares in India (post Budget 2024)?",
      options: [
        "12 months",
        "24 months",
        "36 months",
        "48 months",
      ],
      correctAnswer: 1,
      explanation:
        "For unlisted shares (such as early-stage private startups), the holding period for long-term capital gains classification is 24 months (compared to 12 months for listed equities).",
    },
    {
      id: 4,
      question: "What is an AIF (Alternative Investment Fund) Category I in India?",
      options: [
        "Funds that invest in startups, early-stage ventures, SMEs, and social infrastructure (e.g. Angel Funds, VC funds)",
        "Hedge funds that trade listed derivatives and undertake complex leverage",
        "Real estate investment trusts managed exclusively by national banks",
        "Government municipal debt funds for highway construction",
      ],
      correctAnswer: 0,
      explanation:
        "Category I AIFs under SEBI regulations invest in start-ups, early-stage ventures, social ventures, or sectors which the government or regulators consider socially or economically desirable.",
    },
    {
      id: 5,
      question: "What document must an Indian company file with the Registrar of Companies (ROC) within 30 days of allotting shares to an angel?",
      options: [
        "PAS-3 (Return of Allotment)",
        "AOC-4 (Financial Statement)",
        "MGT-7 (Annual Return)",
        "DIR-12 (Appointment of Directors)",
      ],
      correctAnswer: 0,
      explanation:
        "Under Section 42 of the Companies Act 2013, Form PAS-3 (Return of Allotment) must be filed with the ROC within 30 days of share allotment, accompanied by the valuation report and list of allottees.",
    },
  ],
  "Venture Capital Due Diligence": [
    {
      id: 1,
      question: "In startup unit economics, what is the golden ratio of LTV (Customer Lifetime Value) to CAC (Customer Acquisition Cost)?",
      options: [
        "LTV : CAC of 1 : 1",
        "LTV : CAC >= 3 : 1",
        "LTV : CAC of 0.5 : 1",
        "LTV : CAC of 10 : 1 minimum for seed stage",
      ],
      correctAnswer: 1,
      explanation:
        "An LTV:CAC ratio of at least 3:1 is considered the benchmark of a healthy business model. A 1:1 ratio means you are barely breaking even on acquisition costs, while 3:1 leaves room for gross margin and overhead.",
    },
    {
      id: 2,
      question: "What is 'CAC Payback Period' and why do venture investors scrutinize it?",
      options: [
        "The number of months required for a customer's gross profit to cover their acquisition cost",
        "The deadline founders have to repay initial angel debt instruments",
        "The time it takes for an employee option pool to fully vest",
        "The period during which an investor cannot sell secondary shares",
      ],
      correctAnswer: 0,
      explanation:
        "CAC Payback Period indicates capital efficiency: how quickly cash spent on marketing/sales is recovered. For early-stage B2B SaaS, a payback under 12 months is generally considered top-tier.",
    },
    {
      id: 3,
      question: "What is the difference between TAM, SAM, and SOM in market sizing?",
      options: [
        "TAM is Total Addressable Market; SAM is Serviceable Available Market; SOM is Serviceable Obtainable Market",
        "TAM is Taxable Annual Margin; SAM is Subsidized Annual Metric; SOM is Operating Margin",
        "TAM is Top Angel Metric; SAM is Series A Metric; SOM is Seed Ownership Metric",
        "TAM is Technical Architecture Model; SAM is Software Application Module; SOM is Server Output Metric",
      ],
      correctAnswer: 0,
      explanation:
        "TAM represents the universal demand for a product; SAM is the segment within geographical/technological reach; and SOM is the realistic portion of the market the startup can capture in 3-5 years.",
    },
    {
      id: 4,
      question: "What is a 'Net Revenue Retention' (NRR) rate exceeding 120% indicative of?",
      options: [
        "High customer churn offset only by excessive new ad spend",
        "Existing customers spending 20% more each year through expansions and upsells, even after accounting for churn",
        "The company is violating GAAP accounting principles",
        "The founders are diluting existing angel share allocations",
      ],
      correctAnswer: 1,
      explanation:
        "An NRR above 100% (especially 120%+) demonstrates negative net churn—existing customers expand usage, upgrade tiers, or add licenses faster than existing accounts cancel.",
    },
    {
      id: 5,
      question: "Which of the following is considered a critical 'Red Flag' during technical and cap table due diligence?",
      options: [
        "The company has intellectual property assigned in writing to the corporation",
        "Founder equity is unvested with 100% owned upfront with no departure restrictions",
        "The startup has audited financial statements from a certified chartered accountant",
        "The cap table has clean 1:1 common shares with no dead equity holders",
      ],
      correctAnswer: 1,
      explanation:
        "Unvested founder equity is a major red flag for investors. If one co-founder departs 2 months after raising funds, they could walk away with 50% of the company's equity without contributing to its future growth.",
    },
  ],
};

// Ensure the internal User record exists (Clerk → Prisma bridge)
async function ensureDbUser(clerkId: string) {
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) {
    const clerkUser = await currentUser();
    dbUser = await prisma.user.create({
      data: {
        clerkId,
        email:
          clerkUser?.emailAddresses[0]?.emailAddress ||
          `${clerkId}@user.finiq`,
        firstName: clerkUser?.firstName || "",
        lastName: clerkUser?.lastName || "",
      },
    });
  }

  return dbUser;
}

// Generate 5 questions dynamically using Gemini, falling back to curated bank
export async function generateQuizQuestions(topic: string): Promise<{
  success: boolean;
  questions: QuizQuestion[];
  topic: string;
  isAiGenerated: boolean;
}> {
  const normalizedTopic =
    CURATED_QUIZ_BANK[topic] ? topic : "Angel Investing 101";

  // Try generating fresh questions with Gemini
  const candidateModels = [
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];

  const prompt = `You are FinIQ's financial intelligence educator. Generate exactly 5 challenging, educational multiple-choice quiz questions for angel investors on the topic: "${topic}".

RULES:
1. Each question must test real-world investor acumen, term sheets, metrics, or financial regulations.
2. Provide exactly 4 distinct options per question.
3. "correctAnswer" MUST be the 0-based integer index (0, 1, 2, or 3) pointing to the correct option.
4. "explanation" MUST be 1-2 insightful sentences explaining the financial reasoning behind the answer.

Return ONLY a valid JSON array with exactly 5 objects matching this schema:
[
  {
    "id": 1,
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "explanation": "Clear explanation of why option 1 is correct"
  }
]`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  };

  for (const modelName of candidateModels) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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

        if (aiText) {
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

          const parsed: QuizQuestion[] = JSON.parse(cleanJson.trim());
          if (
            Array.isArray(parsed) &&
            parsed.length >= 3 &&
            parsed[0].question &&
            Array.isArray(parsed[0].options) &&
            typeof parsed[0].correctAnswer === "number"
          ) {
            return {
              success: true,
              questions: parsed.slice(0, 5).map((q, idx) => ({
                ...q,
                id: idx + 1,
              })),
              topic,
              isAiGenerated: true,
            };
          }
        }
      }
    } catch {
      // Continue to next model or fallback
    }
  }

  // Graceful fallback to verified curated question bank
  return {
    success: true,
    questions: CURATED_QUIZ_BANK[normalizedTopic] || CURATED_QUIZ_BANK["Angel Investing 101"],
    topic: normalizedTopic,
    isAiGenerated: false,
  };
}

// Record completed attempt in PostgreSQL QuizAttempt table
export async function recordQuizAttempt(data: {
  topic: string;
  score: number;
  totalScore: number;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  try {
    const dbUser = await ensureDbUser(userId);

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: dbUser.id,
        topic: data.topic,
        score: data.score,
        totalScore: data.totalScore,
      },
    });

    revalidatePath("/dashboard/quiz");
    revalidatePath("/dashboard");
    return { success: true, attemptId: attempt.id };
  } catch (error: any) {
    console.error("Failed to record quiz attempt:", error);
    return { success: false, error: error?.message || "Failed to record attempt" };
  }
}

// Fetch historical attempts for current user
export async function getUserQuizHistory() {
  const { userId } = await auth();
  if (!userId) return [];

  try {
    const dbUser = await ensureDbUser(userId);

    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: dbUser.id },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    return attempts;
  } catch (error) {
    console.error("Failed to fetch quiz history:", error);
    return [];
  }
}
