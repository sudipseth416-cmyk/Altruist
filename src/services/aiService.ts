import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API securely on the server side
// Note: In Next.js, env variables without NEXT_PUBLIC_ are securely hidden from the browser.
// We fall back to VITE_GEMINI_API_KEY if the user explicitly set it that way per their instructions.
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface AnalysisResult {
  summary: string;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  recommendations: string[];
}

export async function analyzeReport(text: string): Promise<AnalysisResult> {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Running in DEMO MODE with simulated intelligence.");
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Simple keyword-based logic for demo purposes
    const lowerText = text.toLowerCase();
    let risk: "Low" | "Medium" | "High" | "Critical" = "Low";
    
    if (lowerText.includes("death") || lowerText.includes("casualt") || lowerText.includes("urgent")) {
      risk = "Critical";
    } else if (lowerText.includes("flood") || lowerText.includes("fire") || lowerText.includes("displace")) {
      risk = "High";
    } else if (lowerText.includes("shortage") || lowerText.includes("damage")) {
      risk = "Medium";
    }

    return {
      summary: "[DEMO MODE] " + (text.length > 100 ? text.substring(0, 97) + "..." : text),
      riskLevel: risk,
      recommendations: [
        "Deploy local assessment team immediately.",
        "Allocate emergency supply kits to affected region.",
        "Establish secure communication channel with field ops.",
      ],
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Analyze the following NGO field report and return a structured JSON response. Do not include markdown formatting like \`\`\`json. Return raw JSON.
Required format:
{
  "summary": "Short summary (2 lines)",
  "riskLevel": "Low", // strictly one of: Low, Medium, High, Critical
  "recommendations": ["Action 1", "Action 2", "Action 3"]
}

Report:
${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textOutput = response.text();
    
    // Attempt to parse the raw JSON from Gemini
    try {
      // Removing any potential markdown blocks if Gemini added them by accident
      const cleanJson = textOutput.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      return {
        summary: parsed.summary || "No summary provided.",
        riskLevel: ["Low", "Medium", "High", "Critical"].includes(parsed.riskLevel) ? parsed.riskLevel : "Medium",
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", textOutput);
      throw new Error("AI returned an invalid format. Please try again.");
    }
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    throw new Error("Failed to analyze report using Gemini AI.");
  }
}
