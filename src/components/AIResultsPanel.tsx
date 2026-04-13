"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Target,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight,
  Flame,
  Info,
  TrendingUp,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Wrench,
  Activity,
  RadioTower,
  TriangleAlert,
  ShieldCheck,
  Lock,
} from "lucide-react";
import type { AnalysisResult, RiskAlert } from "@/lib/types";

interface AIResultsPanelProps {
  result: AnalysisResult | null;
}

const severityConfig = {
  critical: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Critical" },
  high: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "High" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Medium" },
  low: { color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", label: "Low" },
};

const priorityConfig = {
  immediate: { color: "text-rose-400", dot: "bg-rose-400" },
  "short-term": { color: "text-amber-400", dot: "bg-amber-400" },
  "long-term": { color: "text-sky-400", dot: "bg-sky-400" },
};

/* ═══════════════════════════════════════════════════════════════════
   Risk Level Visual Config — drives entire card appearance
   ═══════════════════════════════════════════════════════════════════ */
const riskCardConfig = {
  critical: {
    icon: Flame,
    label: "Critical Risk",
    tagBg: "bg-rose-500/15",
    tagText: "text-rose-300",
    tagBorder: "border-rose-500/30",
    borderColor: "border-rose-500/25",
    bgGradient: "from-rose-500/[0.08] via-rose-900/[0.04] to-transparent",
    glowColor: "hover:shadow-[0_0_30px_rgba(251,113,133,0.1)]",
    accentBar: "bg-gradient-to-b from-rose-400 to-rose-600",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    probBarFill: "bg-gradient-to-r from-rose-500 to-rose-400",
    probBarGlow: "shadow-[0_0_8px_rgba(251,113,133,0.3)]",
    probText: "text-rose-400",
    mitigationBg: "bg-rose-500/[0.06]",
    mitigationBorder: "border-rose-500/10",
    mitigationIcon: "text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    label: "Medium Risk",
    tagBg: "bg-amber-500/15",
    tagText: "text-amber-300",
    tagBorder: "border-amber-500/30",
    borderColor: "border-amber-500/20",
    bgGradient: "from-amber-500/[0.06] via-amber-900/[0.03] to-transparent",
    glowColor: "hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]",
    accentBar: "bg-gradient-to-b from-amber-400 to-amber-600",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    probBarFill: "bg-gradient-to-r from-amber-500 to-yellow-400",
    probBarGlow: "shadow-[0_0_8px_rgba(251,191,36,0.3)]",
    probText: "text-amber-400",
    mitigationBg: "bg-amber-500/[0.06]",
    mitigationBorder: "border-amber-500/10",
    mitigationIcon: "text-amber-400",
  },
  info: {
    icon: Info,
    label: "Low Risk",
    tagBg: "bg-sky-500/15",
    tagText: "text-sky-300",
    tagBorder: "border-sky-500/30",
    borderColor: "border-sky-500/15",
    bgGradient: "from-sky-500/[0.04] via-sky-900/[0.02] to-transparent",
    glowColor: "hover:shadow-[0_0_30px_rgba(56,189,248,0.06)]",
    accentBar: "bg-gradient-to-b from-sky-400 to-sky-600",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    probBarFill: "bg-gradient-to-r from-sky-500 to-cyan-400",
    probBarGlow: "shadow-[0_0_8px_rgba(56,189,248,0.25)]",
    probText: "text-sky-400",
    mitigationBg: "bg-sky-500/[0.06]",
    mitigationBorder: "border-sky-500/10",
    mitigationIcon: "text-sky-400",
  },
};

/* ─── Probability Label ─── */
function getProbabilityLabel(probability: number): string {
  if (probability >= 80) return "Very Likely";
  if (probability >= 60) return "Likely";
  if (probability >= 40) return "Possible";
  if (probability >= 20) return "Unlikely";
  return "Rare";
}

/* ─── Priority Gauge ─── */
function PriorityGauge({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 75 ? "#fb7185" : score >= 50 ? "#fbbf24" : score >= 25 ? "#22d3ee" : "#34d399";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="112" height="112" className="-rotate-90">
        <circle cx="56" cy="56" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
          Priority
        </span>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Risk Alert Card — the core enhanced component
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function RiskAlertCard({ alert, index }: { alert: RiskAlert; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = riskCardConfig[alert.level];
  const Icon = config.icon;
  const probability = alert.probability ?? 50;
  const probLabel = getProbabilityLabel(probability);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border ${config.borderColor}
        bg-gradient-to-br ${config.bgGradient}
        ${config.glowColor}
        transition-all duration-300 ease-out
        animate-fade-in
      `}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Colored accent bar on left edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentBar}`} />

      <div className="pl-5 pr-4 py-4">
        {/* ── Header Row ── */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`
              w-10 h-10 rounded-xl ${config.iconBg}
              flex items-center justify-center flex-shrink-0
              transition-transform duration-300 group-hover:scale-110
            `}
          >
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>

          {/* Title + Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h5 className="text-sm font-semibold text-white leading-tight">
                {alert.title}
              </h5>
              <span
                className={`
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                  text-[10px] font-bold uppercase tracking-wider
                  border ${config.tagBg} ${config.tagText} ${config.tagBorder}
                `}
              >
                <RadioTower className="w-2.5 h-2.5" />
                {config.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {alert.description}
            </p>
          </div>

          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200"
            aria-label={expanded ? "Collapse risk details" : "Expand risk details"}
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        {/* ── Probability Bar (always visible) ── */}
        <div className="mt-3.5 ml-[52px]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Activity className={`w-3 h-3 ${config.probText}`} />
              <span className="text-[11px] font-medium text-slate-400">
                Probability
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${config.probText}`}>
                {probability}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                — {probLabel}
              </span>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full ${config.probBarFill} ${config.probBarGlow} transition-all duration-1000 ease-out`}
              style={{ width: `${probability}%` }}
            />
          </div>
        </div>

        {/* ── Expanded: Mitigation Suggestion ── */}
        {expanded && alert.mitigation && (
          <div
            className={`
              mt-3.5 ml-[52px] p-3 rounded-xl
              ${config.mitigationBg} border ${config.mitigationBorder}
              animate-fade-in
            `}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`
                  w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                  ${config.iconBg}
                `}
              >
                <Wrench className={`w-3.5 h-3.5 ${config.mitigationIcon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mitigation Strategy
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {alert.mitigation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Risk Summary Header — aggregate stats
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function RiskSummaryBar({ alerts }: { alerts: RiskAlert[] }) {
  const criticalCount = alerts.filter((a) => a.level === "critical").length;
  const warningCount = alerts.filter((a) => a.level === "warning").length;
  const infoCount = alerts.filter((a) => a.level === "info").length;
  const avgProbability = Math.round(
    alerts.reduce((sum, a) => sum + (a.probability ?? 50), 0) / alerts.length
  );

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {criticalCount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <Flame className="w-3 h-3 text-rose-400" />
          <span className="text-[11px] font-semibold text-rose-300">
            {criticalCount} Critical
          </span>
        </span>
      )}
      {warningCount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <TriangleAlert className="w-3 h-3 text-amber-400" />
          <span className="text-[11px] font-semibold text-amber-300">
            {warningCount} Medium
          </span>
        </span>
      )}
      {infoCount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20">
          <Info className="w-3 h-3 text-sky-400" />
          <span className="text-[11px] font-semibold text-sky-300">
            {infoCount} Low
          </span>
        </span>
      )}
      <span className="ml-auto text-[10px] text-slate-500 font-medium flex items-center gap-1">
        <Activity className="w-3 h-3" />
        Avg. probability: {avgProbability}%
      </span>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Panel
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AIResultsPanel({ result }: AIResultsPanelProps) {
  if (!result) {
    return (
      <div className="glass-card p-6 animate-fade-in animate-delay-300 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-1">
          No Analysis Yet
        </h3>
        <p className="text-xs text-slate-600 text-center max-w-[240px]">
          Upload field data and run the AI analysis to see results here
        </p>
      </div>
    );
  }

  /* Sort risks: critical first, then warning, then info */
  const sortedRisks = [...result.riskAlerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.level] - order[b.level];
  });

  return (
    <div className="glass-card p-6 animate-fade-in animate-delay-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-emerald">
            <Target className="w-5 h-5 text-ngo-accent" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">AI Analysis Results</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Processed at {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-emerald">
            <TrendingUp className="w-3 h-3" /> Complete
          </span>
        </div>
      </div>

      {/* Privacy Badge */}
      <div className="mb-5 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex items-center gap-1.5 flex-1">
          <Lock className="w-3 h-3 text-emerald-400/70" />
          <span className="text-[11px] font-semibold text-emerald-300/90 tracking-wide">
            Privacy Protected Processing Enabled
          </span>
        </div>
        <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">
          PII Masked
        </span>
      </div>

      {/* AI Explanation */}
      {result.explanation && (
        <div className="mb-5 p-4 rounded-xl bg-ngo-accent/[0.04] border border-ngo-accent/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-ngo-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-ngo-accent" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ngo-accent-light uppercase tracking-wider mb-1">
                AI Assessment
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Priority Gauge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <PriorityGauge score={result.priorityScore} />
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {result.priorityScore >= 75
              ? "Immediate Action Required"
              : result.priorityScore >= 50
              ? "High Priority"
              : "Monitor & Plan"}
          </p>
        </div>

        {/* Detected Issues */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Detected Issues</h4>
            <span className="ml-auto text-xs text-slate-500">
              {result.detectedIssues.length} found
            </span>
          </div>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {result.detectedIssues.map((issue) => {
              const config = severityConfig[issue.severity];
              return (
                <div
                  key={issue.id}
                  className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} border ${config.border}`}
                >
                  <div className="mt-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{issue.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {issue.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-white/[0.04] whitespace-nowrap">
                    {issue.category}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-ngo-accent" />
          <h4 className="text-sm font-semibold text-white">Recommended Actions</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {result.recommendedActions.map((action) => {
            const config = priorityConfig[action.priority];
            return (
              <div
                key={action.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{action.action}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.color}`}>
                      {action.priority}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      {action.estimatedImpact}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Enhanced Risk Alerts Section ═══ */}
      {result.riskAlerts.length > 0 && (
        <div className="mt-6">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-ngo-rose" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white">Risk Assessment</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {sortedRisks.length} risk{sortedRisks.length > 1 ? "s" : ""} identified — expand for mitigation strategies
              </p>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <Shield className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] text-slate-500 font-medium">
                {sortedRisks.length} Total
              </span>
            </div>
          </div>

          {/* Risk Summary Chips */}
          <div className="mb-4">
            <RiskSummaryBar alerts={result.riskAlerts} />
          </div>

          {/* Risk Alert Cards */}
          <div className="space-y-3">
            {sortedRisks.map((alert, idx) => (
              <RiskAlertCard key={alert.id} alert={alert} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
