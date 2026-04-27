import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CaseModel from "@/lib/case-model";
import { LocalDB } from "@/lib/local-db";

/* ═══════════════════════════════════════════════════════════════════
   GET /api/cases/[id]
   Fetch case details with LocalDB fallback.
   ═══════════════════════════════════════════════════════════════════ */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    try {
      await connectDB();
      const caseData = await CaseModel.findOne({ caseId: params.id });
      if (caseData) return NextResponse.json(caseData);
    } catch {
      const caseData = await LocalDB.findById(params.id);
      if (caseData) return NextResponse.json(caseData);
    }
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ═══════════════════════════════════════════════════════════════════
   PUT /api/cases/[id]
   Update case details with LocalDB fallback.
   ═══════════════════════════════════════════════════════════════════ */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, action, feedback, by, note, actions } = body;
    const now = new Date().toISOString();

    let caseData: any = null;
    let usingLocal = false;

    try {
      await connectDB();
      caseData = await CaseModel.findOne({ caseId: params.id });
    } catch {
      caseData = await LocalDB.findById(params.id);
      usingLocal = true;
    }

    if (!caseData) return NextResponse.json({ error: "Case not found" }, { status: 404 });

    /* ── Apply Updates ── */
    if (status) {
      caseData.status = status;
      caseData.timeline.push({ date: now, event: `Status updated to ${status}`, type: "update" });
    }

    // Handle single action
    if (action) {
      caseData.actionsTaken.push({ date: now, action, by: by || "Operator" });
      caseData.timeline.push({ date: now, event: `Action: ${action}`, type: "action" });
    }

    // Handle bulk actions (some components send this)
    if (actions && Array.isArray(actions)) {
      actions.forEach((a: any) => {
        caseData.actionsTaken.push({ date: now, action: a.action, by: a.by || "Operator" });
        caseData.timeline.push({ date: now, event: `Action: ${a.action}`, type: "action" });
      });
    }

    if (note) {
      caseData.feedback.push({ date: now, note });
      caseData.timeline.push({ date: now, event: `Feedback: ${note.slice(0, 30)}...`, type: "update" });
    }

    // Handle bulk feedback
    if (body.feedback && Array.isArray(body.feedback)) {
       body.feedback.forEach((f: any) => {
         caseData.feedback.push({ date: now, note: f.note });
         caseData.timeline.push({ date: now, event: `Feedback: ${f.note.slice(0, 30)}...`, type: "update" });
       });
    }

    /* ── Save ── */
    if (usingLocal) {
      await LocalDB.save(caseData);
    } else {
      await caseData.save();
    }

    return NextResponse.json({ success: true, caseId: params.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
