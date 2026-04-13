/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Type Definitions
   Intelligence Dashboard v2
   ═══════════════════════════════════════════════════════════════════ */

/* ── Existing Analysis Types ── */

export interface AnalysisResult {
  id: string;
  timestamp: string;
  detectedIssues: DetectedIssue[];
  priorityScore: number;
  recommendedActions: RecommendedAction[];
  riskAlerts: RiskAlert[];
  confidenceScore: number;
  explanation: string;
  impactEstimate: ImpactEstimate;
}

export interface AIModelResponse {
  issues: {
    title: string;
    severity: "critical" | "high" | "medium" | "low";
    description: string;
    category: string;
  }[];
  priority: number;
  recommendations: {
    action: string;
    priority: "immediate" | "short-term" | "long-term";
    estimatedImpact: string;
  }[];
  risks: {
    title: string;
    level: "critical" | "warning" | "info";
    description: string;
    probability: number;
    mitigation: string;
  }[];
  explanation: string;
  confidence: number;
  impactEstimate: {
    peopleAffected: number;
    tasksGenerated: number;
    regionsImpacted: number;
    urgencyLevel: string;
  };
}

export interface DetectedIssue {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  category: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  priority: "immediate" | "short-term" | "long-term";
  estimatedImpact: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  level: "critical" | "warning" | "info";
  description: string;
  probability: number;
  mitigation: string;
}

export interface ImpactEstimate {
  peopleAffected: number;
  tasksGenerated: number;
  regionsImpacted: number;
  urgencyLevel: string;
}

export interface DecisionPayload {
  analysisId: string;
  decision: "approve" | "modify" | "reject";
  notes: string;
  modifiedActions?: string[];
}

export type UploadStatus = "idle" | "uploading" | "analyzing" | "complete" | "error";

/* ═══════════════════════════════════════════════════════════════════
   NEW — Intelligence Dashboard Types
   ═══════════════════════════════════════════════════════════════════ */

/** Extracted structured data from natural language input */
export interface CrisisNeed {
  id: string;
  rawText: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  category: NeedCategory;
  urgency: "critical" | "high" | "medium" | "low";
  population: number;
  description: string;
  timestamp: string;
  status: "active" | "in-progress" | "resolved";
}

export type NeedCategory =
  | "Water/Sanitation"
  | "Medical/Health"
  | "Food Security"
  | "Shelter"
  | "Protection"
  | "Logistics"
  | "Education"
  | "Communication"
  | "Search & Rescue"
  | "General";

/** Volunteer / resource profile */
export interface VolunteerProfile {
  id: string;
  name: string;
  avatar: string; // initials or emoji
  skills: NeedCategory[];
  location: string;
  coordinates: [number, number];
  availability: "immediate" | "within-24h" | "within-48h" | "standby";
  experience: number; // years
  currentLoad: number; // 0-100 — how busy they are
  organization: string;
  phone?: string; // for PII masking demo
  email?: string; // for PII masking demo
}

/** Result of matching a need to volunteers */
export interface ResourceMatch {
  volunteerId: string;
  volunteer: VolunteerProfile;
  needId: string;
  matchScore: number; // 0-100
  breakdown: {
    skillMatch: number;
    proximityScore: number;
    availabilityScore: number;
    experienceScore: number;
    loadScore: number;
  };
  estimatedArrival: string;
  recommendation: string;
}

/** Crisis location for the map */
export interface CrisisLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  urgency: "critical" | "high" | "medium" | "low";
  category: NeedCategory;
  population: number;
  description: string;
  timestamp: string;
  status: "active" | "in-progress" | "resolved";
}

/** System health for the sidebar */
export interface SystemHealth {
  aiEngine: { status: "online" | "degraded" | "offline"; latency: number };
  dataIngestion: { status: "online" | "degraded" | "offline"; throughput: number };
  matchingEngine: { status: "online" | "degraded" | "offline"; accuracy: number };
  communications: { status: "online" | "degraded" | "offline"; uptime: number };
}

/** Live feed event for the ticker */
export interface LiveFeedEvent {
  id: string;
  type: "crisis" | "update" | "resolution" | "volunteer" | "alert";
  message: string;
  timestamp: string;
  urgency: "critical" | "high" | "medium" | "low";
  location?: string;
}
