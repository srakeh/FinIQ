"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { SendChatMessageSchema } from "@/lib/validations";
import { rateLimit, RateLimits } from "@/lib/rate-limit";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[]
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 1. Rate limiting check
  const limitCheck = rateLimit(userId, RateLimits.AI_CHAT);
  if (!limitCheck.success) {
    throw new Error(
      `FinIQ Advisor is receiving too many requests. Please wait ${Math.ceil(
        limitCheck.resetMs / 1000
      )}s before asking another question.`
    );
  }

  // 2. Input validation via Zod
  const validation = SendChatMessageSchema.safeParse({
    message: userMessage,
    conversationHistory,
  });

  if (!validation.success) {
    const errorMsg = validation.error.issues.map((i) => i.message).join(", ");
    throw new Error(`Validation failed: ${errorMsg}`);
  }

  const { message: cleanMessage, conversationHistory: cleanHistory } =
    validation.data;

  // 1. Fetch the user's analyzed documents to ground AI responses
  let financialContext = "";
  try {
    const documents = await prisma.document.findMany({
      where: { userId },
      select: {
        title: true,
        documentType: true,
        accountHolder: true,
        netIncome: true,
        taxDeductions: true,
        portfolioValue: true,
      },
    });

    const analyzedDocs = documents.filter(
      (d) => d.netIncome || d.taxDeductions || d.portfolioValue
    );

    if (analyzedDocs.length > 0) {
      const totalIncome = analyzedDocs.reduce((acc, d) => {
        const val = parseFloat((d.netIncome || "0").replace(/[^0-9.-]+/g, ""));
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      const totalTaxes = analyzedDocs.reduce((acc, d) => {
        const val = parseFloat(
          (d.taxDeductions || "0").replace(/[^0-9.-]+/g, "")
        );
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      const totalPortfolio = analyzedDocs.reduce((acc, d) => {
        const val = parseFloat(
          (d.portfolioValue || "0").replace(/[^0-9.-]+/g, "")
        );
        return acc + (isNaN(val) ? 0 : val);
      }, 0);

      const docSummaries = analyzedDocs
        .map(
          (d, i) =>
            `Document ${i + 1}: "${d.title}" (${d.documentType || "Unknown type"}) — Account Holder: ${d.accountHolder || "N/A"}, Net Income: ${d.netIncome || "N/A"}, Tax Deductions: ${d.taxDeductions || "N/A"}, Portfolio Value: ${d.portfolioValue || "N/A"}`
        )
        .join("\n");

      financialContext = `
--- USER'S FINANCIAL DATA (from ${analyzedDocs.length} analyzed document${analyzedDocs.length > 1 ? "s" : ""}) ---
Aggregate Totals:
• Total Net Income: ₹${totalIncome.toLocaleString("en-IN")}
• Total Tax Deductions: ₹${totalTaxes.toLocaleString("en-IN")}
• Total Portfolio Value: ₹${totalPortfolio.toLocaleString("en-IN")}

Individual Documents:
${docSummaries}
--- END OF FINANCIAL DATA ---`;
    }
  } catch (err) {
    console.error("Failed to fetch financial context for chat:", err);
    // Continue without context — the AI can still answer general financial questions
  }

  // 2. Build the system prompt with strict financial domain guardrails
  const systemPrompt = `You are FinIQ Advisor, an expert AI financial consultant specializing in:
- Personal finance analysis (income, expenses, savings optimization)
- Tax planning and deduction strategies (Indian tax system: Section 80C, 80D, HRA, capital gains)
- Investment portfolio analysis and risk assessment
- Angel investing and venture capital (SAFE notes, convertible notes, valuation multiples, cap tables, term sheets)
- Startup financial analysis and due diligence
- Financial document interpretation (pay slips, brokerage statements, tax forms)

STRICT RULES:
1. ONLY answer questions related to finance, investing, taxes, startups, and financial documents.
2. If asked about anything unrelated (coding, recipes, general knowledge, etc.), politely redirect: "I'm FinIQ Advisor, specializing in financial guidance. I can help with investment strategies, tax optimization, portfolio analysis, and startup due diligence. What financial topic can I assist you with?"
3. When the user's financial data is available below, reference specific numbers from their documents to give personalized advice.
4. Always add appropriate disclaimers that this is AI-generated guidance, not certified financial advice.
5. Use Indian Rupee (₹) as the default currency unless the user specifies otherwise.
6. Format responses with clear headings, bullet points, and structured sections for readability.
7. Keep responses focused and actionable — aim for 150-300 words unless a detailed breakdown is requested.

${financialContext || "The user has not uploaded or analyzed any financial documents yet. Provide general financial guidance and suggest they upload documents for personalized advice."}`;

  // 3. Construct Gemini API request with conversation history
  // Keep last 10 messages for context window management
  const recentHistory = cleanHistory.slice(-10);

  const contents = [
    // System instruction as first user message (Gemini API pattern)
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood. I'm FinIQ Advisor, ready to help with financial analysis, tax planning, investment strategies, and startup due diligence. How can I assist you today?" }] },
    // Conversation history
    ...recentHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
    // Current user message
    { role: "user", parts: [{ text: cleanMessage }] },
  ];

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  };

  // 4. Call Gemini with our proven fallback cascade
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
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s for chat (slightly longer for multi-turn)

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const aiText =
          data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
          throw new Error("Empty response from AI model");
        }

        console.log(`Chat response via ${modelName} (${aiText.length} chars)`);
        return { success: true, message: aiText, model: modelName };
      }

      const errText = await res.text();
      lastErrorDetails = `${modelName}: HTTP ${res.status} — ${errText.slice(0, 120)}`;
      console.warn(`Chat model ${modelName} returned ${res.status}, falling back...`);
    } catch (fetchErr: any) {
      lastErrorDetails = `${modelName}: ${fetchErr?.message || fetchErr}`;
      console.warn(`Chat fetch error with ${modelName}:`, fetchErr?.message);
    }
  }

  console.error("All chat models exhausted:", lastErrorDetails);
  throw new Error(
    "FinIQ Advisor is temporarily unavailable. Please try again in a moment."
  );
}
