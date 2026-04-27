"use client";

import React, { useState } from "react";
import {
  MessageSquarePlus,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  XCircle,
  RefreshCw,
  Sparkles,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { CaseEngineResult } from "@/lib/case-engine-types";

/* ─── Status type ─── */
type FeedbackStatus = "idle" | "analyzing" | "success" | "error";

/* ─── Severity config ─── */
const severityStyle = {
  critical: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  high: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  low: { color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
};

const priorityStyle = {
  immediate: { color: "text-rose-400", dot: "bg-rose-400" },
  "short-term": { color: "text-amber-400", dot: "bg-amber-400" },
  "long-term": { color: "text-sky-400", dot: "bg-sky-400" },
};

export default function FeedbackPanel() {
  const [updateText, setUpdateText] = useState("");
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const [result, setResult] = useState<CaseEngineResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ── Submit field update to /api/case-engine (single source of truth) ── */
  const handleAnalyze = async () => {
    if (!updateText.trim()) return;

    setStatus("analyzing");
    setErrorMsg(null);
    setResult(null);

    try {
      console.log("[NGO OS Feedback] Submitting field update to Case Engine...");

      const res = await fetch("/api/case-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `[FIELD UPDATE / OUTCOME REPORT]\n\n${updateText.trim()}`,
        }),
      });

      if (!res.ok) {
        let detail = `Server returned ${res.status}`;
        try {
          const errBody = await res.json();
          detail = errBody.error || detail;
        } catch {
          /* ignore parse error */
        }
        throw new Error(detail);
      }

      const data: CaseEngineResult = await res.json();
      setResult(data);
      setStatus("success");

      console.log("[NGO OS Feedback] ✅ Outcome analysis received:", {
        issues: data.issues.length,
        actions: data.recommended_actions.length,
        status: data.case_status,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed.";
      setErrorMsg(msg);
      setStatus("error");
      console.error("[NGO OS Feedback] ❌ Error:", msg);
    }
  };

  /* ── Reset ── */
  const handleReset = () => {
    setUpdateText("");
    setStatus("idle");
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 animate-fade-in animate-delay-600 relative overflow-hidden group font-['Poppins',sans-serif]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
      <div className="relative z-10">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,214,242,0.2)]">
            <MessageSquarePlus className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg text-white font-bold tracking-tight text-shadow-glow">Field Feedback Log</h3>
            <p className="text-white/50 text-xs mt-1 font-medium tracking-wide">
              Submit updates &amp; analyze outcomes
            </p>
          </div>
        </div>
        {status === "success" && (
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Analyzed
          </span>
        )}
        {status === "analyzing" && (
          <span className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-[10px] font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(6,214,242,0.2)]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
          </span>
        )}
      </div>

      {/* ── Input Area ── */}
      {(status === "idle" || status === "error") && (
        <div className="animate-fade-in">
          <div className="mb-6 relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover/input:opacity-[0.15] transition duration-500 pointer-events-none"></div>
            <label
              htmlFor="field-update-input"
              className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3 relative z-10"
            >
              Field Update Entry
            </label>
            <textarea
              id="field-update-input"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Describe what happened after the initial response — new observations, changes on the ground, resolved issues, emerging problems..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white/90 focus:outline-none focus:border-cyan-500/50 transition-colors min-h-[120px] resize-none text-sm leading-relaxed relative z-10 placeholder-white/20"
              rows={4}
            />
            <div className="flex items-center justify-between mt-2 px-1 relative z-10">
              <span className="text-[10px] text-white/40 font-medium">
                {updateText.length > 0
                  ? `${updateText.length} characters — Ready for extraction`
                  : "Provide a field update log"}
              </span>
              {updateText.length > 0 && (
                <button
                  onClick={() => setUpdateText("")}
                  className="text-[10px] text-white/50 hover:text-white transition-colors font-semibold uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Error Banner */}
          {status === "error" && errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 animate-fade-in relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-rose-300 flex-1">{errorMsg}</p>
            </div>
          )}

          {/* Privacy + Submit */}
          <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm relative z-10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs text-emerald-400/80 font-semibold tracking-wide">
              Encrypted Processing Enabled
            </span>
          </div>

          <button
            id="analyze-outcome-btn"
            onClick={handleAnalyze}
            disabled={!updateText.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 relative z-10 overflow-hidden group ${
              !updateText.trim()
                ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(6,214,242,0.5)] hover:scale-[1.02]"
            }`}
          >
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-5 h-5 relative z-10" />
            <span className="relative z-10 tracking-wide">Analyze Outcome Data</span>
          </button>
        </div>
      )}

      {/* ── Loading State ── */}
      {status === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,214,242,0.2)]">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
          <p className="text-base font-bold text-white tracking-wide">Processing Field Intel...</p>
          <p className="text-xs text-white/50 mt-2 uppercase tracking-widest">Evaluating outcomes and risk matrices</p>
        </div>
      )}

      {/* ═══ Results ═══ */}
      {status === "success" && result && (
        <div className="space-y-6 animate-fade-in relative z-10">
          {/* Success Status Banner */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-500" />
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-emerald-400 tracking-wide">
                Intelligence Analysis Complete
              </p>
              <p className="text-xs text-emerald-400/70 font-semibold mt-1">
                Status: {result.case_status} <span className="mx-2 opacity-50">•</span> Risk Score: {result.risk_analysis.risk_score}/100
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500/60 uppercase tracking-wider bg-black/20 px-3 py-1.5 rounded-lg border border-emerald-500/10">
              <Clock className="w-3.5 h-3.5" />
              {new Date(result.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* New Issues Detected */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest">
                New Issues Detected
              </h4>
              <span className="ml-auto text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                {result.issues.length} active
              </span>
            </div>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {result.issues.map((issue, i) => {
                const sev = result.risk_analysis.severity === "Critical" ? "critical" : result.risk_analysis.severity === "High" ? "high" : result.risk_analysis.severity === "Medium" ? "medium" : "low";
                const style = severityStyle[sev as keyof typeof severityStyle];
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-xl ${style.bg} border ${style.border} hover:-translate-y-0.5 transition-transform duration-300`}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 px-2 py-0.5 rounded border ${style.border} ${style.color} flex-shrink-0`}
                    >
                      {sev}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white/90 leading-relaxed">{issue}</p>
                    </div>
                    <span className="text-[9px] text-white/50 font-bold px-2.5 py-1 rounded-md bg-black/40 border border-white/5 whitespace-nowrap flex-shrink-0 uppercase tracking-wider">
                      {result.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Actions Suggested */}
          <div className="p-5 rounded-2xl bg-black/20 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Lightbulb className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest">
                Actionable Protocols
              </h4>
            </div>
            <div className="space-y-3">
              {result.recommended_actions.map((action) => (
                  <div
                    key={action.step}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-[10px] font-extrabold text-cyan-400 border border-cyan-500/20">
                      {action.step}
                    </span>
                    <div className="flex-1 min-w-0 mt-0.5">
                      <p className="text-xs font-semibold text-white/80 leading-relaxed">
                        {action.action}
                      </p>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* AI Explanation */}
          {result.summary && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 mt-0.5">
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1.5">Intelligence Summary</p>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Another Update */}
          <button
            onClick={handleReset}
            className="w-full py-4 rounded-2xl border border-white/10 text-white/70 text-sm font-bold uppercase tracking-wider hover:bg-white/5 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Process Additional Update
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
