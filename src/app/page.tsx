"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DataUploadPanel from "@/components/DataUploadPanel";
import AIResultsPanel from "@/components/AIResultsPanel";
import HumanDecisionPanel from "@/components/HumanDecisionPanel";
import FeedbackPanel from "@/components/FeedbackPanel";
import ImpactPanel from "@/components/ImpactPanel";
import LiveFeedTicker from "@/components/LiveFeedTicker";
import MatchingPanel from "@/components/MatchingPanel";
import { getTopMatches } from "@/lib/matching-engine";
import {
  VOLUNTEER_PROFILES,
  CRISIS_LOCATIONS,
  LIVE_FEED_EVENTS,
  SYSTEM_HEALTH,
} from "@/lib/mockData";
import type { AnalysisResult, UploadStatus, CrisisNeed, ResourceMatch } from "@/lib/types";
import {
  Users,
  FileStack,
  ShieldAlert,
  Timer,
  CheckCircle2,
  XCircle,
  Info,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

/* ── Dynamic import for CrisisMap (Leaflet needs window) ── */
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

/* ─── Toast Notification ─── */
interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-ngo-accent flex-shrink-0" />,
    error: <XCircle className="w-4 h-4 text-ngo-rose flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-ngo-cyan flex-shrink-0" />,
  };
  const borders = {
    success: "border-ngo-accent/20",
    error: "border-ngo-rose/20",
    info: "border-ngo-cyan/20",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl border ${borders[toast.type]} animate-slide-up`}
          style={{
            background: "linear-gradient(135deg, rgba(22,29,53,0.95), rgba(15,22,41,0.98))",
            backdropFilter: "blur(20px)",
          }}
        >
          {icons[toast.type]}
          <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Quick‑Stat Bar ─── */
const quickStats = [
  {
    icon: Users,
    label: "Active Operations",
    value: "24",
    change: "+3 today",
    color: "text-ngo-accent",
    iconBg: "icon-box-emerald",
    glowClass: "glow-ring-emerald",
    changeColor: "text-ngo-accent",
    trendUp: true,
  },
  {
    icon: FileStack,
    label: "Reports Processed",
    value: "1,847",
    change: "+142 this week",
    color: "text-ngo-cyan",
    iconBg: "icon-box-cyan",
    glowClass: "glow-ring-cyan",
    changeColor: "text-ngo-cyan",
    trendUp: true,
  },
  {
    icon: ShieldAlert,
    label: "Active Alerts",
    value: "7",
    change: "2 critical",
    color: "text-ngo-rose",
    iconBg: "icon-box-rose",
    glowClass: "glow-ring-rose",
    changeColor: "text-ngo-rose",
    trendUp: false,
  },
  {
    icon: Timer,
    label: "Avg. Response",
    value: "1.8h",
    change: "-22% faster",
    color: "text-ngo-amber",
    iconBg: "icon-box-amber",
    glowClass: "glow-ring-amber",
    changeColor: "text-ngo-accent",
    trendUp: true,
  },
];

/* ─── Main Page ─── */
export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDecisionSubmitting, setIsDecisionSubmitting] = useState(false);
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Intelligence Dashboard state
  const [parsedNeeds, setParsedNeeds] = useState<CrisisNeed[]>([]);
  const [currentNeed, setCurrentNeed] = useState<CrisisNeed | null>(null);
  const [resourceMatches, setResourceMatches] = useState<ResourceMatch[]>([]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Handle NLP Parse ── */
  const handleNeedParsed = useCallback(
    (need: CrisisNeed) => {
      setCurrentNeed(need);
      setParsedNeeds((prev) => {
        // Avoid duplicates by location+category
        const exists = prev.some(
          (n) => n.location === need.location && n.category === need.category
        );
        return exists ? prev : [...prev, need];
      });

      // Run matching engine
      const matches = getTopMatches(need, VOLUNTEER_PROFILES, 5);
      setResourceMatches(matches);

      if (matches.length > 0) {
        addToast(
          "info",
          `NLP extracted: ${need.category} crisis in ${need.location}. ${matches.length} volunteers matched (top: ${matches[0].matchScore}% score).`
        );
      }

      console.log(
        `%c[NGO OS] 🧠 NLP Extraction Complete`,
        "color: #22d3ee; font-weight: bold; font-size: 13px;"
      );
      console.table({
        Location: need.location,
        Category: need.category,
        Urgency: need.urgency,
        Population: need.population,
        Coordinates: `[${need.coordinates[0].toFixed(2)}, ${need.coordinates[1].toFixed(2)}]`,
      });
    },
    [addToast]
  );

  /* ── Handle Analysis ── */
  const handleAnalyze = useCallback(
    async (data: { text: string; fileName?: string }) => {
      setErrorMessage(null);

      try {
        console.log("[NGO OS Client] Starting analysis...", {
          textLength: data.text.length,
          fileName: data.fileName || "none",
        });
        setUploadStatus("uploading");
        await new Promise((r) => setTimeout(r, 600));

        setUploadStatus("analyzing");
        console.log("[NGO OS Client] Sending POST /api/analyze...");

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        console.log("[NGO OS Client] Response status:", res.status);

        if (!res.ok) {
          let apiError = `Server returned ${res.status}`;
          try {
            const errorBody = await res.json();
            console.error("[NGO OS Client] API error body:", errorBody);
            apiError = errorBody.error || errorBody.detail || apiError;
          } catch {
            console.error("[NGO OS Client] Could not parse error response body");
          }
          throw new Error(apiError);
        }

        let result: AnalysisResult;
        try {
          result = await res.json();
        } catch (parseErr) {
          console.error("[NGO OS Client] Failed to parse response JSON:", parseErr);
          throw new Error("Received invalid response from the server. Please try again.");
        }

        console.log("[NGO OS Client] Analysis received:", {
          id: result.id,
          priorityScore: result.priorityScore,
          confidenceScore: result.confidenceScore,
          issueCount: result.detectedIssues?.length ?? 0,
          actionCount: result.recommendedActions?.length ?? 0,
          riskCount: result.riskAlerts?.length ?? 0,
          hasExplanation: !!result.explanation,
        });

        if (!result.id || !result.detectedIssues) {
          console.warn("[NGO OS Client] Response missing expected fields:", Object.keys(result));
          throw new Error("Analysis response is incomplete. Please try again.");
        }

        setAnalysisResult(result);
        setUploadStatus("complete");
        addToast("success", "AI analysis completed. NLP extraction + resource matching active.");
        console.log("[NGO OS Client] ✅ Analysis stored. Panels updated.");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        console.error("[NGO OS Client] ❌ Analysis failed:", message);
        setUploadStatus("error");
        setErrorMessage(message);
        addToast("error", message);
      }
    },
    [addToast]
  );

  /* ── Handle Decision ── */
  const handleDecision = useCallback(
    async (decision: "approve" | "modify" | "reject", notes: string) => {
      if (!analysisResult) return;
      try {
        setIsDecisionSubmitting(true);
        const res = await fetch("/api/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisId: analysisResult.id,
            decision,
            notes,
          }),
        });

        if (!res.ok) throw new Error("Decision submission failed");

        const data = await res.json();
        setTotalDecisions((prev) => prev + 1);

        const labels = { approve: "approved", modify: "sent for modification", reject: "rejected" };
        addToast("success", `Decision ${labels[decision]}. ${data.message}`);
      } catch {
        addToast("error", "Failed to submit decision. Please try again.");
      } finally {
        setIsDecisionSubmitting(false);
      }
    },
    [analysisResult, addToast]
  );

  /* ── Map marker click ── */
  const handleMarkerClick = useCallback(
    (id: string) => {
      const crisis = CRISIS_LOCATIONS.find((c) => c.id === id);
      if (crisis) {
        addToast("info", `Viewing: ${crisis.name} — ${crisis.category} (${crisis.urgency})`);
      }
    },
    [addToast]
  );

  /* ── Memoize combined crisis data for the map ── */
  const crisisLocations = useMemo(() => CRISIS_LOCATIONS, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        systemHealth={SYSTEM_HEALTH}
        crisisLocations={crisisLocations}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >
        <Header />

        <main className="flex-1 px-5 py-5 overflow-y-auto">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {quickStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`stat-card ${stat.glowClass} flex items-center gap-4 animate-fade-in group cursor-default`}
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className={`icon-box ${stat.iconBg} group-hover:scale-105 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">{stat.label}</p>
                </div>
                <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${stat.changeColor}`}>
                  {stat.trendUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>
              </div>
            ))}
          </div>

          {/* ═══ Row 1: Map + Live Feed ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 mb-5">
            {/* Crisis Map — takes 3 columns */}
            <div className="xl:col-span-3 h-[420px]">
              <CrisisMap
                crisisLocations={crisisLocations}
                parsedNeeds={parsedNeeds}
                onMarkerClick={handleMarkerClick}
              />
            </div>

            {/* Live Feed Ticker — 1 column */}
            <div className="h-[420px]">
              <LiveFeedTicker events={LIVE_FEED_EVENTS} />
            </div>
          </div>

          {/* ═══ Row 2: Data Ingestion + Resource Matching ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
            <DataUploadPanel
              onAnalyze={handleAnalyze}
              onNeedParsed={handleNeedParsed}
              status={uploadStatus}
              errorMessage={errorMessage}
              lastParsedNeed={currentNeed}
            />
            <MatchingPanel need={currentNeed} matches={resourceMatches} />
          </div>

          {/* ═══ Row 3: AI Results + Impact ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
            <AIResultsPanel result={analysisResult} />
            <ImpactPanel
              result={analysisResult}
              totalDecisions={totalDecisions}
            />
          </div>

          {/* ═══ Row 4: Decision + Feedback ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <HumanDecisionPanel
              result={analysisResult}
              onDecision={handleDecision}
              isSubmitting={isDecisionSubmitting}
            />
            <FeedbackPanel />
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
