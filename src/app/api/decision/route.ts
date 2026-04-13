import { NextRequest, NextResponse } from "next/server";
import type { DecisionPayload } from "@/lib/types";

/**
 * POST /api/decision
 * Records a human decision (approve/modify/reject) on an AI analysis.
 * In production, this would persist to a database and trigger workflows.
 */
export async function POST(request: NextRequest) {
  try {
    const body: DecisionPayload = await request.json();
    const { analysisId, decision, notes } = body;

    if (!analysisId || !decision) {
      return NextResponse.json(
        { error: "Missing required fields: analysisId and decision." },
        { status: 400 }
      );
    }

    if (!["approve", "modify", "reject"].includes(decision)) {
      return NextResponse.json(
        { error: "Decision must be one of: approve, modify, reject." },
        { status: 400 }
      );
    }

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const responseMessages = {
      approve:
        "Decision approved. Initiating humanitarian response protocols. Field teams have been notified.",
      modify:
        "Decision recorded with modifications. Updated action plan has been sent for secondary review.",
      reject:
        "Decision rejected. Analysis flagged for re-evaluation. Additional data collection has been requested.",
    };

    return NextResponse.json(
      {
        success: true,
        analysisId,
        decision,
        notes: notes || null,
        message: responseMessages[decision],
        timestamp: new Date().toISOString(),
        workflowId: `WF-${Date.now().toString(36).toUpperCase()}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Decision API error:", error);
    return NextResponse.json(
      { error: "Failed to process decision. Please try again." },
      { status: 500 }
    );
  }
}
