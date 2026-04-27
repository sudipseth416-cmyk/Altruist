"use client";

import React, { useState } from "react";
import {
  Brain, Sparkles, AlertTriangle, Lightbulb, Zap, BarChart3,
  ChevronDown, Shield, TrendingUp, TrendingDown, Minus, Clock,
  FileSearch, Target, Flame, ArrowRight,
} from "lucide-react";
import type { GeminiDeepAnalysis } from "@/lib/types";

const severityConfig = {
  critical: { bg: "rgba(244,63,94,0.06)", border: "border-rose-500/20", text: "text-rose-400", badge: "badge-rose", dot: "bg-rose-500" },
  high: { bg: "rgba(245,158,11,0.06)", border: "border-amber-500/20", text: "text-amber-400", badge: "badge-amber", dot: "bg-amber-400" },
  medium: { bg: "rgba(168,85,247,0.04)", border: "border-purple-500/15", text: "text-purple-400", badge: "badge-purple", dot: "bg-purple-400" },
  moderate: { bg: "rgba(59,130,246,0.04)", border: "border-blue-500/15", text: "text-blue-400", badge: "badge-blue", dot: "bg-blue-400" },
  low: { bg: "rgba(52,211,153,0.04)", border: "border-emerald-500/15", text: "text-emerald-400", badge: "badge-emerald", dot: "bg-emerald-400" },
};

const priorityColors = {
  immediate: "text-rose-400",
  "short-term": "text-amber-400",
  "long-term": "text-blue-400",
};

const trendIcons = {
  up: <TrendingUp className="w-3 h-3 text-rose-400" />,
  down: <TrendingDown className="w-3 h-3 text-emerald-400" />,
  stable: <Minus className="w-3 h-3 text-slate-400" />,
};

interface GeminiResultsPanelProps {
  result: GeminiDeepAnalysis | null;
  isLoading: boolean;
  onAnalyze: () => void;
  hasReport: boolean;
}

export default function GeminiResultsPanel({ result, isLoading, onAnalyze, hasReport }: GeminiResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<"findings" | "risks" | "insights" | "actions">("findings");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tabs = [
    { id: "findings" as const, label: "Findings", icon: FileSearch, count: result?.keyFindings.length || 0 },
    { id: "risks" as const, label: "Risks", icon: Shield, count: result?.riskAssessment.length || 0 },
    { id: "insights" as const, label: "Insights", icon: Lightbulb, count: result?.strategicInsights.length || 0 },
    { id: "actions" as const, label: "Actions", icon: Target, count: result?.suggestedActions.length || 0 },
  ];

  return (
    <div className="glass-card overflow-hidden">
      {/* Header with gradient top-bar */}
      <div
        className="p-5 border-b border-white/[0.06]"
        style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.04), rgba(6, 214, 242, 0.02))" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.15))",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.15)",
              }}
            >
              <Brain className={`w-5 h-5 text-ngo-purple ${isLoading ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Gemini Deep Analysis
                <Sparkles className="w-3.5 h-3.5 text-ngo-purple animate-breathe" />
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {result ? (
                  <>
                    {result.model} • {Math.round(result.processingTime)}ms •{" "}
                    <span className={severityConfig[result.overallSeverity]?.text || "text-slate-400"}>
                      {result.overallSeverity.toUpperCase()} severity
                    </span>
                  </>
                ) : (
                  "Advanced AI reasoning & research engine"
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onAnalyze}
            disabled={!hasReport || isLoading}
            className={`btn-primary text-xs py-2 px-4 flex items-center gap-2 ${
              !hasReport || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                Analyze with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 animate-ping" style={{ animationDelay: "0.5s" }} />
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(6, 214, 242, 0.1))" }}
            >
              <Brain className="w-7 h-7 text-ngo-purple animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Gemini Deep Analysis in Progress</p>
            <p className="text-xs text-slate-500 mt-1">Analyzing patterns, risks, and strategic insights...</p>
          </div>
          <div className="flex gap-1.5 mt-2">
            {["Parsing report", "Identifying risks", "Generating insights", "Preparing actions"].map((step, i) => (
              <span key={step} className="text-[9px] px-2 py-1 rounded-full bg-white/[0.03] text-slate-500 animate-fade-in" style={{ animationDelay: `${i * 400}ms` }}>
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(6, 214, 242, 0.05))" }}>
            <Brain className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-400 font-medium">No deep analysis yet</p>
          <p className="text-xs text-slate-600 mt-1">
            {hasReport ? 'Click "Analyze with AI" to run Gemini deep analysis' : "Submit a report first, then run deep analysis"}
          </p>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <>
          {/* Summary */}
          <div className="px-5 pt-4 pb-3">
            <p className="text-xs text-slate-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Data Points Strip */}
          <div className="px-5 pb-3">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {result.dataPoints.map((dp, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] min-w-[100px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{dp.value}</span>
                    {dp.unit && <span className="text-[9px] text-slate-500">{dp.unit}</span>}
                    {dp.trend && trendIcons[dp.trend]}
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">{dp.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-5 flex gap-1 border-b border-white/[0.06]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-white border-b-2"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                }`}
                style={activeTab === tab.id ? { borderImage: "linear-gradient(90deg, #06d6f2, #a855f7) 1" } : undefined}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06]">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar space-y-2">
            {activeTab === "findings" && result.keyFindings.map((f) => {
              const style = severityConfig[f.severity] || severityConfig.medium;
              const expanded = expandedId === f.id;
              return (
                <div key={f.id} className={`p-3 rounded-xl border ${style.border} cursor-pointer transition-all duration-300 hover:bg-white/[0.01]`}
                  style={{ background: style.bg }}
                  onClick={() => setExpandedId(expanded ? null : f.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${style.dot} ${f.severity === "critical" ? "animate-blink-critical" : ""}`} />
                    <span className="text-sm font-semibold text-white flex-1">{f.title}</span>
                    <span className={`badge ${style.badge} text-[9px]`}>{f.severity}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                  </div>
                  {expanded && (
                    <div className="mt-2 pt-2 border-t border-white/[0.05] animate-fade-in-fast space-y-2">
                      <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                      <div className="flex items-start gap-1.5 p-2 rounded-lg bg-white/[0.02]">
                        <FileSearch className="w-3 h-3 text-ngo-purple mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-slate-500"><span className="text-slate-400 font-semibold">Evidence:</span> {f.evidence}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {activeTab === "risks" && result.riskAssessment.map((risk) => {
              const style = severityConfig[risk.level] || severityConfig.medium;
              const expanded = expandedId === risk.id;
              return (
                <div key={risk.id} className={`p-3 rounded-xl border ${style.border} cursor-pointer transition-all duration-300`}
                  style={{ background: style.bg }}
                  onClick={() => setExpandedId(expanded ? null : risk.id)}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${style.text} flex-shrink-0`} />
                    <span className="text-sm font-semibold text-white flex-1">{risk.title}</span>
                    <span className={`text-sm font-bold ${style.text}`}>{risk.probability}%</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                  </div>
                  <div className="mt-2 progress-bar-track h-1.5">
                    <div className={`progress-bar-fill ${style.dot.replace("bg-", "bg-")}`} style={{ width: `${risk.probability}%` }} />
                  </div>
                  {expanded && (
                    <div className="mt-3 pt-2 border-t border-white/[0.05] animate-fade-in-fast space-y-2">
                      <p className="text-xs text-slate-400">{risk.description}</p>
                      <div className="p-2 rounded-lg bg-white/[0.02]">
                        <p className="text-[10px] text-slate-500"><span className="text-slate-400 font-semibold">Impact:</span> {risk.impact}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ background: "linear-gradient(135deg, rgba(6, 214, 242, 0.03), rgba(168, 85, 247, 0.02))" }}>
                        <p className="text-[10px] text-gradient font-semibold mb-1">Mitigation</p>
                        <p className="text-xs text-slate-300">{risk.mitigation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {activeTab === "insights" && result.strategicInsights.map((ins) => (
              <div key={ins.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all duration-300 hover:bg-white/[0.03]">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className={`w-4 h-4 ${ins.relevance === "high" ? "text-ngo-purple" : "text-slate-500"}`} />
                  <span className="text-sm font-semibold text-white flex-1">{ins.title}</span>
                  {ins.actionable && <span className="badge badge-purple text-[9px]">Actionable</span>}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ins.insight}</p>
              </div>
            ))}

            {activeTab === "actions" && result.suggestedActions.map((act) => (
              <div key={act.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all duration-300 hover:bg-white/[0.03]"
                onClick={() => setExpandedId(expandedId === act.id ? null : act.id)}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <ArrowRight className={`w-4 h-4 ${priorityColors[act.priority]} flex-shrink-0`} />
                  <span className="text-sm font-semibold text-white flex-1">{act.action}</span>
                  <span className={`text-[9px] font-bold uppercase ${priorityColors[act.priority]}`}>{act.priority}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${expandedId === act.id ? "rotate-180" : ""}`} />
                </div>
                {expandedId === act.id && (
                  <div className="mt-2 pt-2 border-t border-white/[0.05] animate-fade-in-fast space-y-1.5">
                    <p className="text-xs text-slate-400"><span className="text-slate-300 font-semibold">Rationale:</span> {act.rationale}</p>
                    <p className="text-xs text-slate-400"><span className="text-slate-300 font-semibold">Resources:</span> {act.resources}</p>
                    <p className="text-xs text-slate-400"><span className="text-slate-300 font-semibold">Impact:</span> {act.estimatedImpact}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-600" />
              <span className="text-[10px] text-slate-600">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Confidence:</span>
              <span className="text-xs font-bold text-gradient">{result.confidenceScore}%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
