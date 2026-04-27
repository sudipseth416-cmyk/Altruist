"use client";

import React, { useState, useEffect } from "react";
import {
  Gauge,
  CheckCircle,
  Edit3,
  XCircle,
  MessageSquare,
  Loader2,
  ShieldCheck,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
  Clock,
  AlertTriangle,
  History,
  Users,
} from "lucide-react";
import type { CaseEngineResult } from "@/lib/case-engine-types";

interface HumanDecisionPanelProps {
  result: CaseEngineResult | null;
  onDecision: (decision: "approve" | "modify" | "reject", notes: string) => void;
  isSubmitting: boolean;
}

/* ─── Decision Record (stored in state) ─── */
interface DecisionRecord {
  decision: "approve" | "modify" | "reject";
  notes: string;
  timestamp: string;
  analysisId: string;
  confidenceScore: number;
}

/* ─── Animated Confidence Ring ─── */
function ConfidenceRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#fb7185";
  const label = score >= 80 ? "High" : score >= 60 ? "Moderate" : "Low";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle cx="44" cy="44" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{score}%</span>
        <span
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─── Confirmation Banner ─── */
function ConfirmationBanner({
  decision,
  onReset,
}: {
  decision: DecisionRecord;
  onReset: () => void;
}) {
  const config = {
    approve: {
      icon: CheckCircle,
      label: "Approved",
      gradient: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/30",
      textColor: "text-emerald-400",
      glow: "shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    },
    modify: {
      icon: Edit3,
      label: "Sent for Modification",
      gradient: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/30",
      textColor: "text-amber-400",
      glow: "shadow-[0_0_30px_rgba(251,191,36,0.15)]",
    },
    reject: {
      icon: XCircle,
      label: "Rejected",
      gradient: "from-rose-500/20 to-pink-500/10",
      border: "border-rose-500/30",
      textColor: "text-rose-400",
      glow: "shadow-[0_0_30px_rgba(251,113,133,0.15)]",
    },
  };

  const c = config[decision.decision];
  const Icon = c.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border ${c.border} bg-gradient-to-br ${c.gradient} ${c.glow} p-5 animate-fade-in`}
    >
      {/* Decorative shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />

      <div className="relative flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.textColor}`}
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${c.textColor}`}>
            Decision: {c.label}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Submitted at{" "}
            {new Date(decision.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {decision.notes && (
            <p className="text-xs text-slate-500 mt-2 italic line-clamp-2">
              &quot;{decision.notes}&quot;
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          className="text-[10px] text-slate-500 hover:text-white font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200 flex items-center gap-1.5 flex-shrink-0"
        >
          <History className="w-3 h-3" />
          Revise
        </button>
      </div>
    </div>
  );
}

/* ─── Priority tag colors ─── */
const priorityConfig = {
  immediate: { color: "text-rose-400", dot: "bg-rose-400", label: "Immediate" },
  "short-term": { color: "text-amber-400", dot: "bg-amber-400", label: "Short-term" },
  "long-term": { color: "text-sky-400", dot: "bg-sky-400", label: "Long-term" },
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Panel
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HumanDecisionPanel({
  result,
  onDecision,
  isSubmitting,
}: HumanDecisionPanelProps) {
  const [notes, setNotes] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<
    "approve" | "modify" | "reject" | null
  >(null);
  const [confirmedDecision, setConfirmedDecision] = useState<DecisionRecord | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<DecisionRecord[]>([]);

  // Reset state when a new analysis result arrives
  useEffect(() => {
    if (result) {
      setConfirmedDecision(null);
      setNotes("");
      setSelectedDecision(null);
    }
  }, [result]);

  /* ── Empty State ── */
  if (!result) {
    return (
      <div className="glass-card p-6 animate-fade-in animate-delay-400 flex flex-col items-center justify-center min-h-[280px]">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
          <Gauge className="w-7 h-7 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-1">
          Awaiting Analysis
        </h3>
        <p className="text-xs text-slate-600 text-center max-w-[220px]">
          AI decisions will appear here after analysis completes
        </p>
      </div>
    );
  }

  /* ── Handle Decision Submit ── */
  const handleSubmit = (decision: "approve" | "modify" | "reject") => {
    setSelectedDecision(decision);

    const record: DecisionRecord = {
      decision,
      notes,
      timestamp: new Date().toISOString(),
      analysisId: result.id,
      confidenceScore: 100 - result.risk_analysis.risk_score, // invert risk to confidence
    };

    // Log decision to console
    console.log(
      `%c[NGO OS] 🏛️ Human Decision Recorded`,
      "color: #34d399; font-weight: bold; font-size: 13px;"
    );
    console.table({
      Decision: decision.toUpperCase(),
      "Analysis ID": result.id,
      "Risk Score": `${result.risk_analysis.risk_score}/100`,
      Notes: notes || "(none)",
      Timestamp: record.timestamp,
    });

    // Store in local state
    setConfirmedDecision(record);
    setDecisionHistory((prev) => [record, ...prev]);

    // Propagate to parent
    onDecision(decision, notes);
  };

  /* ── Reset / Revise ── */
  const handleReset = () => {
    setConfirmedDecision(null);
    setSelectedDecision(null);
    setNotes("");
  };

  /* ── Derive top recommendations ── */
  const topActions = result.recommended_actions?.slice(0, 3) ?? [];

  return (
    <div className="glass-card p-6 animate-fade-in animate-delay-400">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="icon-box icon-box-amber">
          <ShieldCheck className="w-5 h-5 text-ngo-amber" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm">Human Decision</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Review AI recommendations &amp; decide
          </p>
        </div>
        {decisionHistory.length > 0 && (
          <span className="text-[10px] text-slate-500 font-medium px-2.5 py-1 rounded-full bg-white/[0.04] flex items-center gap-1.5">
            <History className="w-3 h-3" />
            {decisionHistory.length} decision{decisionHistory.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── AI Recommendation Summary ── */}
      <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-ngo-accent/[0.06] to-cyan-500/[0.03] border border-ngo-accent/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-ngo-accent" />
          <h4 className="text-xs font-semibold text-ngo-accent-light uppercase tracking-wider">
            AI Recommendation Summary
          </h4>
        </div>

        {/* Explanation excerpt */}
        {result.summary && (
          <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-3">
            {result.summary}
          </p>
        )}

        {/* Top recommended actions */}
        {topActions.length > 0 && (
          <div className="space-y-2">
            {topActions.map((action) => (
                <div
                  key={action.step}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05] transition-colors"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center text-[9px] font-bold text-emerald-400">
                    {action.step}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {action.action}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        )}

        {/* Risk warning snippet */}
        {(result.risk_analysis.severity === "Critical" || result.risk_analysis.severity === "High") && (
          <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-rose-500/[0.08] border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <p className="text-[11px] text-rose-300">
              {result.risk_analysis.severity} severity (risk score {result.risk_analysis.risk_score}/100) — review before approving.
            </p>
          </div>
        )}
      </div>

      {/* ── Confidence Gauge + Summary ── */}
      {(() => {
        const confidence = Math.max(0, Math.min(100, 100 - result.risk_analysis.risk_score));
        return (
          <div className="flex items-center gap-5 mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <ConfidenceRing score={confidence} />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">Case Confidence</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {confidence >= 80
                  ? "Low risk — AI strongly recommends proceeding with the suggested actions."
                  : confidence >= 60
                  ? "Moderate risk — review recommended actions carefully before proceeding."
                  : "High risk — additional data or human review is strongly recommended."}
              </p>
              <div className="progress-bar-track mt-3">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${confidence}%`,
                    background:
                      confidence >= 80
                        ? "linear-gradient(90deg, #059669, #34d399)"
                        : confidence >= 60
                        ? "linear-gradient(90deg, #d97706, #fbbf24)"
                        : "linear-gradient(90deg, #e11d48, #fb7185)",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Confirmation Banner (shown after decision) ── */}
      {confirmedDecision && (
        <div className="mb-5">
          <ConfirmationBanner decision={confirmedDecision} onReset={handleReset} />
        </div>
      )}

      {/* ── Notes & Buttons (hidden after confirmation, unless reset) ── */}
      {!confirmedDecision && (
        <>
          {/* Notes */}
          <div className="mb-5">
            <label
              htmlFor="decision-notes"
              className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Decision Notes (optional)
            </label>
            <textarea
              id="decision-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context for your decision, modifications, or concerns..."
              className="input-field min-h-[80px] resize-none text-sm"
              rows={3}
            />
          </div>

          {/* Decision Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              id="approve-btn"
              onClick={() => handleSubmit("approve")}
              disabled={isSubmitting}
              className={`btn-primary flex flex-col items-center gap-1.5 py-3 group ${
                isSubmitting && selectedDecision === "approve" ? "opacity-70" : ""
              }`}
            >
              {isSubmitting && selectedDecision === "approve" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="text-xs font-semibold">Approve</span>
            </button>
            <button
              id="assign-btn"
              onClick={() => {
                // Mock assignment action for Admin
                const el = document.getElementById('assign-btn');
                if (el) el.innerHTML = '<span class="text-xs font-semibold text-emerald-400">Assigned!</span>';
              }}
              disabled={isSubmitting}
              className={`btn-outline flex flex-col items-center gap-1.5 py-3 group border-indigo-500/30 bg-indigo-500/5`}
            >
              <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xs font-semibold text-indigo-300">Assign Volunteer</span>
            </button>
            <button
              id="modify-btn"
              onClick={() => handleSubmit("modify")}
              disabled={isSubmitting}
              className={`btn-outline flex flex-col items-center gap-1.5 py-3 group ${
                isSubmitting && selectedDecision === "modify" ? "opacity-70" : ""
              }`}
            >
              {isSubmitting && selectedDecision === "modify" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="text-xs font-semibold">Modify</span>
            </button>
            <button
              id="reject-btn"
              onClick={() => handleSubmit("reject")}
              disabled={isSubmitting}
              className={`btn-danger flex flex-col items-center gap-1.5 py-3 group ${
                isSubmitting && selectedDecision === "reject" ? "opacity-70" : ""
              }`}
            >
              {isSubmitting && selectedDecision === "reject" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
              <span className="text-xs font-semibold">Reject</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
