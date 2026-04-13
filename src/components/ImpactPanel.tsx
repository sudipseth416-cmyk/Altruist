"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  Users,
  Zap,
  MapPin,
  TrendingUp,
  Shield,
  CheckCircle2,
  Clock,
  BarChart3,
  Target,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

interface ImpactPanelProps {
  result: AnalysisResult | null;
  totalDecisions: number;
}

/* ─── Animated Counter ─── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display.toLocaleString()}{suffix}</>;
}

/* ─── Mini Ring Chart ─── */
function MiniRing({
  value,
  max,
  size = 52,
  strokeWidth = 5,
  color,
  glowColor,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  glowColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - percent * circumference;
  const center = size / 2;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          filter: `drop-shadow(0 0 6px ${glowColor})`,
        }}
      />
    </svg>
  );
}

/* ─── Horizontal Stacked Bar ─── */
function StackedBar({
  segments,
}: {
  segments: { value: number; color: string; label: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div className="w-full">
      <div className="w-full h-3 rounded-full bg-white/[0.05] overflow-hidden flex">
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={i}
              className="h-full transition-all duration-1000 ease-out first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${pct}%`,
                background: seg.color,
                marginLeft: i > 0 ? "1px" : 0,
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-2.5 flex-wrap">
        {segments.map((seg, i) =>
          seg.value > 0 ? (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: seg.color }}
              />
              <span className="text-[10px] text-slate-400 font-medium">
                {seg.label}{" "}
                <span className="text-slate-500">({seg.value})</span>
              </span>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

/* ─── Vertical Progress Stat ─── */
function ProgressStat({
  label,
  value,
  max,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ElementType;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <Icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-slate-400 font-medium">{label}</span>
          <span className="text-[11px] text-white font-semibold">{value}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Panel
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function ImpactPanel({ result, totalDecisions }: ImpactPanelProps) {
  /* ── Derive data ── */
  const totalIssues = result?.detectedIssues.length ?? 0;
  const peopleAffected = result?.impactEstimate.peopleAffected ?? 0;
  const actionsTaken = result?.recommendedActions.length ?? 0;
  const regionsImpacted = result?.impactEstimate.regionsImpacted ?? 0;
  const risksIdentified = result?.riskAlerts.length ?? 0;

  /* Severity breakdown */
  const criticalIssues = result?.detectedIssues.filter((i) => i.severity === "critical").length ?? 0;
  const highIssues = result?.detectedIssues.filter((i) => i.severity === "high").length ?? 0;
  const mediumIssues = result?.detectedIssues.filter((i) => i.severity === "medium").length ?? 0;
  const lowIssues = result?.detectedIssues.filter((i) => i.severity === "low").length ?? 0;

  /* Action priority breakdown */
  const immediateActions = result?.recommendedActions.filter((a) => a.priority === "immediate").length ?? 0;
  const shortTermActions = result?.recommendedActions.filter((a) => a.priority === "short-term").length ?? 0;
  const longTermActions = result?.recommendedActions.filter((a) => a.priority === "long-term").length ?? 0;

  /* People affected scale — pick a sensible max for the gauge */
  const peopleMax = Math.max(peopleAffected, 50000);

  /* ── Empty State ── */
  if (!result) {
    return (
      <div className="glass-card p-6 animate-fade-in animate-delay-500 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
          <BarChart3 className="w-7 h-7 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-1">
          Impact Dashboard
        </h3>
        <p className="text-xs text-slate-600 text-center max-w-[220px]">
          Humanitarian impact metrics will appear here after analysis
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in animate-delay-500">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-emerald">
            <Activity className="w-5 h-5 text-ngo-accent" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Impact Dashboard</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Humanitarian impact at a glance
            </p>
          </div>
        </div>
        <span className="badge badge-cyan">
          <TrendingUp className="w-3 h-3" /> Live
        </span>
      </div>

      {/* ═══ Hero Metrics Row ═══ */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Total Issues */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-rose-500/[0.08] to-transparent border border-rose-500/15 group hover:border-rose-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 flex items-center justify-center">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
            </div>
            <MiniRing
              value={totalIssues}
              max={10}
              size={36}
              strokeWidth={4}
              color="#fb7185"
              glowColor="rgba(251,113,133,0.3)"
            />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight mb-0.5">
            <AnimatedNumber value={totalIssues} />
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Issues Detected</p>
        </div>

        {/* People Affected */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-500/[0.08] to-transparent border border-emerald-500/15 group hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <MiniRing
              value={peopleAffected}
              max={peopleMax}
              size={36}
              strokeWidth={4}
              color="#34d399"
              glowColor="rgba(52,211,153,0.3)"
            />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight mb-0.5">
            <AnimatedNumber value={peopleAffected} />
          </p>
          <p className="text-[11px] text-slate-500 font-medium">People Affected</p>
        </div>

        {/* Actions Taken */}
        <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-cyan-500/[0.08] to-transparent border border-cyan-500/15 group hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-cyan-400" />
            </div>
            <MiniRing
              value={actionsTaken}
              max={10}
              size={36}
              strokeWidth={4}
              color="#22d3ee"
              glowColor="rgba(34,211,238,0.3)"
            />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight mb-0.5">
            <AnimatedNumber value={actionsTaken} />
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Actions Taken</p>
        </div>
      </div>

      {/* ═══ Issue Severity Breakdown ═══ */}
      <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Issue Severity Breakdown
          </h4>
        </div>
        <StackedBar
          segments={[
            { value: criticalIssues, color: "#fb7185", label: "Critical" },
            { value: highIssues, color: "#fbbf24", label: "High" },
            { value: mediumIssues, color: "#facc15", label: "Medium" },
            { value: lowIssues, color: "#38bdf8", label: "Low" },
          ]}
        />
      </div>

      {/* ═══ Action Priority Chart + Operational Stats ═══ */}
      <div className="grid grid-cols-2 gap-4">
        {/* Action Priority Donut */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Action Priorities
          </h4>
          <div className="flex items-center gap-4">
            {/* Nested Rings */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <MiniRing
                value={immediateActions}
                max={actionsTaken || 1}
                size={64}
                strokeWidth={5}
                color="#fb7185"
                glowColor="rgba(251,113,133,0.2)"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <MiniRing
                  value={shortTermActions}
                  max={actionsTaken || 1}
                  size={44}
                  strokeWidth={4}
                  color="#fbbf24"
                  glowColor="rgba(251,191,36,0.2)"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MiniRing
                  value={longTermActions}
                  max={actionsTaken || 1}
                  size={26}
                  strokeWidth={3}
                  color="#38bdf8"
                  glowColor="rgba(56,189,248,0.2)"
                />
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-[10px] text-slate-400">Immediate</span>
                </div>
                <span className="text-[11px] text-white font-semibold">{immediateActions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-slate-400">Short-term</span>
                </div>
                <span className="text-[11px] text-white font-semibold">{shortTermActions}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-[10px] text-slate-400">Long-term</span>
                </div>
                <span className="text-[11px] text-white font-semibold">{longTermActions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Quick Stats */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Operational Metrics
          </h4>
          <div className="space-y-3">
            <ProgressStat
              label="Regions"
              value={regionsImpacted}
              max={10}
              color="#fbbf24"
              icon={MapPin}
            />
            <ProgressStat
              label="Risks"
              value={risksIdentified}
              max={6}
              color="#fb7185"
              icon={Shield}
            />
            <ProgressStat
              label="Decisions"
              value={totalDecisions}
              max={Math.max(totalDecisions, 5)}
              color="#34d399"
              icon={CheckCircle2}
            />
            <ProgressStat
              label="Confidence"
              value={result.confidenceScore}
              max={100}
              color="#22d3ee"
              icon={Target}
            />
          </div>
        </div>
      </div>

      {/* ═══ Urgency Level Badge ═══ */}
      <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-400 font-medium">Urgency Level</span>
        </div>
        <span
          className={`
            text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border
            ${
              result.impactEstimate.urgencyLevel === "Critical"
                ? "bg-rose-500/12 text-rose-300 border-rose-500/25"
                : result.impactEstimate.urgencyLevel === "High"
                ? "bg-amber-500/12 text-amber-300 border-amber-500/25"
                : "bg-sky-500/12 text-sky-300 border-sky-500/25"
            }
          `}
        >
          {result.impactEstimate.urgencyLevel}
        </span>
      </div>
    </div>
  );
}
