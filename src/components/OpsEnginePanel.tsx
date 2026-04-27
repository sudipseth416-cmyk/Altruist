"use client";

import React, { useState, useCallback } from "react";
import {
  Brain, Cpu, Shield, ListChecks, Wrench, Users, TrendingUp, RefreshCw,
  Loader2, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight,
  Zap, Activity, Target, Clock, Sparkles, ArrowRight, Package,
  UserCheck, Eye, EyeOff, CircleDot,
} from "lucide-react";
import type { OpsEngineResult, AgentTraceStep } from "@/lib/ops-engine-types";

/* ─── Agent Config ─── */
const AGENT_META: Record<number, { icon: typeof Brain; color: string; gradient: string }> = {
  1: { icon: Cpu, color: "text-ngo-cyan", gradient: "from-cyan-400 to-blue-500" },
  2: { icon: Brain, color: "text-ngo-purple", gradient: "from-purple-400 to-pink-500" },
  3: { icon: Shield, color: "text-ngo-rose", gradient: "from-rose-400 to-orange-500" },
  4: { icon: ListChecks, color: "text-emerald-400", gradient: "from-emerald-400 to-cyan-400" },
  5: { icon: Wrench, color: "text-ngo-amber", gradient: "from-amber-400 to-yellow-500" },
  6: { icon: Users, color: "text-ngo-blue", gradient: "from-blue-400 to-indigo-500" },
  7: { icon: TrendingUp, color: "text-ngo-pink", gradient: "from-pink-400 to-rose-500" },
  8: { icon: RefreshCw, color: "text-slate-400", gradient: "from-slate-400 to-slate-500" },
};

const severityConfig: Record<string, { color: string; bg: string; border: string }> = {
  Critical: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  High: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  Medium: { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  Low: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

const categoryLabels: Record<string, { label: string; emoji: string }> = {
  health: { label: "Health", emoji: "🏥" },
  education: { label: "Education", emoji: "📚" },
  disaster: { label: "Disaster", emoji: "🌊" },
  abuse: { label: "Abuse", emoji: "🛡️" },
  poverty: { label: "Poverty", emoji: "💔" },
  infrastructure: { label: "Infrastructure", emoji: "🏗️" },
  other: { label: "Other", emoji: "📋" },
};

interface OpsEnginePanelProps {
  result: OpsEngineResult | null;
  isLoading: boolean;
  onAnalyze: () => void;
  hasReport: boolean;
}

export default function OpsEnginePanel({ result, isLoading, onAnalyze, hasReport }: OpsEnginePanelProps) {
  const [showTrace, setShowTrace] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    actions: true, resources: true, volunteer: true, outcome: true,
  });

  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  /* ─── Empty State ─── */
  if (!result && !isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-box icon-box-purple">
            <Brain className="w-5 h-5 text-ngo-purple" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              Multi-Agent Operations Engine
              <span className="badge badge-purple text-[9px]">8 Agents</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">AI-powered structured decision pipeline</p>
          </div>
        </div>

        <div className="flex flex-col items-center py-8 text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(6,214,242,0.08))" }}>
              <Cpu className="w-8 h-8 text-ngo-purple/60" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ngo-dark-800 flex items-center justify-center border border-ngo-purple/20">
              <Sparkles className="w-3 h-3 text-ngo-purple animate-breathe" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Pipeline Ready</p>
          <p className="text-xs text-slate-600 max-w-xs mb-5">
            Submit a field report first, then run the 8-agent decision pipeline for structured analysis.
          </p>
          <button onClick={onAnalyze} disabled={!hasReport}
            className={`btn-primary flex items-center gap-2 text-sm ${!hasReport ? "opacity-40 cursor-not-allowed" : ""}`}>
            <Zap className="w-4 h-4" />
            Run Operations Engine
          </button>
        </div>

        {/* Agent Pipeline Preview */}
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {[1,2,3,4,5,6,7,8].map((n) => {
            const meta = AGENT_META[n];
            return (
              <div key={n} className="flex flex-col items-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <meta.icon className={`w-3.5 h-3.5 ${meta.color} opacity-40 mb-1`} />
                <span className="text-[8px] text-slate-600 font-medium text-center leading-tight">Agent {n}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Loading State ─── */
  if (isLoading) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-box icon-box-purple animate-pulse">
            <Brain className="w-5 h-5 text-ngo-purple" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Operations Engine Processing</h3>
            <p className="text-slate-500 text-xs">Executing 8-agent pipeline...</p>
          </div>
          <Loader2 className="w-5 h-5 text-ngo-purple animate-spin ml-auto" />
        </div>
        <div className="space-y-2">
          {[1,2,3,4,5,6,7,8].map((n) => {
            const meta = AGENT_META[n];
            const names = ["Input Processing","Analysis","Risk Assessment","Action Planning","Resource & Skill","Volunteer Matching","Outcome Prediction","Follow-Up / Loop"];
            return (
              <div key={n} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-fade-in"
                style={{ animationDelay: `${n * 200}ms`, animationFillMode: "both" }}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${meta.gradient} bg-opacity-20`}
                  style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,214,242,0.05))` }}>
                  <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-300">{names[n-1]}</p>
                </div>
                <div className="w-4 h-4">
                  {n <= 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                   n === 4 ? <Loader2 className="w-4 h-4 text-ngo-cyan animate-spin" /> :
                   <CircleDot className="w-4 h-4 text-slate-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Results Display ─── */
  const sev = severityConfig[result!.risk_analysis.severity] || severityConfig.Medium;
  const cat = categoryLabels[result!.category] || categoryLabels.other;

  return (
    <div className="glass-card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-purple">
            <Brain className="w-5 h-5 text-ngo-purple" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              Operations Engine Result
              <span className={`badge text-[9px] ${sev.bg} ${sev.border} ${sev.color}`}>
                {result!.risk_analysis.severity}
              </span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              {cat.emoji} {cat.label} • Processed in {result!.processingTime}ms
            </p>
          </div>
        </div>
        <button onClick={onAnalyze} disabled={!hasReport}
          className="btn-outline text-xs flex items-center gap-1.5 px-3 py-1.5">
          <RefreshCw className="w-3 h-3" /> Re-run
        </button>
      </div>

      {/* Summary */}
      <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-br from-ngo-purple/[0.06] to-ngo-cyan/[0.03] border border-ngo-purple/15">
        <p className="text-sm text-slate-200 leading-relaxed">{result!.summary}</p>
      </div>

      {/* Risk Score + Category Bar */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className={`text-2xl font-bold ${sev.color}`}>{result!.risk_analysis.risk_score}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Risk Score</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className={`text-lg font-bold ${sev.color}`}>{result!.risk_analysis.severity}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Severity</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-lg font-bold text-ngo-amber">{result!.risk_analysis.urgency}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Urgency</p>
        </div>
      </div>

      {/* Risk Score Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 font-medium">RISK SCORE</span>
          <span className={`text-xs font-bold ${sev.color}`}>{result!.risk_analysis.risk_score}/100</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{
            width: `${result!.risk_analysis.risk_score}%`,
            background: result!.risk_analysis.risk_score >= 80
              ? "linear-gradient(90deg, #f43f5e, #ec4899)"
              : result!.risk_analysis.risk_score >= 60
              ? "linear-gradient(90deg, #f59e0b, #f43f5e)"
              : result!.risk_analysis.risk_score >= 40
              ? "linear-gradient(90deg, #06d6f2, #a855f7)"
              : "linear-gradient(90deg, #34d399, #06d6f2)",
            boxShadow: `0 0 12px ${result!.risk_analysis.risk_score >= 80 ? "rgba(244,63,94,0.3)" : "rgba(168,85,247,0.2)"}`,
            transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </div>

      {/* Issues */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" /> Detected Issues
        </p>
        <div className="space-y-1.5">
          {result!.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="w-5 h-5 rounded-md bg-ngo-rose/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] font-bold text-ngo-rose">{i + 1}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{issue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible: Recommended Actions */}
      <CollapsibleSection title="Recommended Actions" icon={ListChecks} iconColor="text-emerald-400"
        count={result!.recommended_actions.length} isOpen={expandedSections.actions} onToggle={() => toggleSection("actions")}>
        <div className="space-y-1.5">
          {result!.recommended_actions.map((a) => (
            <div key={a.step} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(6,214,242,0.08))" }}>
                <span className="text-[10px] font-bold text-emerald-400">{a.step}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{a.action}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Collapsible: Resources Required */}
      <CollapsibleSection title="Resources Required" icon={Package} iconColor="text-ngo-amber"
        count={result!.resources_required.skills.length + result!.resources_required.materials.length}
        isOpen={expandedSections.resources} onToggle={() => toggleSection("resources")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Wrench className="w-2.5 h-2.5" /> Skills
            </p>
            <div className="space-y-1">
              {result!.resources_required.skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/10">
                  <ArrowRight className="w-2.5 h-2.5 text-ngo-amber flex-shrink-0" />
                  <span className="text-[11px] text-slate-300">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Package className="w-2.5 h-2.5" /> Materials
            </p>
            <div className="space-y-1">
              {result!.resources_required.materials.map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-cyan-500/[0.04] border border-cyan-500/10">
                  <ArrowRight className="w-2.5 h-2.5 text-ngo-cyan flex-shrink-0" />
                  <span className="text-[11px] text-slate-300">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Collapsible: Volunteer Suggestion */}
      <CollapsibleSection title="Volunteer Profile" icon={UserCheck} iconColor="text-ngo-blue"
        isOpen={expandedSections.volunteer} onToggle={() => toggleSection("volunteer")}>
        <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(168,85,247,0.08))" }}>
            <Users className="w-6 h-6 text-ngo-blue" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{result!.volunteer_suggestion.type}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-blue text-[9px]">
                {result!.volunteer_suggestion.experience_level.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Collapsible: Outcome Prediction */}
      <CollapsibleSection title="Outcome Prediction" icon={TrendingUp} iconColor="text-ngo-pink"
        isOpen={expandedSections.outcome} onToggle={() => toggleSection("outcome")}>
        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">If Actions Followed</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{result!.outcome_prediction.expected_if_followed}</p>
          </div>
          <div className="p-3 rounded-xl border border-rose-500/15 bg-rose-500/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">If Ignored</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{result!.outcome_prediction.risk_if_ignored}</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Follow-up Actions (if any) */}
      {result!.follow_up_actions.length > 0 && (
        <div className="mt-4 p-3 rounded-xl border border-slate-500/15 bg-slate-500/[0.03]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> Follow-Up Actions
          </p>
          <div className="space-y-1.5">
            {result!.follow_up_actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Trace Toggle */}
      <div className="mt-5 pt-4 border-t border-white/[0.04]">
        <button onClick={() => setShowTrace(!showTrace)}
          className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 transition-colors py-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Activity className="w-3 h-3" /> Agent Pipeline Trace
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-600">
              {result!.agentTrace.filter((a) => a.status === "completed").length}/8 completed
            </span>
            {showTrace ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showTrace && (
          <div className="mt-3 space-y-1 animate-fade-in-fast">
            {result!.agentTrace.map((agent) => {
              const meta = AGENT_META[agent.agentNumber] || AGENT_META[1];
              return (
                <div key={agent.agentNumber} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.015] border border-white/[0.03]">
                  <meta.icon className={`w-3.5 h-3.5 ${meta.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-slate-300 truncate">{agent.agent}</p>
                    <p className="text-[9px] text-slate-600 truncate">{agent.output_summary}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[9px] text-slate-600 font-mono">{agent.duration}ms</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400/60" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Collapsible Section Helper ─── */
function CollapsibleSection({ title, icon: Icon, iconColor, count, isOpen, onToggle, children }: {
  title: string; icon: typeof Brain; iconColor: string;
  count?: number; isOpen: boolean; onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <button onClick={onToggle}
        className="w-full flex items-center gap-2 py-2 text-left group">
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-1 group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        {count !== undefined && (
          <span className="text-[9px] text-slate-600 font-medium">{count}</span>
        )}
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-600" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
      </button>
      {isOpen && <div className="animate-fade-in-fast">{children}</div>}
    </div>
  );
}
