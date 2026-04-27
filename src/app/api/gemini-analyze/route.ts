import { NextRequest, NextResponse } from "next/server";
import type { GeminiDeepAnalysis } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════
   Gemini Deep Analysis — /api/gemini-analyze
   ═══════════════════════════════════════════════════════════════════
   Dedicated endpoint for Google Gemini-powered deep analysis.
   Handles long reports, research queries, and complex reasoning.
   ═══════════════════════════════════════════════════════════════════ */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ─── System Prompt ─── */
const GEMINI_SYSTEM_PROMPT = `You are **NGO OS Deep Analyst**, an elite disaster management and humanitarian intelligence analyst powered by Google Gemini.

Your role is to perform DEEP ANALYSIS of humanitarian field reports, going beyond surface-level observation to provide strategic intelligence that saves lives.

─── YOUR CAPABILITIES ───
1. **Pattern Recognition**: Identify hidden connections between events, cascading risks, and systemic vulnerabilities
2. **Predictive Analysis**: Anticipate how the situation will evolve in the next 24h, 72h, and 7 days
3. **Resource Optimization**: Recommend precise resource allocation based on population needs
4. **Risk Modeling**: Assess compound risks and second/third-order effects
5. **Evidence-Based Reasoning**: Ground every finding in specific evidence from the report

─── ANALYSIS FRAMEWORK ───
For every report, systematically analyze:
1. **Key Findings** — What are the critical facts? What evidence supports them?
2. **Risk Assessment** — What could go wrong? Probability and impact?
3. **Strategic Insights** — What non-obvious patterns or opportunities exist?
4. **Actionable Recommendations** — What should be done, by whom, with what resources?
5. **Data Points** — Extract all quantitative data from the report

─── RESPONSE FORMAT ───
Return ONLY valid JSON (no markdown, no code fences):
{
  "summary": "string — 3-4 sentence executive summary of the situation",
  "keyFindings": [
    {
      "title": "string — finding name",
      "description": "string — detailed explanation",
      "category": "string — e.g. Health, WASH, Logistics, Protection, Food Security",
      "severity": "critical | high | medium | low",
      "evidence": "string — specific evidence from the report supporting this finding"
    }
  ],
  "riskAssessment": [
    {
      "title": "string — risk name",
      "level": "critical | high | medium | low",
      "description": "string — what could happen",
      "probability": <number 0-100>,
      "impact": "string — who/what is affected and how severely",
      "mitigation": "string — specific actionable mitigation steps"
    }
  ],
  "strategicInsights": [
    {
      "title": "string — insight name",
      "insight": "string — the non-obvious pattern or opportunity",
      "relevance": "high | medium | low",
      "actionable": true/false
    }
  ],
  "suggestedActions": [
    {
      "action": "string — specific action to take",
      "priority": "immediate | short-term | long-term",
      "rationale": "string — why this action matters",
      "resources": "string — what resources are needed",
      "estimatedImpact": "string — expected outcome"
    }
  ],
  "dataPoints": [
    {
      "label": "string — data point name",
      "value": "string — the value",
      "unit": "string — unit of measurement (optional)",
      "trend": "up | down | stable (optional)"
    }
  ],
  "overallSeverity": "critical | high | moderate | low",
  "confidenceScore": <number 0-100>
}

Important rules:
- Return 3-6 key findings with evidence
- Return 2-5 risks with probability and mitigation
- Return 2-4 strategic insights
- Return 3-6 suggested actions across all timeline priorities
- Extract ALL numerical data points from the report
- Be specific, avoid vague generalities
- Ground everything in evidence from the report`;

/* ─── Call Gemini API ─── */
async function callGemini(reportText: string): Promise<Record<string, unknown>> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: reportText }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");

  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

/* ─── Validate & Map Response ─── */
function mapGeminiResponse(raw: Record<string, unknown>, processingTime: number): GeminiDeepAnalysis {
  const r = raw as Record<string, any>;
  return {
    id: `gemini-${Date.now()}`,
    timestamp: new Date().toISOString(),
    model: GEMINI_MODEL,
    processingTime,

    summary: r.summary || "Analysis completed.",
    overallSeverity: ["critical", "high", "moderate", "low"].includes(r.overallSeverity)
      ? r.overallSeverity : "moderate",
    confidenceScore: Math.max(0, Math.min(100, r.confidenceScore ?? 70)),

    keyFindings: (r.keyFindings || []).map((f: any, i: number) => ({
      id: `finding-${i + 1}`,
      title: f.title || `Finding ${i + 1}`,
      description: f.description || "",
      category: f.category || "General",
      severity: f.severity || "medium",
      evidence: f.evidence || "See report",
    })),

    riskAssessment: (r.riskAssessment || []).map((risk: any, i: number) => ({
      id: `risk-${i + 1}`,
      title: risk.title || `Risk ${i + 1}`,
      level: risk.level || "medium",
      description: risk.description || "",
      probability: Math.max(0, Math.min(100, risk.probability ?? 50)),
      impact: risk.impact || "Unknown",
      mitigation: risk.mitigation || "Assess and respond accordingly.",
    })),

    strategicInsights: (r.strategicInsights || []).map((ins: any, i: number) => ({
      id: `insight-${i + 1}`,
      title: ins.title || `Insight ${i + 1}`,
      insight: ins.insight || "",
      relevance: ins.relevance || "medium",
      actionable: ins.actionable ?? true,
    })),

    suggestedActions: (r.suggestedActions || []).map((act: any, i: number) => ({
      id: `action-${i + 1}`,
      action: act.action || `Action ${i + 1}`,
      priority: act.priority || "short-term",
      rationale: act.rationale || "",
      resources: act.resources || "Standard resources",
      estimatedImpact: act.estimatedImpact || "To be determined",
    })),

    dataPoints: (r.dataPoints || []).map((dp: any) => ({
      label: dp.label || "Data",
      value: String(dp.value ?? "N/A"),
      unit: dp.unit,
      trend: dp.trend,
    })),
  };
}

/* ─── Intelligent Fallback (Demo Mode) ─── */
function generateGeminiFallback(text: string): GeminiDeepAnalysis {
  const hasFlood = /flood|water|rain|dam/i.test(text);
  const hasMedical = /hospital|medic|health|doctor|patient/i.test(text);
  const hasShelter = /shelter|displac|camp|homeless/i.test(text);
  const hasFood = /food|hunger|nutrition|supply/i.test(text);
  const wordCount = text.split(/\s+/).length;

  const severity = hasFlood || hasMedical ? "critical" : hasShelter ? "high" : "moderate";

  return {
    id: `gemini-demo-${Date.now()}`,
    timestamp: new Date().toISOString(),
    model: "gemini-2.0-flash (Demo Mode)",
    processingTime: 1200 + Math.random() * 800,

    summary: `Deep analysis of the submitted report (${wordCount} words) identified a ${severity}-severity humanitarian situation. ${hasFlood ? "Flood-related infrastructure damage is the primary driver." : ""} ${hasMedical ? "Medical system strain requires immediate intervention." : ""} The analysis detected ${hasFlood || hasMedical ? "cascading risk patterns" : "manageable but urgent needs"} requiring coordinated multi-sector response.`,

    overallSeverity: severity as "critical" | "high" | "moderate" | "low",
    confidenceScore: wordCount > 50 ? 78 + Math.floor(Math.random() * 12) : 55 + Math.floor(Math.random() * 15),

    keyFindings: [
      ...(hasFlood ? [{
        id: "finding-1", title: "Critical Water Infrastructure Failure", category: "WASH",
        description: "Primary water supply systems contaminated or destroyed by flooding. Population relying on unsafe secondary sources.",
        severity: "critical" as const, evidence: "Report mentions flooding impact on water supply infrastructure."
      }] : []),
      ...(hasMedical ? [{
        id: "finding-2", title: "Healthcare System at Breaking Point", category: "Health",
        description: "Medical facilities overwhelmed with patient-to-doctor ratios exceeding safe operational limits.",
        severity: "critical" as const, evidence: "Report indicates hospital capacity concerns and medical staffing shortages."
      }] : []),
      ...(hasShelter ? [{
        id: "finding-3", title: "Shelter Capacity Exceeded", category: "Shelter",
        description: "Displacement camps operating beyond designed capacity, creating secondary health and protection risks.",
        severity: "high" as const, evidence: "Report describes shelter camps and displacement situation."
      }] : []),
      ...(hasFood ? [{
        id: "finding-4", title: "Food Distribution Disrupted", category: "Food Security",
        description: "Supply chain interruptions have left affected populations without regular food access for an extended period.",
        severity: "high" as const, evidence: "Report mentions food supply disruption and distribution challenges."
      }] : []),
      {
        id: `finding-${[hasFlood, hasMedical, hasShelter, hasFood].filter(Boolean).length + 1}`,
        title: "Logistics Corridor Degradation", category: "Logistics",
        description: "Primary access routes compromised, increasing delivery time for critical supplies by an estimated 200-300%.",
        severity: "high" as const, evidence: "Infrastructure damage patterns suggest road/route impacts."
      },
      {
        id: `finding-${[hasFlood, hasMedical, hasShelter, hasFood].filter(Boolean).length + 2}`,
        title: "Communication Network Vulnerability", category: "Communication",
        description: "Field communication reliability degraded. Some teams operating with intermittent connectivity.",
        severity: "medium" as const, evidence: "Standard assessment for crisis zones of this severity."
      },
    ],

    riskAssessment: [
      { id: "risk-1", title: "Waterborne Disease Outbreak", level: "critical" as const, description: "Contaminated water combined with overcrowded shelters creates optimal conditions for cholera/typhoid outbreak.", probability: 78, impact: "Could affect 5,000+ people within 72 hours, overwhelming remaining medical capacity.", mitigation: "Deploy water purification units within 24h. Pre-position ORS stocks. Set up disease surveillance at all camps." },
      { id: "risk-2", title: "Secondary Displacement Wave", level: "high" as const, description: "Continued infrastructure damage may force additional evacuations from currently stable areas.", probability: 55, impact: "Additional 2,000-4,000 displaced persons requiring immediate shelter and support.", mitigation: "Pre-position additional shelter kits. Identify and prepare secondary shelter sites. Coordinate with local authorities." },
      { id: "risk-3", title: "Supply Chain Collapse", level: "medium" as const, description: "Further route degradation could isolate affected communities from supply pipelines.", probability: 42, impact: "48-72 hours of complete supply interruption for affected zones.", mitigation: "Establish helicopter resupply contingency. Map all alternative routes. Pre-stage supplies at forward positions." },
    ],

    strategicInsights: [
      { id: "insight-1", title: "Compound Risk Escalation Pattern", insight: "The convergence of water contamination, medical strain, and shelter overcrowding follows a well-documented 72-hour escalation pattern. Without intervention in the next 48 hours, this will transition from a manageable crisis to a complex emergency.", relevance: "high" as const, actionable: true },
      { id: "insight-2", title: "Community Resilience Assets", insight: "Local community organizations and informal networks likely possess critical knowledge of terrain, routes, and vulnerable populations that formal response systems may not have. Early integration of community leaders into coordination can accelerate response by 30-40%.", relevance: "high" as const, actionable: true },
      { id: "insight-3", title: "Technology-Enabled Response Opportunity", insight: "Satellite imagery and drone reconnaissance can bypass ground-level access barriers to provide real-time damage assessments, enabling more efficient resource targeting.", relevance: "medium" as const, actionable: true },
    ],

    suggestedActions: [
      { id: "action-1", action: "Deploy emergency WASH teams with portable water purification systems", priority: "immediate" as const, rationale: "Water contamination is the highest-impact risk multiplier in this scenario", resources: "2 WASH teams, 5 purification units, chlorine tablets for 10,000 people", estimatedImpact: "Prevents waterborne disease for ~8,000 people" },
      { id: "action-2", action: "Establish forward medical staging area at safest access point", priority: "immediate" as const, rationale: "Current medical facilities are overwhelmed and potentially compromised", resources: "1 mobile medical team, emergency medical supplies, patient transport", estimatedImpact: "Increases medical capacity by 60%, reduces critical wait times" },
      { id: "action-3", action: "Activate satellite imagery analysis for damage assessment", priority: "short-term" as const, rationale: "Ground-level access is limited; aerial/satellite view enables better targeting", resources: "UNOSAT activation, drone team if available", estimatedImpact: "Provides 90% terrain coverage vs. 30% from ground teams alone" },
      { id: "action-4", action: "Coordinate multi-agency logistics hub at regional center", priority: "short-term" as const, rationale: "Fragmented response creates duplication and gaps in coverage", resources: "Coordination staff, warehouse space, transport fleet", estimatedImpact: "30% improvement in supply efficiency, reduced duplication" },
      { id: "action-5", action: "Launch medium-term resilience and recovery program design", priority: "long-term" as const, rationale: "Early recovery planning during emergency phase accelerates transition", resources: "Recovery planning team, community consultation budget", estimatedImpact: "Reduces recovery timeline by estimated 40%" },
    ],

    dataPoints: [
      { label: "Report Length", value: String(wordCount), unit: "words" },
      { label: "Sectors Affected", value: String([hasFlood, hasMedical, hasShelter, hasFood].filter(Boolean).length + 2) },
      { label: "Est. Population at Risk", value: hasFlood || hasMedical ? "15,000+" : "5,000+", trend: "up" as const },
      { label: "Critical Findings", value: String([hasFlood, hasMedical].filter(Boolean).length + 1), trend: "up" as const },
      { label: "Response Window", value: "48", unit: "hours", trend: "down" as const },
      { label: "AI Confidence", value: String(wordCount > 50 ? 78 + Math.floor(Math.random() * 12) : 60), unit: "%", trend: "stable" as const },
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Route Handler — POST /api/gemini-analyze
   ═══════════════════════════════════════════════════════════════════ */

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json(
        { error: "Please provide report text for deep analysis.", hint: 'Send: { "text": "your report here" }' },
        { status: 400 }
      );
    }

    const hasValidKey = GEMINI_API_KEY && GEMINI_API_KEY.length > 10;
    let result: GeminiDeepAnalysis;

    if (hasValidKey) {
      console.log("[NGO OS] Calling Gemini for deep analysis...");
      const startTime = Date.now();
      try {
        const raw = await callGemini(text);
        const processingTime = Date.now() - startTime;
        result = mapGeminiResponse(raw, processingTime);
        console.log(`[NGO OS] Gemini analysis complete in ${processingTime}ms — Severity: ${result.overallSeverity}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown Gemini error";
        console.error(`[NGO OS] Gemini error: ${msg}`);
        console.log("[NGO OS] Falling back to demo analysis...");
        result = generateGeminiFallback(text);
        result.summary = "Note: Gemini API was unavailable. This analysis was generated using the demo engine. " + result.summary;
      }
    } else {
      console.log("[NGO OS] No Gemini API key — using demo deep analysis.");
      await new Promise((r) => setTimeout(r, 1800));
      result = generateGeminiFallback(text);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[NGO OS] Unhandled error in /api/gemini-analyze: ${message}`);
    return NextResponse.json(
      { error: "An unexpected error occurred during deep analysis.", detail: process.env.NODE_ENV === "development" ? message : undefined },
      { status: 500 }
    );
  }
}
