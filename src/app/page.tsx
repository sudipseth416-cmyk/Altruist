"use client";

import React, { useState, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import type { ViewId } from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardView from "@/components/views/DashboardView";
import FieldOpsView from "@/components/views/FieldOpsView";
import RiskMonitorView from "@/components/views/RiskMonitorView";
import AnalyticsView from "@/components/views/AnalyticsView";
import FeedbackView from "@/components/views/FeedbackView";
import CaseHistoryView from "@/components/views/CaseHistoryView";
import FAQView from "@/components/views/FAQView";
import SettingsView from "@/components/views/SettingsView";
import LandingView from "@/components/views/LandingView";
import AuthModal from "@/components/AuthModal";
import VolunteerDashboardView from "@/components/views/VolunteerDashboardView";
import DonorDashboardView from "@/components/views/DonorDashboardView";
import { getTopMatches } from "@/lib/matching-engine";
import {
  VOLUNTEER_PROFILES,
  CRISIS_LOCATIONS,
  SYSTEM_HEALTH,
} from "@/lib/mockData";
import type { UploadStatus, CrisisNeed, ResourceMatch } from "@/lib/types";
import type { CaseEngineResult } from "@/lib/case-engine-types";
import HeroInterface from "@/components/views/HeroInterface";
import { CheckCircle2, XCircle, Info } from "lucide-react";

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

/* ─── View Title Map ─── */
const VIEW_TITLES: Record<ViewId, string> = {
  dashboard: "Command Center",
  "field-ops": "Field Operations",
  risk: "Risk Monitor",
  analytics: "Analytics Center",
  feedback: "Field Feedback",
  cases: "Case Management",
  faq: "FAQ",
  settings: "Settings",
  "volunteer-dash": "Volunteer Dashboard",
  "donor-dash": "Donor Insights",
};

/* ═══════════════════════════════════════════════════════════════════
   Main Page — Single Source of Truth: /api/case-engine
   ALL analysis goes through the anti-hallucination Case Engine.
   ═══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [appMode, setAppMode] = useState<"landing" | "app">("landing");
  const [userRole, setUserRole] = useState<string>("admin");
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showHero, setShowHero] = useState(false);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [viewKey, setViewKey] = useState(0); // forces re-mount for animations

  // Core state
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Intelligence Dashboard state
  const [parsedNeeds, setParsedNeeds] = useState<CrisisNeed[]>([]);
  const [currentNeed, setCurrentNeed] = useState<CrisisNeed | null>(null);
  const [resourceMatches, setResourceMatches] = useState<ResourceMatch[]>([]);
  const [lastReportText, setLastReportText] = useState<string>("");

  // ✅ SINGLE AI ENGINE — Case Engine (anti-hallucination + validation)
  const [caseResult, setCaseResult] = useState<CaseEngineResult | null>(null);
  const [isCaseLoading, setIsCaseLoading] = useState(false);

  // Human decision state
  const [isDecisionSubmitting, setIsDecisionSubmitting] = useState(false);
  const [totalDecisions, setTotalDecisions] = useState(0);

  const crisisLocations = useMemo(() => CRISIS_LOCATIONS, []);

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

  const handleLoginSuccess = (user: any, role: string) => {
    setUser(user);
    setUserRole(role);
    if (role === 'volunteer') {
      setActiveView('volunteer-dash');
    } else if (role === 'donor') {
      setActiveView('donor-dash');
    } else {
      setActiveView('dashboard');
    }
    setAppMode("app");
    setShowHero(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setAppMode("landing");
  };

  /* ── Navigate between views ── */
  const handleNavigate = useCallback((view: ViewId) => {
    if (view === activeView) return;
    setActiveView(view);
    setViewKey((k) => k + 1); // re-mount to trigger entry animations
  }, [activeView]);

  /* ── Handle NLP Parse ── */
  const handleNeedParsed = useCallback(
    (need: CrisisNeed) => {
      setCurrentNeed(need);
      setParsedNeeds((prev) => {
        const exists = prev.some(
          (n) => n.location === need.location && n.category === need.category
        );
        return exists ? prev : [...prev, need];
      });

      const matches = getTopMatches(need, VOLUNTEER_PROFILES, 5);
      setResourceMatches(matches);

      if (matches.length > 0) {
        addToast(
          "info",
          `NLP extracted: ${need.category} crisis in ${need.location}. ${matches.length} volunteers matched (top: ${matches[0].matchScore}% score).`
        );
      }
    },
    [addToast]
  );

  /* ══════════════════════════════════════════════════════════════════
     🔥 SINGLE SOURCE OF TRUTH — /api/case-engine
     ALL report analysis goes through this ONE validated pipeline.
     No other AI routes are called.
     ══════════════════════════════════════════════════════════════════ */
  const handleAnalyze = useCallback(
    async (data: { text: string; fileName?: string }) => {
      setErrorMessage(null);
      try {
        setUploadStatus("uploading");
        await new Promise((r) => setTimeout(r, 400));

        setUploadStatus("analyzing");

        // ✅ SINGLE ROUTE — /api/case-engine with validation layer
        const res = await fetch("/api/case-engine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.text }),
        });

        if (!res.ok) {
          let apiError = `Server returned ${res.status}`;
          try {
            const errorBody = await res.json();
            apiError = errorBody.error || errorBody.detail || apiError;
          } catch { /* empty */ }
          throw new Error(apiError);
        }

        const result: CaseEngineResult = await res.json();

        if (!result.id || !result.issues) {
          throw new Error("Analysis response is incomplete. Please try again.");
        }

        setCaseResult(result);
        setUploadStatus("complete");
        addToast(
          "success",
          `Case Engine complete — ${result.case_status.toUpperCase()} status, ` +
          `${result.category} category, risk ${result.risk_analysis.risk_score}/100.`
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setUploadStatus("error");
        setErrorMessage(message);
        addToast("error", message);
      }
    },
    [addToast]
  );

  /* ── Re-analyze with Case Engine (for manual re-run button) ── */
  const handleReAnalyze = useCallback(async () => {
    if (!lastReportText) {
      addToast("error", "Submit a report first.");
      return;
    }
    try {
      setIsCaseLoading(true);
      addToast("info", "Case Engine re-analysis — 13-step evidence-locked pipeline running...");

      const res = await fetch("/api/case-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: lastReportText }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Case Engine returned ${res.status}`);
      }

      const result: CaseEngineResult = await res.json();
      setCaseResult(result);
      addToast("success", `Re-analysis complete — ${result.case_status.toUpperCase()} status, risk ${result.risk_analysis.risk_score}/100.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Case Engine failed.";
      addToast("error", msg);
    } finally {
      setIsCaseLoading(false);
    }
  }, [lastReportText, addToast]);

  /* ── Handle Decision ── */
  const handleDecision = useCallback(
    async (decision: "approve" | "modify" | "reject", notes: string) => {
      if (!caseResult) return;
      try {
        setIsDecisionSubmitting(true);
        const res = await fetch("/api/decision", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysisId: caseResult.id,
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
    [caseResult, addToast]
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

  /* ── Render active view ── */
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            onAnalyze={handleAnalyze}
            onNeedParsed={handleNeedParsed}
            uploadStatus={uploadStatus}
            errorMessage={errorMessage}
            currentNeed={currentNeed}
            resourceMatches={resourceMatches}
            parsedNeeds={parsedNeeds}
            onDecision={handleDecision}
            isDecisionSubmitting={isDecisionSubmitting}
            totalDecisions={totalDecisions}
            onMarkerClick={handleMarkerClick}
            onReportTextChange={setLastReportText}
            caseResult={caseResult}
            isCaseLoading={isCaseLoading}
            onReAnalyze={handleReAnalyze}
          />
        );
      case "field-ops":
        return <FieldOpsView />;
      case "risk":
        return <RiskMonitorView />;
      case "analytics":
        return <AnalyticsView />;
      case "feedback":
        return <FeedbackView />;
      case "cases":
        return <CaseHistoryView />;
      case "faq":
        return <FAQView />;
      case "settings":
        return <SettingsView />;
      case "volunteer-dash":
        return <VolunteerDashboardView />;
      case "donor-dash":
        return <DonorDashboardView />;
      default:
        return null;
    }
  };

  if (appMode === "landing") {
    return (
      <>
        <LandingView onGetStarted={() => setShowAuth(true)} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLoginSuccess={handleLoginSuccess} />}
      </>
    );
  }

  if (showHero) {
    return (
      <HeroInterface 
        userRole={userRole} 
        onContinue={() => setShowHero(false)} 
        user={user} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        systemHealth={SYSTEM_HEALTH}
        crisisLocations={crisisLocations}
        activeView={activeView}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >
        <Header activeView={activeView} onNavigate={handleNavigate} userRole={userRole} onLogout={handleLogout} />

        <main className="flex-1 px-5 py-5 overflow-y-auto relative">
          {/* Animated gradient background */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-animated opacity-50" />

          {/* Content with view transition key */}
          <div key={viewKey} className="relative z-10">
            {renderView()}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
