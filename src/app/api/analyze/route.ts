import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult, AIModelResponse } from "@/lib/types";
import { maskAnalysisResult } from "@/lib/privacy";

/* ═══════════════════════════════════════════════════════════════════
   Configuration
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Replace with your actual API key.
 * In production, use an environment variable:
 *   OPENAI_API_KEY=sk-... in .env.local
 */
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "YOUR_OPENAI_API_KEY_HERE";

const OPENAI_API_URL =
  process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/* ═══════════════════════════════════════════════════════════════════
   System Prompt — instructs the AI to act as a humanitarian analyst
   ═══════════════════════════════════════════════════════════════════ */

const SYSTEM_PROMPT = `You are **NGO OS Humanitarian Analyst**, an expert AI advisor for humanitarian organizations responding to crises worldwide.

Your task is to analyze field reports, situation data, and other humanitarian inputs, then produce a **structured JSON assessment** that decision-makers can act on immediately.

─── ANALYSIS GUIDELINES ───
1. Identify all humanitarian issues present (water, food, health, shelter, protection, logistics, etc.)
2. Assign a severity to each: critical | high | medium | low
3. Categorize each issue (WASH, Food Security, Health, Shelter, Protection, Logistics, Education, Access, etc.)
4. Score overall priority from 0-100 (100 = most urgent)
5. Recommend concrete, actionable interventions with timeline priority
6. Flag any compounding risks or cascading dangers
7. Provide a plain-English explanation summarizing your analysis in 2-3 sentences
8. Rate your own confidence from 0-100 based on how much usable information was provided
9. Estimate humanitarian impact (people affected, tasks generated, regions impacted, urgency level)

─── RESPONSE FORMAT ───
Return ONLY valid JSON matching this exact schema (no markdown, no code fences):

{
  "issues": [
    {
      "title": "string — short issue name",
      "severity": "critical | high | medium | low",
      "description": "string — one sentence explaining the issue",
      "category": "string — e.g. WASH, Health, Shelter, Food Security, Logistics, Protection, Access"
    }
  ],
  "priority": <number 0-100>,
  "recommendations": [
    {
      "action": "string — specific actionable recommendation",
      "priority": "immediate | short-term | long-term",
      "estimatedImpact": "string — who/how many this helps"
    }
  ],
  "risks": [
    {
      "title": "string — risk name",
      "level": "critical | warning | info",
      "description": "string — what could go wrong and why",
      "probability": <number 0-100>,
      "mitigation": "string — specific actionable mitigation strategy"
    }
  ],
  "explanation": "string — 2-3 sentence plain-English summary of the overall situation and recommended course of action",
  "confidence": <number 0-100>,
  "impactEstimate": {
    "peopleAffected": <number>,
    "tasksGenerated": <number>,
    "regionsImpacted": <number>,
    "urgencyLevel": "Critical | High | Moderate | Low"
  }
}

Important rules:
- Always return between 2 and 6 issues
- Always return between 2 and 6 recommendations
- Always return between 1 and 4 risks
- Be specific and realistic — avoid vague generalities
- If the input is too vague, still provide your best assessment but lower your confidence score
- If the input is not humanitarian in nature, return a low priority score with an explanation`;

/* ═══════════════════════════════════════════════════════════════════
   AI Model Call
   ═══════════════════════════════════════════════════════════════════ */

async function callAIModel(userInput: string): Promise<AIModelResponse> {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(
      `AI model returned ${response.status}: ${err.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI model returned an empty response.");
  }

  // Parse the JSON — strip potential markdown fences if model ignores instructions
  const cleaned = content
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsed: AIModelResponse = JSON.parse(cleaned);
  return parsed;
}

/* ═══════════════════════════════════════════════════════════════════
   Validation & Mapping — AI response → AnalysisResult
   ═══════════════════════════════════════════════════════════════════ */

function validateAndMap(raw: AIModelResponse): AnalysisResult {
  // Clamp scores to valid ranges
  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.round(val)));

  const validSeverities = ["critical", "high", "medium", "low"] as const;
  const validPriorities = ["immediate", "short-term", "long-term"] as const;
  const validLevels = ["critical", "warning", "info"] as const;

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),

    priorityScore: clamp(raw.priority ?? 50, 0, 100),
    confidenceScore: clamp(raw.confidence ?? 50, 0, 100),
    explanation: raw.explanation || "Analysis completed. Review the detected issues and recommended actions below.",

    detectedIssues: (raw.issues || []).map((issue, i) => ({
      id: `issue-${i + 1}`,
      title: issue.title || `Issue ${i + 1}`,
      severity: validSeverities.includes(issue.severity) ? issue.severity : "medium",
      description: issue.description || "",
      category: issue.category || "General",
    })),

    recommendedActions: (raw.recommendations || []).map((rec, i) => ({
      id: `action-${i + 1}`,
      action: rec.action || `Action ${i + 1}`,
      priority: validPriorities.includes(rec.priority) ? rec.priority : "short-term",
      estimatedImpact: rec.estimatedImpact || "Unknown",
    })),

    riskAlerts: (raw.risks || []).map((risk, i) => ({
      id: `risk-${i + 1}`,
      title: risk.title || `Risk ${i + 1}`,
      level: validLevels.includes(risk.level) ? risk.level : "warning",
      description: risk.description || "",
      probability: Math.max(0, Math.min(100, Math.round(risk.probability ?? 50))),
      mitigation: risk.mitigation || "Assess situation and implement standard response protocols.",
    })),

    impactEstimate: {
      peopleAffected: raw.impactEstimate?.peopleAffected ?? 0,
      tasksGenerated: raw.impactEstimate?.tasksGenerated ?? (raw.recommendations?.length ?? 0),
      regionsImpacted: raw.impactEstimate?.regionsImpacted ?? 1,
      urgencyLevel: raw.impactEstimate?.urgencyLevel ?? "Moderate",
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Fallback Mock — used when no API key is configured
   ═══════════════════════════════════════════════════════════════════ */

function generateFallbackResult(userInput: string): AnalysisResult {
  const inputLower = userInput.toLowerCase();
  const hasCriticalKeywords =
    /flood|earthquake|disease|outbreak|cholera|collapse|destroy|dead|death|famine/i.test(inputLower);
  const hasMedicalKeywords = /medic|hospital|health|injur|wound|clinic/i.test(inputLower);
  const hasWaterKeywords = /water|contaminat|drought|sanitation|wash/i.test(inputLower);
  const hasShelterKeywords = /shelter|displac|homeless|camp|refuge/i.test(inputLower);
  const hasFoodKeywords = /food|hunger|famine|nutrition|starv/i.test(inputLower);

  const priorityScore = hasCriticalKeywords ? 82 + Math.floor(Math.random() * 12) : 55 + Math.floor(Math.random() * 20);
  const confidenceScore = userInput.length > 100 ? 75 + Math.floor(Math.random() * 15) : 55 + Math.floor(Math.random() * 15);

  const issues = [];
  if (hasWaterKeywords) issues.push({ id: "issue-1", title: "Water Supply Contamination", severity: "critical" as const, description: "Reports indicate contamination in primary water sources. Immediate WASH intervention required.", category: "WASH" });
  if (hasMedicalKeywords) issues.push({ id: "issue-2", title: "Medical Infrastructure Strain", severity: "critical" as const, description: "Healthcare facilities overwhelmed. Critical medical supplies at dangerously low levels.", category: "Health" });
  if (hasShelterKeywords) issues.push({ id: "issue-3", title: "Mass Displacement & Shelter Crisis", severity: "high" as const, description: "Large-scale displacement detected. Temporary shelters at or beyond capacity.", category: "Shelter" });
  if (hasFoodKeywords) issues.push({ id: "issue-4", title: "Food Security Emergency", severity: "high" as const, description: "Food distribution disrupted. Current supplies insufficient for affected population.", category: "Food Security" });
  if (issues.length === 0) {
    issues.push(
      { id: "issue-1", title: "Humanitarian Access Restriction", severity: "high" as const, description: "Field reports indicate logistical barriers limiting aid delivery to affected populations.", category: "Access" },
      { id: "issue-2", title: "Communication Infrastructure Failure", severity: "medium" as const, description: "Field coordination hampered by degraded communications in the affected zone.", category: "Logistics" },
    );
  }
  issues.push({ id: `issue-${issues.length + 1}`, title: "Supply Chain Vulnerability", severity: "medium" as const, description: "Primary supply routes may be compromised. Alternative logistics pathways need assessment.", category: "Logistics" });

  const recommendations = [
    { id: "action-1", action: "Deploy rapid needs assessment teams to affected sectors", priority: "immediate" as const, estimatedImpact: "Enables targeted response" },
    { id: "action-2", action: "Activate emergency supply pre-positioning from regional hub", priority: "immediate" as const, estimatedImpact: "~10,000+ people" },
    { id: "action-3", action: "Establish coordination cell with local authorities and partner NGOs", priority: "short-term" as const, estimatedImpact: "Improves response efficiency" },
    { id: "action-4", action: "Set up community-based monitoring and feedback system", priority: "short-term" as const, estimatedImpact: "~5,000 households" },
    { id: "action-5", action: "Develop medium-term recovery and resilience program", priority: "long-term" as const, estimatedImpact: "~25,000 people" },
  ];

  const risks = [
    { id: "risk-1", title: "Secondary Health Crisis", level: "critical" as const, description: "Overcrowding combined with compromised water/sanitation creates high risk for waterborne disease outbreaks.", probability: 78, mitigation: "Pre-position oral rehydration supplies and deploy water purification units to all displacement sites within 48 hours." },
    { id: "risk-2", title: "Access Deterioration", level: "warning" as const, description: "Weather conditions or conflict dynamics may further restrict humanitarian access in the coming days.", probability: 55, mitigation: "Establish alternative supply routes and negotiate access agreements with local authorities before conditions worsen." },
    { id: "risk-3", title: "Resource Shortfall", level: "info" as const, description: "Current funding levels may be insufficient for sustained response. Early donor engagement recommended.", probability: 40, mitigation: "Launch flash appeal and activate standby partnership agreements to secure additional funding within 2 weeks." },
  ];

  const peopleAffected = 15000 + Math.floor(Math.random() * 25000);

  return {
    id: `analysis-${Date.now()}`,
    timestamp: new Date().toISOString(),
    priorityScore,
    confidenceScore,
    explanation: `Based on the field report, a ${hasCriticalKeywords ? "critical" : "significant"} humanitarian situation has been identified requiring ${priorityScore >= 75 ? "immediate" : "coordinated"} multi-sector response. The analysis detected ${issues.length} key issues across ${Array.from(new Set(issues.map(i => i.category))).length} sectors, with an estimated ${peopleAffected.toLocaleString()} people affected. ${hasCriticalKeywords ? "Urgent life-saving interventions are the top priority." : "Timely intervention will help prevent further deterioration."}`,
    detectedIssues: issues,
    recommendedActions: recommendations,
    riskAlerts: risks,
    impactEstimate: {
      peopleAffected,
      tasksGenerated: recommendations.length + Math.floor(Math.random() * 4) + 2,
      regionsImpacted: 2 + Math.floor(Math.random() * 3),
      urgencyLevel: priorityScore >= 75 ? "Critical" : priorityScore >= 50 ? "High" : "Moderate",
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Route Handler — POST /api/analyze
   ═══════════════════════════════════════════════════════════════════ */

/**
 * POST /api/analyze
 *
 * Accepts a JSON body:
 *   { "text": "field report content", "fileName": "optional.pdf" }
 *
 * If OPENAI_API_KEY is set, sends the input to the AI model for
 * real analysis. Otherwise, returns an intelligent fallback based
 * on keyword detection in the input.
 *
 * Returns: AnalysisResult JSON
 */
export async function POST(request: NextRequest) {
  try {
    // ── Parse & Validate Input ──────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const text = typeof body.text === "string" ? body.text.trim() : "";
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";

    if (!text && !fileName) {
      return NextResponse.json(
        {
          error: "Please provide text content or a file for analysis.",
          hint: 'Send a JSON body like: { "text": "your field report here" }',
        },
        { status: 400 }
      );
    }

    // Build the user message for the AI
    const userMessage = [
      fileName ? `[Attached file: ${fileName}]` : "",
      text || "(No text provided — analyze based on attached file context)",
    ]
      .filter(Boolean)
      .join("\n\n");

    // ── Determine Path: Real AI vs Fallback ─────────────────────
    const hasValidKey =
      OPENAI_API_KEY &&
      OPENAI_API_KEY !== "YOUR_OPENAI_API_KEY_HERE" &&
      OPENAI_API_KEY.length > 10;

    let result: AnalysisResult;

    if (hasValidKey) {
      // ── Real AI Path ──────────────────────────────────────────
      console.log("[NGO OS] Calling AI model for analysis...");
      try {
        const aiResponse = await callAIModel(userMessage);
        result = validateAndMap(aiResponse);
        console.log(
          `[NGO OS] AI analysis complete — Priority: ${result.priorityScore}, Confidence: ${result.confidenceScore}`
        );
      } catch (aiError: unknown) {
        const message =
          aiError instanceof Error ? aiError.message : "Unknown AI error";
        console.error(`[NGO OS] AI model error: ${message}`);

        // If the AI call fails, fall back gracefully
        console.log("[NGO OS] Falling back to keyword-based analysis...");
        result = generateFallbackResult(userMessage);
        result.explanation =
          "Note: AI model was unavailable. This analysis was generated using keyword-based heuristics. " +
          result.explanation;
      }
    } else {
      // ── Fallback Path (no API key configured) ─────────────────
      console.log("[NGO OS] No API key configured — using fallback analysis.");
      // Small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      result = generateFallbackResult(userMessage);
    }

    // ── Privacy: mask personal names before sending to client ──
    const maskedResult = maskAnalysisResult(result);
    console.log("[NGO OS] Privacy masking applied to analysis result.");

    return NextResponse.json(maskedResult, { status: 200 });

  } catch (error: unknown) {
    // ── Top-level Error Handler ─────────────────────────────────
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[NGO OS] Unhandled error in /api/analyze: ${message}`);

    return NextResponse.json(
      {
        error: "An unexpected error occurred during analysis.",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
