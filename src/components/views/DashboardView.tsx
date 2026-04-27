"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Users, FileStack, ShieldAlert, Timer, ArrowUpRight, TrendingDown, Activity, Zap, Globe2, Radio } from "lucide-react";
import DataUploadPanel from "@/components/DataUploadPanel";
import HumanDecisionPanel from "@/components/HumanDecisionPanel";
import ImpactPanel from "@/components/ImpactPanel";
import LiveFeedTicker from "@/components/LiveFeedTicker";
import MatchingPanel from "@/components/MatchingPanel";
import CaseEnginePanel from "@/components/CaseEnginePanel";
import { useCountUp } from "@/lib/useCountUp";
import { CRISIS_LOCATIONS, LIVE_FEED_EVENTS } from "@/lib/mockData";
import type { UploadStatus, CrisisNeed, ResourceMatch } from "@/lib/types";
import type { CaseEngineResult } from "@/lib/case-engine-types";

const CrisisMap = dynamic(() => import("@/components/CrisisMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-2xl bg-ngo-dark-800 border border-white/[0.06] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center animate-pulse">
          <ShieldAlert className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-xs text-slate-500 font-medium">Loading Crisis Map...</p>
      </div>
    </div>
  ),
});

/* ── Multi-Color Count-Up Stat Card ── */
function StatCard({ icon: Icon, label, numValue, displayValue, change, iconBg, glowClass, changeColor, trendUp, delay, accentColor, gradientFrom, gradientTo }: {
  icon: typeof Users; label: string; numValue: number; displayValue: string;
  change: string; iconBg: string; glowClass: string;
  changeColor: string; trendUp: boolean; delay: number;
  accentColor: string; gradientFrom: string; gradientTo: string;
}) {
  const count = useCountUp(numValue, 1500, delay);
  const display = displayValue.includes(".")
    ? displayValue
    : displayValue.replace(/[\d,]+/, count.toLocaleString());
  return (
    <div
      className={`liquid-glass ${glowClass} flex items-center gap-4 opacity-0 animate-slide-up group cursor-default p-5 rounded-3xl border border-white/5 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-400`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Subtle gradient reflection inside card */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${gradientFrom}, transparent 70%)` }}
      />
      <div className={`icon-box ${iconBg} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        <Icon className={`w-5 h-5 ${accentColor}`} />
      </div>
      <div className="flex-1 min-w-0 relative">
        <p className="text-xl font-bold text-white tracking-tight">{display}</p>
        <p className="text-[11px] text-slate-500 font-medium">{label}</p>
      </div>
      <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${changeColor}`}>
        {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </span>
    </div>
  );
}

const quickStats = [
  { icon: Users, label: "Active Operations", numValue: 24, displayValue: "24", change: "+3 today", iconBg: "icon-box-emerald", glowClass: "glow-ring-emerald", changeColor: "text-emerald-400", trendUp: true, accentColor: "text-emerald-400", gradientFrom: "#34d399", gradientTo: "#06d6f2" },
  { icon: FileStack, label: "Reports Processed", numValue: 1847, displayValue: "1,847", change: "+142 this week", iconBg: "icon-box-cyan", glowClass: "glow-ring-cyan", changeColor: "text-ngo-cyan", trendUp: true, accentColor: "text-ngo-cyan", gradientFrom: "#06d6f2", gradientTo: "#a855f7" },
  { icon: ShieldAlert, label: "Active Alerts", numValue: 7, displayValue: "7", change: "2 critical", iconBg: "icon-box-rose", glowClass: "glow-ring-rose", changeColor: "text-ngo-rose", trendUp: false, accentColor: "text-ngo-rose", gradientFrom: "#f43f5e", gradientTo: "#ec4899" },
  { icon: Timer, label: "Avg. Response", numValue: 1, displayValue: "1.8h", change: "-22% faster", iconBg: "icon-box-purple", glowClass: "glow-ring-purple", changeColor: "text-ngo-purple", trendUp: true, accentColor: "text-ngo-purple", gradientFrom: "#a855f7", gradientTo: "#ec4899" },
];

/* ═══════════════════════════════════════════════════════════════════
   Dashboard View — Single AI Pipeline: /api/case-engine
   No GeminiResultsPanel, no OpsEnginePanel, no AIResultsPanel.
   ═══════════════════════════════════════════════════════════════════ */

interface DashboardViewProps {
  onAnalyze: (data: { text: string; fileName?: string }) => Promise<void>;
  onNeedParsed: (need: CrisisNeed) => void;
  uploadStatus: UploadStatus;
  errorMessage: string | null;
  currentNeed: CrisisNeed | null;
  resourceMatches: ResourceMatch[];
  parsedNeeds: CrisisNeed[];
  onDecision: (d: "approve" | "modify" | "reject", n: string) => Promise<void>;
  isDecisionSubmitting: boolean;
  totalDecisions: number;
  onMarkerClick: (id: string) => void;
  onReportTextChange: (text: string) => void;
  // ✅ Single AI Engine
  caseResult: CaseEngineResult | null;
  isCaseLoading: boolean;
  onReAnalyze: () => void;
}

export default function DashboardView(props: DashboardViewProps) {
  const crisisLocations = useMemo(() => CRISIS_LOCATIONS, []);

  return (
    <div className="view-container font-['Poppins',sans-serif]">
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-animated opacity-20" />

      {/* Premium Header */}
      <div className="mb-10 relative z-10 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-[-0.04em] mb-3 text-shadow-glow">
          Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-['Source_Serif_4',serif] italic font-light drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">Command Center</span>
        </h2>
        <p className="text-sm text-white/50 font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Real-time intelligence and AI resource allocation matrix
        </p>
      </div>

      {/* Quick Stats */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 z-10">
        {quickStats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={(i + 1) * 100} />
        ))}
      </div>

      {/* System Pulse Bar — Multi-Color */}
      <div className="relative liquid-glass rounded-2xl p-4 mb-8 flex items-center gap-5 opacity-0 animate-slide-up z-10 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ngo-purple animate-breathe" />
          <span className="text-xs font-semibold text-slate-400">System Pulse</span>
        </div>
        <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: "87%",
              background: "linear-gradient(90deg, #06d6f2, #a855f7, #ec4899)",
              boxShadow: "0 0 12px rgba(168, 85, 247, 0.3)",
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          {[
            { icon: Zap, label: "AI", color: "text-ngo-cyan" },
            { icon: Globe2, label: "GIS", color: "text-ngo-purple" },
            { icon: Radio, label: "Comms", color: "text-ngo-pink" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <s.icon className={`w-3 h-3 ${s.color}`} />
              <span className="text-[10px] text-slate-500">{s.label}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-breathe" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 1: Map + Live Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-5">
        <div className="xl:col-span-3 h-[420px] opacity-0 animate-slide-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
          <CrisisMap crisisLocations={crisisLocations} parsedNeeds={props.parsedNeeds} onMarkerClick={props.onMarkerClick} />
        </div>
        <div className="h-[420px] opacity-0 animate-slide-up" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
          <LiveFeedTicker events={LIVE_FEED_EVENTS} />
        </div>
      </div>

      {/* Row 2: Data Upload + Matching */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "800ms", animationFillMode: "forwards" }}>
          <DataUploadPanel onAnalyze={props.onAnalyze} onNeedParsed={props.onNeedParsed} status={props.uploadStatus} errorMessage={props.errorMessage} lastParsedNeed={props.currentNeed} onReportTextChange={props.onReportTextChange} />
        </div>
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "900ms", animationFillMode: "forwards" }}>
          <MatchingPanel need={props.currentNeed} matches={props.resourceMatches} />
        </div>
      </div>

      {/* Row 3: Case Analysis Engine — Full Width (SINGLE AI PIPELINE) */}
      <div className="mb-5 opacity-0 animate-slide-up" style={{ animationDelay: "1000ms", animationFillMode: "forwards" }}>
        <CaseEnginePanel
          result={props.caseResult}
          isLoading={props.isCaseLoading}
          onAnalyze={props.onReAnalyze}
          hasReport={props.uploadStatus === "complete"}
        />
      </div>

      {/* Row 4: Impact Dashboard */}
      <div className="mb-5 opacity-0 animate-slide-up" style={{ animationDelay: "1100ms", animationFillMode: "forwards" }}>
        <ImpactPanel result={props.caseResult} totalDecisions={props.totalDecisions} />
      </div>

      {/* Row 5: Human Decision */}
      <div className="mb-5 opacity-0 animate-slide-up" style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}>
        <HumanDecisionPanel result={props.caseResult} onDecision={props.onDecision} isSubmitting={props.isDecisionSubmitting} />
      </div>
    </div>
  );
}
