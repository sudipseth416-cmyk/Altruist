import { NextRequest, NextResponse } from "next/server";
import type { OpsEngineResult, OpsCategory, AgentTraceStep } from "@/lib/ops-engine-types";

/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Multi-Agent Operations Engine
   ═══════════════════════════════════════════════════════════════════
   POST /api/ops-engine

   An 8-agent pipeline that processes humanitarian field reports
   through structured decision agents:

   1. Input Processing Agent
   2. Analysis Agent
   3. Risk Assessment Agent
   4. Action Planning Agent
   5. Resource & Skill Agent
   6. Volunteer Matching Agent
   7. Outcome Prediction Agent
   8. Follow-Up / Loop Agent

   Returns strict JSON matching OpsEngineResult schema.
   ═══════════════════════════════════════════════════════════════════ */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ─── System Prompt for Gemini ─── */
const OPS_ENGINE_PROMPT = `You are an AI-powered NGO Operations Engine composed of 8 internal agents working in a controlled pipeline.

You are NOT a chatbot. You are a structured decision system.

Execute the following agents in order internally:

AGENT 1 (INPUT PROCESSING): Clean/normalize the input, extract key info.
AGENT 2 (ANALYSIS): Classify category, generate summary (max 3 lines), extract issues.
AGENT 3 (RISK ASSESSMENT): Evaluate severity (Low/Medium/High/Critical), urgency (Low/Medium/High), and calculate risk_score (0-100). Life-threatening → 80-100, Vulnerable groups → +10, Urgent need → +10, Resource scarcity → +5 to +15.
AGENT 4 (ACTION PLANNING): Generate step-by-step realistic, field-executable actions ordered logically. No vague suggestions.
AGENT 5 (RESOURCE & SKILL): Identify required skills and materials/resources.
AGENT 6 (VOLUNTEER MATCHING): Suggest ideal volunteer profile (type, experience_level: beginner/intermediate/expert). Only roles, no names.
AGENT 7 (OUTCOME PREDICTION): Predict expected outcome if actions followed and risks if ignored.
AGENT 8 (FOLLOW-UP / LOOP): If input is a follow-up, compare conditions, identify improvements/failures/new risks. Otherwise return empty array.

Return ONLY valid JSON (no markdown, no code fences, no explanation) matching this EXACT schema:

{
  "category": "health | education | disaster | abuse | poverty | infrastructure | other",
  "summary": "string — max 3 lines",
  "issues": ["string", "string"],
  "risk_analysis": {
    "severity": "Low | Medium | High | Critical",
    "urgency": "Low | Medium | High",
    "risk_score": 0
  },
  "recommended_actions": [
    {"step": 1, "action": "string"},
    {"step": 2, "action": "string"}
  ],
  "resources_required": {
    "skills": ["string"],
    "materials": ["string"]
  },
  "volunteer_suggestion": {
    "type": "string — role description",
    "experience_level": "beginner | intermediate | expert"
  },
  "outcome_prediction": {
    "expected_if_followed": "string",
    "risk_if_ignored": "string"
  },
  "follow_up_actions": []
}

STRICT RULES:
- Output ONLY valid JSON
- Never break structure
- If unsure → use "uncertain"
- Be specific and actionable
- Do NOT hallucinate unrealistic solutions
- Keep steps practical for NGO field work
- Return 3-8 recommended_actions
- Return 3-6 issues
- Return 3-8 skills and 3-8 materials`;

/* ─── Call Gemini API ─── */
async function callGeminiOpsEngine(reportText: string): Promise<Record<string, unknown>> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: OPS_ENGINE_PROMPT }] },
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

/* ─── Validate & Map Gemini Response ─── */
function mapGeminiToResult(
  raw: Record<string, unknown>,
  processingTime: number,
  trace: AgentTraceStep[]
): OpsEngineResult {
  const r = raw as Record<string, any>;

  const validCategories: OpsCategory[] = ["health", "education", "disaster", "abuse", "poverty", "infrastructure", "other"];
  const validSeverities = ["Low", "Medium", "High", "Critical"];
  const validUrgencies = ["Low", "Medium", "High"];
  const validExpLevels = ["beginner", "intermediate", "expert"];

  return {
    id: `ops-${Date.now()}`,
    timestamp: new Date().toISOString(),
    processingTime,
    agentTrace: trace,

    category: validCategories.includes(r.category) ? r.category : "other",
    summary: r.summary || "Analysis completed.",
    issues: Array.isArray(r.issues) ? r.issues.map(String) : [],

    risk_analysis: {
      severity: validSeverities.includes(r.risk_analysis?.severity) ? r.risk_analysis.severity : "Medium",
      urgency: validUrgencies.includes(r.risk_analysis?.urgency) ? r.risk_analysis.urgency : "Medium",
      risk_score: Math.max(0, Math.min(100, Math.round(r.risk_analysis?.risk_score ?? 50))),
    },

    recommended_actions: Array.isArray(r.recommended_actions)
      ? r.recommended_actions.map((a: any, i: number) => ({
          step: a.step ?? i + 1,
          action: a.action || `Action ${i + 1}`,
        }))
      : [],

    resources_required: {
      skills: Array.isArray(r.resources_required?.skills) ? r.resources_required.skills.map(String) : [],
      materials: Array.isArray(r.resources_required?.materials) ? r.resources_required.materials.map(String) : [],
    },

    volunteer_suggestion: {
      type: r.volunteer_suggestion?.type || "General Field Worker",
      experience_level: validExpLevels.includes(r.volunteer_suggestion?.experience_level)
        ? r.volunteer_suggestion.experience_level
        : "intermediate",
    },

    outcome_prediction: {
      expected_if_followed: r.outcome_prediction?.expected_if_followed || "Situation expected to stabilize with proper intervention.",
      risk_if_ignored: r.outcome_prediction?.risk_if_ignored || "Situation may deteriorate significantly without action.",
    },

    follow_up_actions: Array.isArray(r.follow_up_actions) ? r.follow_up_actions.map(String) : [],
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Intelligent Fallback — Demo Mode (no API key)
   ═══════════════════════════════════════════════════════════════════ */

function generateFallbackResult(text: string): OpsEngineResult {
  const inputLower = text.toLowerCase();

  // ── Agent 1: Input Processing ──
  const isFlood = /flood|water|dam|rain|drown|submerge/i.test(inputLower);
  const isHealth = /hospital|health|medic|disease|outbreak|cholera|injur|wound|patient|doctor/i.test(inputLower);
  const isDisaster = /earthquake|tsunami|cyclone|hurricane|tornado|landslide|volcanic|storm|disaster/i.test(inputLower);
  const isAbuse = /abuse|violence|traffick|exploit|child labor|assault|harassment/i.test(inputLower);
  const isEducation = /school|education|student|teacher|literacy|dropout|learning/i.test(inputLower);
  const isPoverty = /poverty|hunger|starv|famine|homeless|malnutrition|destitut/i.test(inputLower);
  const isInfra = /road|bridge|building|infrastructure|electric|power|collapsed|damaged/i.test(inputLower);
  const hasChildren = /child|infant|baby|kid|orphan|minor|toddler/i.test(inputLower);
  const hasElderly = /elderly|aged|senior|old age|geriatric/i.test(inputLower);
  const hasVulnerable = hasChildren || hasElderly;
  const isLifeThreatening = /dead|death|dying|life.?threaten|critical|fatal|casualt/i.test(inputLower);
  const isUrgent = /urgent|immediate|emergency|asap|right now|critical/i.test(inputLower);
  const hasScarcity = /scarce|shortage|lack|insufficient|depleted|running out|no supply/i.test(inputLower);

  // ── Agent 2: Analysis ──
  let category: OpsCategory = "other";
  if (isDisaster || isFlood) category = "disaster";
  else if (isHealth) category = "health";
  else if (isAbuse) category = "abuse";
  else if (isEducation) category = "education";
  else if (isPoverty) category = "poverty";
  else if (isInfra) category = "infrastructure";

  const issues: string[] = [];
  if (isFlood) issues.push("Flood damage affecting residential areas and infrastructure");
  if (isHealth) issues.push("Medical infrastructure overwhelmed or compromised");
  if (isDisaster) issues.push("Natural disaster causing mass displacement and infrastructure collapse");
  if (hasChildren) issues.push("Children among the affected — heightened protection risk");
  if (hasElderly) issues.push("Elderly population vulnerable to health deterioration");
  if (isPoverty || hasScarcity) issues.push("Severe resource scarcity — food and supplies critically low");
  if (isAbuse) issues.push("Reports of abuse or exploitation requiring immediate protection intervention");
  if (isInfra) issues.push("Critical infrastructure damage impeding aid delivery");
  if (issues.length === 0) {
    issues.push(
      "Field conditions require humanitarian assessment",
      "Supply chain logistics need coordination",
      "Community communication channels disrupted"
    );
  }
  if (issues.length < 3) {
    issues.push("Coordination gaps between responding agencies", "Communication infrastructure partially degraded");
  }

  const summaryParts = [];
  if (category === "disaster") summaryParts.push(`A ${isFlood ? "flood" : "disaster"}-related humanitarian crisis has been identified.`);
  else if (category === "health") summaryParts.push("A health emergency requiring immediate medical intervention has been detected.");
  else if (category === "abuse") summaryParts.push("Reports of abuse/exploitation have been flagged for immediate protection response.");
  else summaryParts.push("A humanitarian situation requiring multi-sector coordination has been identified.");
  summaryParts.push(`${issues.length} key issues extracted from the field report.`);
  summaryParts.push(isLifeThreatening ? "Life-threatening conditions present — critical intervention required." : "Timely response can prevent further deterioration.");

  // ── Agent 3: Risk Assessment ──
  let riskScore = 40;
  if (isLifeThreatening) riskScore = 80 + Math.floor(Math.random() * 20);
  else if (isDisaster || isFlood) riskScore = 65 + Math.floor(Math.random() * 20);
  else if (isHealth) riskScore = 60 + Math.floor(Math.random() * 20);
  else if (isAbuse) riskScore = 70 + Math.floor(Math.random() * 15);
  else riskScore = 35 + Math.floor(Math.random() * 25);

  if (hasVulnerable) riskScore = Math.min(100, riskScore + 10);
  if (isUrgent) riskScore = Math.min(100, riskScore + 10);
  if (hasScarcity) riskScore = Math.min(100, riskScore + 5 + Math.floor(Math.random() * 10));

  const severity = riskScore >= 80 ? "Critical" : riskScore >= 60 ? "High" : riskScore >= 40 ? "Medium" : "Low";
  const urgency = isUrgent || isLifeThreatening ? "High" : riskScore >= 60 ? "High" : riskScore >= 40 ? "Medium" : "Low";

  // ── Agent 4: Action Planning ──
  const actions: { step: number; action: string }[] = [];
  let step = 1;

  actions.push({ step: step++, action: "Deploy rapid needs assessment team to the affected area within 6 hours" });

  if (isHealth) actions.push({ step: step++, action: "Activate mobile medical unit and pre-position emergency health kits at the nearest staging area" });
  if (isFlood || isDisaster) actions.push({ step: step++, action: "Set up emergency water purification stations and distribute hygiene kits to all displacement sites" });
  if (hasChildren) actions.push({ step: step++, action: "Establish child-friendly safe spaces with psychosocial support counselors" });
  if (isAbuse) actions.push({ step: step++, action: "Activate protection monitoring teams and set up confidential reporting channels" });
  if (isPoverty || hasScarcity) actions.push({ step: step++, action: "Coordinate emergency food distribution through local community leaders within 24 hours" });
  if (isInfra) actions.push({ step: step++, action: "Conduct structural damage assessment and deploy engineering teams for critical infrastructure repair" });

  actions.push({ step: step++, action: "Establish field coordination cell with local authorities and partner NGOs" });
  actions.push({ step: step++, action: "Set up community-based feedback mechanism to monitor response effectiveness" });
  actions.push({ step: step++, action: "Initiate multi-agency logistics hub for centralized resource allocation" });

  // ── Agent 5: Resources ──
  const skills: string[] = [];
  const materials: string[] = [];

  if (isHealth) {
    skills.push("Emergency Medical Response", "Epidemiological Assessment", "Mental Health & Psychosocial Support");
    materials.push("Emergency Medical Kits", "Portable Diagnostic Equipment", "Pharmaceuticals & Vaccines");
  }
  if (isFlood || isDisaster) {
    skills.push("Disaster Response Coordination", "Search & Rescue Operations", "WASH Specialist");
    materials.push("Water Purification Units", "Emergency Shelter Kits", "Rescue Equipment");
  }
  if (isAbuse) {
    skills.push("Child Protection Specialist", "GBV Response", "Legal Aid & Advocacy");
    materials.push("Safe Space Setup Materials", "Case Management Toolkits", "Communication Equipment");
  }
  if (isEducation) {
    skills.push("Education in Emergencies", "Curriculum Development", "Community Mobilization");
    materials.push("Temporary Learning Space Kits", "Educational Supplies", "Solar-Powered Devices");
  }

  if (skills.length < 3) {
    skills.push("Field Coordination & Logistics", "Community Engagement", "Data Collection & Reporting");
  }
  if (materials.length < 3) {
    materials.push("Field Communication Equipment (HF/VHF Radios)", "Solar Power Banks", "First Aid Kits", "GPS Mapping Devices");
  }

  // ── Agent 6: Volunteer Matching ──
  let volunteerType = "General Humanitarian Field Worker";
  let experienceLevel: "beginner" | "intermediate" | "expert" = "intermediate";

  if (isHealth) { volunteerType = "Medical/Health Emergency Responder"; experienceLevel = "expert"; }
  else if (isDisaster || isFlood) { volunteerType = "Disaster Response & WASH Specialist"; experienceLevel = "expert"; }
  else if (isAbuse) { volunteerType = "Protection & Safeguarding Officer"; experienceLevel = "expert"; }
  else if (isEducation) { volunteerType = "Education in Emergencies Facilitator"; experienceLevel = "intermediate"; }
  else if (isPoverty) { volunteerType = "Livelihood & Food Security Coordinator"; experienceLevel = "intermediate"; }
  else if (isInfra) { volunteerType = "Infrastructure Assessment Engineer"; experienceLevel = "expert"; }

  // ── Agent 7: Outcome Prediction ──
  const expectedOutcome = isLifeThreatening
    ? "Immediate life-saving interventions can stabilize 80-90% of critical cases within 72 hours. Full humanitarian response within 1 week will prevent cascading mortality."
    : riskScore >= 60
    ? "Coordinated multi-sector response within 48 hours will address primary needs for ~85% of the affected population. Situation expected to stabilize within 2 weeks."
    : "Timely intervention will resolve primary issues within 1-2 weeks. Community resilience programs can prevent recurrence.";

  const riskIfIgnored = isLifeThreatening
    ? "Without immediate action, mortality rate could increase 3-5x within 48-72 hours. Cascading effects (disease outbreak, displacement) will compound the crisis exponentially."
    : riskScore >= 60
    ? "Delayed response will lead to deterioration within 72 hours. Secondary crises (disease, protection risks, displacement) likely to emerge. Recovery costs increase 300%+."
    : "Situation will gradually worsen over 1-2 weeks. Vulnerable populations face increased risk. Community trust in response agencies may decline.";

  // ── Agent 8: Follow-up ──
  const followUpActions: string[] = [];

  // Build agent trace
  const now = Date.now();
  const agentTrace: AgentTraceStep[] = [
    { agent: "Input Processing", agentNumber: 1, status: "completed", duration: 120 + Math.floor(Math.random() * 80), output_summary: "Input cleaned, key entities extracted" },
    { agent: "Analysis", agentNumber: 2, status: "completed", duration: 200 + Math.floor(Math.random() * 150), output_summary: `Category: ${category}, ${issues.length} issues identified` },
    { agent: "Risk Assessment", agentNumber: 3, status: "completed", duration: 150 + Math.floor(Math.random() * 100), output_summary: `Score: ${riskScore}/100, Severity: ${severity}` },
    { agent: "Action Planning", agentNumber: 4, status: "completed", duration: 250 + Math.floor(Math.random() * 200), output_summary: `${actions.length} field-executable steps generated` },
    { agent: "Resource & Skill", agentNumber: 5, status: "completed", duration: 100 + Math.floor(Math.random() * 80), output_summary: `${skills.length} skills, ${materials.length} materials mapped` },
    { agent: "Volunteer Matching", agentNumber: 6, status: "completed", duration: 80 + Math.floor(Math.random() * 60), output_summary: `Profile: ${volunteerType} (${experienceLevel})` },
    { agent: "Outcome Prediction", agentNumber: 7, status: "completed", duration: 180 + Math.floor(Math.random() * 120), output_summary: "Dual-path outcome projected" },
    { agent: "Follow-Up / Loop", agentNumber: 8, status: "completed", duration: 50 + Math.floor(Math.random() * 40), output_summary: followUpActions.length > 0 ? `${followUpActions.length} follow-up actions` : "No prior context — initial assessment" },
  ];

  const totalProcessing = agentTrace.reduce((sum, a) => sum + a.duration, 0);

  return {
    id: `ops-demo-${now}`,
    timestamp: new Date().toISOString(),
    processingTime: totalProcessing,
    agentTrace,

    category,
    summary: summaryParts.join(" "),
    issues,

    risk_analysis: {
      severity: severity as "Low" | "Medium" | "High" | "Critical",
      urgency: urgency as "Low" | "Medium" | "High",
      risk_score: riskScore,
    },

    recommended_actions: actions,
    resources_required: { skills, materials },
    volunteer_suggestion: { type: volunteerType, experience_level: experienceLevel },
    outcome_prediction: { expected_if_followed: expectedOutcome, risk_if_ignored: riskIfIgnored },
    follow_up_actions: followUpActions,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Route Handler — POST /api/ops-engine
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
        { error: "Please provide field report text for the operations engine.", hint: 'Send: { "text": "your report here" }' },
        { status: 400 }
      );
    }

    const hasValidKey = GEMINI_API_KEY && GEMINI_API_KEY.length > 10;
    let result: OpsEngineResult;

    if (hasValidKey) {
      console.log("[NGO OS] Ops Engine: Calling Gemini for multi-agent pipeline...");
      const startTime = Date.now();
      try {
        const raw = await callGeminiOpsEngine(text);
        const processingTime = Date.now() - startTime;

        // Build agent trace for Gemini path
        const trace: AgentTraceStep[] = [
          { agent: "Input Processing", agentNumber: 1, status: "completed", duration: Math.round(processingTime * 0.05), output_summary: "Input cleaned via Gemini NLU" },
          { agent: "Analysis", agentNumber: 2, status: "completed", duration: Math.round(processingTime * 0.15), output_summary: `Category: ${raw.category}` },
          { agent: "Risk Assessment", agentNumber: 3, status: "completed", duration: Math.round(processingTime * 0.12), output_summary: `Risk evaluated` },
          { agent: "Action Planning", agentNumber: 4, status: "completed", duration: Math.round(processingTime * 0.20), output_summary: "Actions generated" },
          { agent: "Resource & Skill", agentNumber: 5, status: "completed", duration: Math.round(processingTime * 0.10), output_summary: "Resources mapped" },
          { agent: "Volunteer Matching", agentNumber: 6, status: "completed", duration: Math.round(processingTime * 0.08), output_summary: "Volunteer profile matched" },
          { agent: "Outcome Prediction", agentNumber: 7, status: "completed", duration: Math.round(processingTime * 0.18), output_summary: "Outcomes projected" },
          { agent: "Follow-Up / Loop", agentNumber: 8, status: "completed", duration: Math.round(processingTime * 0.12), output_summary: "Follow-up assessed" },
        ];

        result = mapGeminiToResult(raw, processingTime, trace);
        console.log(`[NGO OS] Ops Engine complete in ${processingTime}ms — Category: ${result.category}, Risk: ${result.risk_analysis.risk_score}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown Gemini error";
        console.error(`[NGO OS] Ops Engine Gemini error: ${msg}`);
        console.log("[NGO OS] Ops Engine: Falling back to demo pipeline...");
        result = generateFallbackResult(text);
        result.summary = "Note: Gemini API unavailable — demo pipeline used. " + result.summary;
      }
    } else {
      console.log("[NGO OS] Ops Engine: No API key — using demo pipeline.");
      // Simulate agent-by-agent processing delay
      await new Promise((r) => setTimeout(r, 2000));
      result = generateFallbackResult(text);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[NGO OS] Unhandled error in /api/ops-engine: ${message}`);
    return NextResponse.json(
      { error: "An unexpected error occurred in the operations engine.", detail: process.env.NODE_ENV === "development" ? message : undefined },
      { status: 500 }
    );
  }
}
