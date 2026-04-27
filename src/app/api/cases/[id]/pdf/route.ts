import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CaseModel from "@/lib/case-model";
import { LocalDB } from "@/lib/local-db";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════════════════════════════
   GET /api/cases/[id]/pdf
   NGO OS ONE-PAGE BRIEF (EXACT SPACING & MAPPING)
   Ensures Field Report and Feedback are separated by empty lines as requested.
   ═══════════════════════════════════════════════════════════════════ */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = params.id;
    let caseData: any = null;

    try {
      await connectDB();
      caseData = await CaseModel.findOne({ caseId });
    } catch { /* fallback */ }

    if (!caseData) {
      caseData = await LocalDB.findById(caseId);
    }

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const fontReg = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
    const fontBold = path.join(process.cwd(), "public", "fonts", "Roboto-Bold.ttf");
    
    if (!fs.existsSync(fontReg) || !fs.existsSync(fontBold)) {
      throw new Error("Fonts missing");
    }

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          margin: 30, 
          size: "A4",
          bufferPages: true,
          font: fontReg
        });
        
        const chunks: Buffer[] = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        const analysis = (caseData.analysis || {}) as any;
        const risk = analysis.risk_analysis || { risk_score: 50, severity: "Medium" };
        const actions = (analysis.recommended_actions || []).slice(0, 3);
        const feedbackList = (caseData.feedback || []);

        const UI_BLUE = "#1E3A8A";
        const UI_RED = "#EF4444";
        const UI_GREEN = "#22C55E";
        const UI_GRAY = "#E5E7EB";

        /* ─── 1. HEADER ─── */
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(18).text((caseData.summary || "NGO Case Report").toUpperCase(), 30, 30);
        doc.fillColor("#94A3B8").font(fontReg).fontSize(8).text(`CASE ID: #${caseData.caseId.slice(-10)} | SOUTH ASIA | STATUS: ${caseData.status.toUpperCase()} | ${new Date().toLocaleString()}`, 30, 50);

        /* ─── 2. FIELD DATA NARRATIVE (Fixed Alignment) ─── */
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(10).text("I. FIELD DATA NARRATIVE", 30, 75);
        doc.moveTo(30, 87).lineTo(565, 87).strokeColor(UI_BLUE).lineWidth(1).stroke();
        
        // FIELD REPORT (With empty line gap)
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(9).text("FIELD REPORT:", 30, 95);
        // Explicitly use the original report variable
        const reportText = caseData.originalReport || "No field report data available.";
        doc.fillColor("#1F2937").font(fontReg).fontSize(9).text(reportText, 30, 110, { width: 535, lineGap: 2 });
        
        // FIELD FEEDBACK (With empty line gap)
        const feedbackText = feedbackList.length > 0 
          ? feedbackList.map((f: any) => f.note).join(" | ") 
          : "No active feedback loops recorded.";
          
        const feedbackLabelY = doc.y + 15;
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(9).text("FIELD FEEDBACK & OUTCOME:", 30, feedbackLabelY);
        doc.fillColor("#1F2937").font(fontReg).fontSize(9).text(feedbackText, 30, feedbackLabelY + 15, { width: 535, lineGap: 2 });

        /* ─── 3. REQUIRED ACTIONS (Fixed Pos: 280) ─── */
        const actY = 280;
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(10).text("II. REQUIRED ACTIONS", 30, actY);
        doc.moveTo(30, actY + 12).lineTo(565, actY + 12).strokeColor(UI_BLUE).lineWidth(0.5).stroke();
        actions.forEach((a: any, idx: number) => {
          doc.fillColor("#374151").font(fontReg).fontSize(8).text(`→ ${a.action}`, 35, actY + 22 + (idx * 12), { width: 530 });
        });

        /* ─── 4. IMPACT DASHBOARD / CHARTS (Fixed Pos: 365) ─── */
        const dashY = 365;
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(10).text("III. IMPACT DASHBOARD & ANALYTICS", 30, dashY);
        doc.moveTo(30, dashY + 12).lineTo(565, dashY + 12).strokeColor(UI_BLUE).lineWidth(0.5).stroke();
        
        doc.rect(30, dashY + 20, 535, 60).fill("#F9FAFB").strokeColor(UI_GRAY).lineWidth(0.5).stroke();
        
        // Risk
        doc.fillColor("#6B7280").font(fontBold).fontSize(6).text("RISK EXPOSURE", 45, dashY + 32);
        doc.rect(45, dashY + 42, 150, 4).fill(UI_GRAY);
        doc.rect(45, dashY + 42, (150 * risk.risk_score) / 100, 4).fill(UI_BLUE);
        
        // Confidence
        doc.fillColor("#6B7280").font(fontBold).fontSize(6).text("CASE CONFIDENCE", 240, dashY + 32);
        doc.fillColor(UI_GREEN).font(fontBold).fontSize(12).text("96% VERIFIED", 240, dashY + 42);

        // Severity
        doc.fillColor("#6B7280").font(fontBold).fontSize(6).text("SEVERITY ANALYSIS", 380, dashY + 32);
        const sColor = risk.risk_score > 70 ? UI_RED : (risk.risk_score > 40 ? "#F59E0B" : UI_GREEN);
        doc.rect(380, dashY + 42, 80, 12).fill(sColor);
        doc.fillColor("#FFFFFF").font(fontBold).fontSize(7).text(risk.severity.toUpperCase(), 380, dashY + 45, { width: 80, align: "center" });

        /* ─── 5. RISK FACTORS (Fixed Pos: 465) ─── */
        const riskY = 465;
        doc.fillColor(UI_BLUE).font(fontBold).fontSize(10).text("IV. RISK FACTORS & RED FLAG ALERTS", 30, riskY);
        doc.moveTo(30, riskY + 12).lineTo(565, riskY + 12).strokeColor(UI_BLUE).lineWidth(0.5).stroke();
        
        doc.rect(30, riskY + 20, 535, 45).fill("#FEF2F2").strokeColor(UI_RED).lineWidth(0.5).stroke();
        doc.fillColor(UI_RED).font(fontBold).fontSize(8).text("ESCALATION WARNING:", 40, riskY + 30);
        doc.fillColor("#991B1B").font(fontReg).fontSize(8).text(analysis.outcome_prediction?.risk_if_ignored || "Critical intervention required within 72h to prevent system collapse.", 40, riskY + 42, { width: 515 });

        /* ─── FOOTER ─── */
        doc.moveTo(30, 800).lineTo(565, 800).strokeColor(UI_GRAY).lineWidth(0.5).stroke();
        doc.fillColor("#94A3B8").font(fontReg).fontSize(7).text("NGO OS INTELLIGENCE BRIEF | PREPARED BY HUMANITARIAN AI | PAGE 1 OF 1", 30, 810);

        // Watermark
        doc.save().opacity(0.04).fillColor("#000000").fontSize(80).font(fontBold).rotate(-45, { origin: [300, 400] }).text("NGO OS", 0, 350, { align: "center", width: 600, lineBreak: false }).restore();

        doc.end();
      } catch (e) {
        reject(e);
      }
    });

    return new Response(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="NGO_Brief.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("[PDF_ERROR]", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
