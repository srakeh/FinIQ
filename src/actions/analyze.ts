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
    
 
    // Construct the direct REST API URL using the latest available model
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
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