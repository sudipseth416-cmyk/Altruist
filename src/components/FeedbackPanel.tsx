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
import type { AnalysisResult } from "@/lib/types";

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
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ── Submit field update to same /api/analyze ── */
  const handleAnalyze = async () => {
    if (!updateText.trim()) return;

    setStatus("analyzing");
    setErrorMsg(null);
    setResult(null);

    try {
      console.log("[NGO OS Feedback] Submitting field update for outcome analysis...");

      const res = await fetch("/api/analyze", {
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

      const data: AnalysisResult = await res.json();
      setResult(data);
      setStatus("success");

      console.log("[NGO OS Feedback] ✅ Outcome analysis received:", {
        issues: data.detectedIssues.length,
        actions: data.recommendedActions.length,
        confidence: data.confidenceScore,
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
    <div className="glass-card p-6 animate-fade-in animate-delay-600">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-cyan">
            <MessageSquarePlus className="w-5 h-5 text-ngo-cyan" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Field Feedback</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Submit updates &amp; analyze outcomes
            </p>
          </div>
        </div>
        {status === "success" && (
          <span className="badge badge-emerald">
            <CheckCircle2 className="w-3 h-3" /> Analyzed
          </span>
        )}
        {status === "analyzing" && (
          <span className="badge badge-cyan">
            <Loader2 className="w-3 h-3 animate-spin" /> Processing
          </span>
        )}
      </div>

      {/* ── Input Area ── */}
      {(status === "idle" || status === "error") && (
        <>
          <div className="mb-4">
            <label
              htmlFor="field-update-input"
              className="block text-xs font-medium text-slate-400 mb-2"
            >
              Field Update
            </label>
            <textarea
              id="field-update-input"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Describe what happened after the initial response — new observations, changes on the ground, resolved issues, emerging problems..."
              className="input-field min-h-[100px] resize-none text-sm leading-relaxed"
              rows={4}
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-slate-600">
                {updateText.length > 0
                  ? `${updateText.length} characters`
                  : "Provide a field update"}
              </span>
              {updateText.length > 0 && (
                <button
                  onClick={() => setUpdateText("")}
                  className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Error Banner */}
          {status === "error" && errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/[0.06] border border-rose-500/20 flex items-start gap-2.5 animate-fade-in">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 flex-1">{errorMsg}</p>
            </div>
          )}

          {/* Privacy + Submit */}
          <div className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80 flex-shrink-0" />
            <span className="text-[10px] text-emerald-300/70 font-medium">
              Privacy Protected Processing Enabled
            </span>
          </div>

          <button
            id="analyze-outcome-btn"
            onClick={handleAnalyze}
            disabled={!updateText.trim()}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${
              !updateText.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Analyze Outcome
          </button>
        </>
      )}

      {/* ── Loading State ── */}
      {status === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-ngo-cyan/10 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-ngo-cyan animate-spin" />
          </div>
          <p className="text-sm text-slate-300 font-medium">Analyzing field update...</p>
          <p className="text-xs text-slate-500 mt-1">Evaluating outcomes and new risks</p>
        </div>
      )}

      {/* ═══ Results ═══ */}
      {status === "success" && result && (
        <div className="space-y-4 animate-fade-in">
          {/* Success Status Banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-300">
                Outcome Analysis Complete
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Confidence: {result.confidenceScore}% • Priority Score: {result.priorityScore}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="w-3 h-3" />
              {new Date(result.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* New Issues Detected */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                New Issues Detected
              </h4>
              <span className="ml-auto text-[10px] text-slate-500 font-medium">
                {result.detectedIssues.length} found
              </span>
            </div>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {result.detectedIssues.map((issue) => {
                const style = severityStyle[issue.severity];
                return (
                  <div
                    key={issue.id}
                    className={`flex items-start gap-3 p-2.5 rounded-lg ${style.bg} border ${style.border}`}
                  >
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${style.color} flex-shrink-0`}
                    >
                      {issue.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white">{issue.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {issue.description}
                      </p>
                    </div>
                    <span className="text-[9px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-white/[0.04] whitespace-nowrap flex-shrink-0">
                      {issue.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Actions Suggested */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-ngo-accent" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Next Actions Suggested
              </h4>
            </div>
            <div className="space-y-2">
              {result.recommendedActions.map((action) => {
                const style = priorityStyle[action.priority];
                return (
                  <div
                    key={action.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {action.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[9px] font-semibold uppercase tracking-wider ${style.color}`}
                        >
                          {action.priority}
                        </span>
                        <span className="text-slate-600 text-[9px]">•</span>
                        <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                          <ArrowUpRight className="w-2.5 h-2.5" />
                          {action.estimatedImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Explanation */}
          {result.explanation && (
            <div className="p-3.5 rounded-xl bg-ngo-accent/[0.04] border border-ngo-accent/10">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-3.5 h-3.5 text-ngo-accent mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Submit Another Update */}
          <button
            onClick={handleReset}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Submit Another Update
          </button>
        </div>
      )}
    </div>
  );
}
