/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Case Analysis & Management Engine Types
   Anti-Hallucination Strict Evidence-Based Schema
   ═══════════════════════════════════════════════════════════════════ */

export interface CaseEngineResult {
  id: string;
  timestamp: string;
  processingTime: number; // ms
  model: string;

  case_type: "new" | "follow_up";
  category: CaseCategory;
  summary: string;
  issues: string[];

  cause_analysis: {
    identified_cause: string;
    confidence: "low" | "medium" | "high";
  };

  risk_analysis: {
    severity: "Low" | "Medium" | "High" | "Critical";
    urgency: "Low" | "Medium" | "High";
    risk_score: number; // 0–100
  };

  history_evaluation: {
    previous_actions: string[];
    improvements: string[];
    failures: string[];
    current_condition: string;
  };

  recommended_actions: RecommendedCaseStep[];

  resources_required: {
    skills: string[];
    materials: string[];
  };

  volunteer_suggestion: {
    type: string;
    experience_level: "beginner" | "intermediate" | "expert";
  };

  outcome_prediction: {
    expected_if_followed: string;
    risk_if_ignored: string;
  };

  case_status: CaseStatus;
  follow_up_actions: string[];

  evidence_map: EvidenceMapping[];
}

export type CaseCategory =
  | "health"
  | "education"
  | "disaster"
  | "abuse"
  | "poverty"
  | "infrastructure"
  | "other";

export type CaseStatus =
  | "new"
  | "in_progress"
  | "critical"
  | "improving"
  | "resolved"
  | "uncertain";

export interface RecommendedCaseStep {
  step: number;
  action: string;
}

export interface EvidenceMapping {
  statement: string;
  source: string;
}
