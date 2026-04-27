import { NextResponse } from "next/server";
import { analyzeReport } from "@/services/aiService";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Report text is required" }, { status: 400 });
    }

    const analysis = await analyzeReport(text);
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze report" },
      { status: 500 }
    );
  }
}
