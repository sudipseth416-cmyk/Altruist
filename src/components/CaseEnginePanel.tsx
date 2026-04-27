"use client";

import React, { useState } from "react";
import {
  Brain, Loader2, ShieldAlert, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronRight, FileSearch, Crosshair, Activity,
  Users, Package, ClipboardList, TrendingUp, Link2, Gauge,
  Zap, Lock, Eye, ArrowRight, Fingerprint, Scale,
} from "lucide-react";
import type { CaseEngineResult } from "@/lib/case-engine-types";

interface CaseEnginePanelProps {
  result: CaseEngineResult | null;
  isLoading: boolean;
  onAnalyze: () => void;
  hasReport: boolean;
}

/* ── Severity color helpers ── */
const severityStyle: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Critical: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-[0_0_20px_rgba(244,63,94,0.15)]" },
  High: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]" },
  Medium: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]" },
  Low: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]" },
};

const statusStyle: Record<string, { text: string; bg: string; label: string }> = {
  new: { text: "text-cyan-400", bg: "bg-cyan-500/10", label: "NEW" },
  in_progress: { text: "text-amber-400", bg: "bg-amber-500/10", label: "IN PROGRESS" },
  critical: { text: "text-rose-400", bg: "bg-rose-500/10", label: "CRITICAL" },
  improving: { text: "text-emerald-400", bg: "bg-emerald-500/10", label: "IMPROVING" },
  resolved: { text: "text-green-400", bg: "bg-green-500/10", label: "RESOLVED" },
  uncertain: { text: "text-slate-400", bg: "bg-slate-500/10", label: "UNCERTAIN" },
};

const confidenceColor = (c: string) =>
  c === "high" ? "text-emerald-400" : c === "medium" ? "text-amber-400" : "text-slate-400";

/* ── Collapsible Section ── */
function Section({ title, icon: Icon, iconColor, children, defaultOpen = true }: {
  title: string; icon: typeof Brain; iconColor: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
        <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex-1 text-left">{title}</span>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-white/[0.04]">{children}</div>}
    </div>
  );
}

/* ── Risk Gauge ── */
function RiskGauge({ score, severity, urgency }: { score: number; severity: string; urgency: string }) {
  const s = severityStyle[severity] || severityStyle.Medium;
  const pct = Math.min(100, Math.max(0, score));
  const color = score >= 75 ? "#f43f5e" : score >= 55 ? "#f59e0b" : score >= 40 ? "#06b6d4" : "#34d399";
  return (
    <div className={`p-4 rounded-xl border ${s.border} ${s.bg} ${s.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className={`w-4 h-4 ${s.text}`} />
          <span className="text-xs font-bold text-white">Risk Score</span>
        </div>
        <span className={`text-2xl font-black ${s.text}`}>{score}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-white/[0.03]">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Severity</p>
          <p className={`text-xs font-bold ${s.text}`}>{severity}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.03]">
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Urgency</p>
          <p className={`text-xs font-bold ${s.text}`}>{urgency}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Panel
   ═══════════════════════════════════════════════════════════════════ */

export default function CaseEnginePanel({ result, isLoading, onAnalyze, hasReport }: CaseEnginePanelProps) {
  const ss = result ? (statusStyle[result.case_status] || statusStyle.uncertain) : null;

  /* ── Empty / Loading State ── */
  if (!result && !isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-box icon-box-rose"><Fingerprint className="w-5 h-5 text-ngo-rose" /></div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              Case Analysis Engine
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">ANTI-HALLUCINATION</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Evidence-locked 13-step case analysis — zero assumptions</p>
          </div>
        </div>
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/10 to-purple-500/10 border border-white/[0.06] flex items-center justify-center">
            <Scale className="w-8 h-8 text-rose-400/60" />
          </div>
          <p className="text-sm text-slate-400 text-center max-w-md">
            Submit a field report first, then run this engine for <strong className="text-white">strict, evidence-based</strong> case analysis with anti-hallucination safeguards.
          </p>
          <button onClick={onAnalyze} disabled={!hasReport} className={`btn-primary flex items-center gap-2 ${!hasReport ? "opacity-40 cursor-not-allowed" : ""}`}>
            <Fingerprint className="w-4 h-4" /> Run Case Engine
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box icon-box-rose"><Fingerprint className="w-5 h-5 text-ngo-rose" /></div>
          <div>
            <h3 className="text-white font-semibold text-sm">Case Analysis Engine</h3>
            <p className="text-slate-500 text-xs mt-0.5">Processing with anti-hallucination lock...</p>
          </div>
        </div>
        <div className="flex flex-col items-center py-12 gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-rose-500/20 border-t-rose-400 animate-spin" />
            <Lock className="w-6 h-6 text-rose-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="text-sm text-white font-medium mb-1">13-Step Evidence Pipeline Active</p>
            <p className="text-xs text-slate-500">Self-validation & anti-fake checks running...</p>
          </div>
          {["Fact Extraction", "Cause Analysis", "Risk Scoring", "Evidence Mapping", "Self-Validation"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 400}ms` }}>
              {i < 3 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Loader2 className="w-3.5 h-3.5 text-rose-400 animate-spin" />}
              <span className="text-[11px] text-slate-400">{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;
  const sev = severityStyle[result.risk_analysis.severity] || severityStyle.Medium;

  return (
    <div className={`glass-card p-5 animate-fade-in ${sev.glow}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-rose"><Fingerprint className="w-5 h-5 text-ngo-rose" /></div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              Case Analysis Engine
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">ANTI-HALLUCINATION</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              {result.model} • {Math.round(result.processingTime)}ms
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ss && (
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${ss.text} ${ss.bg} border border-white/[0.06]`}>{ss.label}</span>
          )}
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${sev.text} ${sev.bg} border ${sev.border}`}>{result.category}</span>
          <button onClick={onAnalyze} disabled={!hasReport} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors" title="Re-analyze">
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] mb-4">
        <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
      </div>

      {/* Risk Gauge + Case Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <RiskGauge score={result.risk_analysis.risk_score} severity={result.risk_analysis.severity} urgency={result.risk_analysis.urgency} />
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">Cause Analysis</span>
          </div>
          <p className="text-sm text-slate-300 mb-2">{result.cause_analysis.identified_cause}</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-500 uppercase">Confidence:</span>
            <span className={`text-xs font-bold uppercase ${confidenceColor(result.cause_analysis.confidence)}`}>{result.cause_analysis.confidence}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Volunteer Profile</span>
          </div>
          <p className="text-sm text-slate-300 mb-2">{result.volunteer_suggestion.type}</p>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            result.volunteer_suggestion.experience_level === "expert" ? "text-rose-400 bg-rose-500/10" :
            result.volunteer_suggestion.experience_level === "intermediate" ? "text-amber-400 bg-amber-500/10" :
            "text-emerald-400 bg-emerald-500/10"
          }`}>{result.volunteer_suggestion.experience_level}</span>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3">
        {/* Issues */}
        <Section title={`Issues Detected (${result.issues.length})`} icon={ShieldAlert} iconColor="text-amber-400">
          <div className="space-y-2 pt-3">
            {result.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">{issue}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Actions */}
        <Section title={`Recommended Actions (${result.recommended_actions.length})`} icon={ClipboardList} iconColor="text-emerald-400">
          <div className="space-y-2 pt-3">
            {result.recommended_actions.map((a) => (
              <div key={a.step} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400">{a.step}</span>
                <span className="text-xs text-slate-300 pt-1">{a.action}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Resources */}
        <Section title="Resources Required" icon={Package} iconColor="text-cyan-400" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Skills</p>
              {result.resources_required.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs text-slate-300">{s}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold">Materials</p>
              {result.resources_required.materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="text-xs text-slate-300">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Outcome Prediction */}
        <Section title="Outcome Prediction" icon={TrendingUp} iconColor="text-purple-400" defaultOpen={false}>
          <div className="space-y-3 pt-3">
            <div className="p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">If Actions Followed</p>
              <p className="text-xs text-slate-300">{result.outcome_prediction.expected_if_followed}</p>
            </div>
            <div className="p-3 rounded-lg bg-rose-500/[0.05] border border-rose-500/10">
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">Risk If Ignored</p>
              <p className="text-xs text-slate-300">{result.outcome_prediction.risk_if_ignored}</p>
            </div>
          </div>
        </Section>

        {/* Follow-Up */}
        {result.follow_up_actions.length > 0 && (
          <Section title={`Follow-Up Actions (${result.follow_up_actions.length})`} icon={ArrowRight} iconColor="text-amber-400" defaultOpen={false}>
            <div className="space-y-2 pt-3">
              {result.follow_up_actions.map((a, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <ArrowRight className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300">{a}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Evidence Map */}
        {result.evidence_map.length > 0 && (
          <Section title={`Evidence Map (${result.evidence_map.length})`} icon={Link2} iconColor="text-rose-400">
            <div className="space-y-2 pt-3">
              {result.evidence_map.map((e, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-rose-500/[0.03] border border-rose-500/10">
                  <p className="text-xs text-slate-300 mb-1"><strong className="text-white">Statement:</strong> {e.statement}</p>
                  <p className="text-[10px] text-slate-500"><FileSearch className="w-3 h-3 inline mr-1 text-rose-400/60" />Source: {e.source}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* History */}
        {result.history_evaluation.current_condition !== "not available" && (
          <Section title="History Evaluation" icon={Activity} iconColor="text-blue-400" defaultOpen={false}>
            <div className="space-y-2 pt-3">
              <p className="text-xs text-slate-300"><strong className="text-white">Condition:</strong> {result.history_evaluation.current_condition}</p>
              {result.history_evaluation.improvements.length > 0 && (
                <div>
                  <p className="text-[10px] text-emerald-400 font-bold mb-1">Improvements</p>
                  {result.history_evaluation.improvements.map((imp, i) => (
                    <p key={i} className="text-xs text-slate-400 ml-3">• {imp}</p>
                  ))}
                </div>
              )}
              {result.history_evaluation.failures.length > 0 && (
                <div>
                  <p className="text-[10px] text-rose-400 font-bold mb-1">Failures</p>
                  {result.history_evaluation.failures.map((f, i) => (
                    <p key={i} className="text-xs text-slate-400 ml-3">• {f}</p>
                  ))}
                </div>
              )}
            </div>
          </Section>
        )}
      </div>

      {/* Anti-Hallucination Footer */}
      <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/[0.04] border border-rose-500/10">
        <Lock className="w-3 h-3 text-rose-400/60 flex-shrink-0" />
        <span className="text-[9px] text-rose-300/60 font-medium">
          Anti-Hallucination Lock Active — All outputs evidence-mapped to input text. Zero assumptions made.
        </span>
      </div>
    </div>
  );
}
