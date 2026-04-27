/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Multi-Agent Operations Engine Types
   8-Agent Pipeline Output Schema
   ═══════════════════════════════════════════════════════════════════ */

export interface OpsEngineResult {
  id: string;
  timestamp: string;
  processingTime: number; // ms
  agentTrace: AgentTraceStep[]; // pipeline execution trace

  category: OpsCategory;
  summary: string;
  issues: string[];
  risk_analysis: RiskAnalysis;
  recommended_actions: RecommendedStep[];
  resources_required: ResourcesRequired;
  volunteer_suggestion: VolunteerSuggestion;
  outcome_prediction: OutcomePrediction;
  follow_up_actions: string[];
}

export type OpsCategory =
  | "health"
  | "education"
  | "disaster"
  | "abuse"
  | "poverty"
  | "infrastructure"
  | "other";

export interface RiskAnalysis {
  severity: "Low" | "Medium" | "High" | "Critical";
  urgency: "Low" | "Medium" | "High";
  risk_score: number; // 0–100
}

export interface RecommendedStep {
  step: number;
  action: string;
}

export interface ResourcesRequired {
  skills: string[];
  materials: string[];
}

export interface VolunteerSuggestion {
  type: string;
  experience_level: "beginner" | "intermediate" | "expert";
}

export interface OutcomePrediction {
  expected_if_followed: string;
  risk_if_ignored: string;
}

/** Agent pipeline execution trace for UI visualization */
export interface AgentTraceStep {
  agent: string;
  agentNumber: number;
  status: "completed" | "running" | "pending" | "failed";
  duration: number; // ms
  output_summary: string;
}
