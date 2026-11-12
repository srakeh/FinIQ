"use server";

import { auth } from "@clerk/nextjs/server";
import { rateLimit, RateLimits } from "@/lib/rate-limit";

export async function extractTextFromDocument(fileUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const limitCheck = rateLimit(userId, RateLimits.DOCUMENT_ANALYZE);
  if (!limitCheck.success) {
    throw new Error(
      `Analysis limit reached. Please wait ${Math.ceil(
        limitCheck.resetMs / 1000
      )}s before submitting another document.`
    );
  }

  // Dynamically map file extensions to Gemini-supported MIME types
  const extension = fileUrl.toLowerCase().split('.').pop()?.split('?')[0];
  let mimeType = "";

  switch (extension) {
    case "pdf": mimeType = "application/pdf"; break;
    case "png": mimeType = "image/png"; break;
    case "jpg":
    case "jpeg": mimeType = "image/jpeg"; break;
    case "webp": mimeType = "image/webp"; break;
    case "csv": mimeType = "text/csv"; break;
    case "txt": mimeType = "text/plain"; break;
    default:
      throw new Error("Unsupported file type. Please upload a PDF, Image, CSV, or TXT.");
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Failed to fetch document from storage");
    
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    
    // Primary model: gemini-3.1-flash-lite (fastest, under 1s, verified 200 OK)
    // with automatic fallback cascade on temporary spikes
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-3.1-flash-lite-preview",
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash"
    ];
    
    // Extract the body payload to make the retry loop cleaner
    const requestBody = {
      contents: [{
        parts: [
          { text: `
            Analyze this personal finance document and extract the required fields. 
            You MUST return ONLY a valid JSON object matching this exact structure:
            {
              "documentType": "The type of document (e.g., Pay Slip, Brokerage Statement, Tax Form)",
              "accountHolder": "Name of the employee or investor",
              "netIncome": "Net salary or total deposited income. Return 'N/A' if not present",
              "taxDeductions": "Total taxes or TDS deducted. Return 'N/A' if not present",
              "portfolioValue": "Total value of stock holdings or account balance. Return 'N/A' if not present"
            }
          ` },
          { inline_data: { mime_type: mimeType, data: base64Data } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    let geminiResponse: Response | null = null;
    let successfulModel = "";
    let lastErrorDetails = "";

    // Loop through candidate models if one encounters a temporary error or heavy traffic
    for (const modelName of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          geminiResponse = res;
          successfulModel = modelName;
          console.log(`Gemini analysis succeeded using model: ${modelName}`);
          break;
        }

        const errText = await res.text();
        lastErrorDetails = `Model ${modelName} returned HTTP ${res.status}: ${errText.slice(0, 120)}`;
        console.warn(`Gemini (${modelName}) returned ${res.status}. Falling back to next model...`);
      } catch (fetchErr: any) {
        lastErrorDetails = `Model ${modelName} fetch error: ${fetchErr?.message || fetchErr}`;
        console.warn(`Fetch error with ${modelName}:`, fetchErr?.message);
      }
    }

    // Check if we exhausted candidate models
    if (!geminiResponse || !geminiResponse.ok) {
      console.error("Gemini API Error details:", lastErrorDetails);
      throw new Error("Failed to communicate with Gemini API. " + lastErrorDetails);
    }

    const data = await geminiResponse.json();
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponseText) {
      throw new Error("No analysis content returned from AI model");
    }

    // Strip markdown code fences if present to guarantee valid JSON parsing
    let cleanJson = aiResponseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/```\s*$/, "");
    }

    const structuredData = JSON.parse(cleanJson.trim());
    console.log("AI Analysis Complete via", successfulModel, ":", structuredData);

    return { success: true, model: successfulModel, data: structuredData };

  } catch (error) {
    console.error("Analysis Pipeline Error:", error);
    throw new Error("Failed to analyze document");
  }
}