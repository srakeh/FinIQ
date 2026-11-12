"use server";

import { auth } from "@clerk/nextjs/server";

export async function extractTextFromDocument(fileUrl: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

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
    
    // Primary model: gemini-3.5-flash (with automatic fallback on 404/503)
    const candidateModels = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest"];
    
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

    // Loop through candidate models if one encounters a permanent error or heavy traffic
    for (const modelName of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const maxRetries = 2;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          if (res.ok) {
            geminiResponse = res;
            successfulModel = modelName;
            break;
          }

          // If 503, wait and retry
          if (res.status === 503) {
            attempt++;
            console.warn(`Gemini (${modelName}) 503 busy. Retry ${attempt}/${maxRetries}...`);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            continue;
          }

          // If 404, break to try the next model
          break;
        } catch (fetchErr) {
          console.warn(`Fetch error with ${modelName}:`, fetchErr);
          break;
        }
      }

      if (geminiResponse && geminiResponse.ok) {
        break;
      }
    }

    // Check if we exhausted retries or hit a different API error
    if (!geminiResponse || !geminiResponse.ok) {
      const errorText = await geminiResponse?.text();
      console.error("Gemini API Error:", errorText);
      throw new Error("Failed to communicate with Gemini API");
    }

    const data = await geminiResponse.json();
    const aiResponseText = data.candidates[0].content.parts[0].text;
    
    const structuredData = JSON.parse(aiResponseText);
    console.log("AI Analysis Complete:", structuredData);

    return { success: true, data: structuredData };

  } catch (error) {
    console.error("Analysis Pipeline Error:", error);
    throw new Error("Failed to analyze document");
  }
}