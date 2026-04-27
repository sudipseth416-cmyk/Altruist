"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  History,
  FileText,
  Download,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Database,
  Zap,
  ArrowUpRight,
  MessageSquare,
  Plus,
  Send,
  Filter,
} from "lucide-react";

/* ── Types ── */
interface CaseSummary {
  caseId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  category: string;
  summary: string;
  originalReport: string;
}

interface TimelineEntry {
  date: string;
  event: string;
  type: "report" | "action" | "update";
}

interface ActionTaken {
  date: string;
  action: string;
  by: string;
}

interface FeedbackEntry {
  date: string;
  note: string;
}

interface FullCase extends CaseSummary {
  analysis: Record<string, any>;
  timeline: TimelineEntry[];
  actionsTaken: ActionTaken[];
  feedback: FeedbackEntry[];
}

/* ── Status colors ── */
const statusConfig: Record<string, { color: string; bg: string; border: string }> = {
  new: { color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  in_progress: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  critical: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  improving: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  resolved: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  uncertain: { color: "text-white/40", bg: "bg-white/5", border: "border-white/10" },
};

const categoryIcons: Record<string, string> = {
  health: "🏥",
  education: "📚",
  disaster: "🌊",
  abuse: "🛡️",
  poverty: "🍞",
  infrastructure: "🏗️",
  other: "📋",
};

/* ── Timeline type icons ── */
const timelineIcon = (type: string) => {
  switch (type) {
    case "report": return <FileText className="w-3.5 h-3.5 text-sky-400" />;
    case "action": return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    case "update": return <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />;
    default: return <Clock className="w-3.5 h-3.5 text-white/40" />;
  }
};

export default function CaseHistoryPanel() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<FullCase | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dbAvailable, setDbAvailable] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [showActionForm, setShowActionForm] = useState(false);
  const [actionText, setActionText] = useState("");
  const [actionBy, setActionBy] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/cases?${params.toString()}`);
      if (!res.ok) throw new Error("Fetch failed");
      
      const data = await res.json();
      
      setDbAvailable(true);
      setCases(data.cases || []);
      setTotal(data.total || 0);
    } catch (err) {
      setDbAvailable(false);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const openCase = async (caseId: string) => {
    setIsDetailLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}`);
      if (!res.ok) throw new Error("Failed to fetch case");
      const data: FullCase = await res.json();
      setSelectedCase(data);
    } catch (err) {
    } finally {
      setIsDetailLoading(false);
    }
  };

  const submitAction = async () => {
    if (!selectedCase || !actionText.trim()) return;
    setIsSubmittingAction(true);
    const newAction = { action: actionText.trim(), by: actionBy.trim() || "Operator" };
    try {
      const res = await fetch(`/api/cases/${selectedCase.caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newAction.action, by: newAction.by }),
      });
      if (res.ok) {
        setSelectedCase(prev => prev ? {
          ...prev,
          actionsTaken: [{ date: new Date().toISOString(), ...newAction }, ...prev.actionsTaken],
          timeline: [{ date: new Date().toISOString(), event: `Action: ${newAction.action}`, type: "action" }, ...prev.timeline]
        } : null);
        setActionText("");
        setActionBy("");
        setShowActionForm(false);
      }
    } catch (err) {
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const submitFeedback = async () => {
    if (!selectedCase || !feedbackText.trim()) return;
    setIsSubmittingFeedback(true);
    const note = feedbackText.trim();
    try {
      const res = await fetch(`/api/cases/${selectedCase.caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        setSelectedCase(prev => prev ? {
          ...prev,
          feedback: [{ date: new Date().toISOString(), note }, ...prev.feedback],
          timeline: [{ date: new Date().toISOString(), event: `Feedback: ${note.slice(0, 30)}...`, type: "update" }, ...prev.timeline]
        } : null);
        setFeedbackText("");
        setShowFeedbackForm(false);
      }
    } catch (err) {
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const downloadPDF = async () => {
    if (!selectedCase) return;
    setIsDownloading(true);
    try {
      window.location.href = `/api/cases/${selectedCase.caseId}/pdf`;
      setTimeout(() => setIsDownloading(false), 2000);
    } catch (err) {
      setIsDownloading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedCase || selectedCase.status === newStatus) return;
    const prevStatus = selectedCase.status;
    setSelectedCase(prev => prev ? { 
      ...prev, 
      status: newStatus,
      timeline: [{ date: new Date().toISOString(), event: `Status updated to ${newStatus}`, type: "update" }, ...prev.timeline]
    } : null);
    try {
      const res = await fetch(`/api/cases/${selectedCase.caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      fetchCases();
    } catch (err) {
      setSelectedCase(prev => prev ? { ...prev, status: prevStatus } : null);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.caseId.toLowerCase().includes(q) ||
      c.summary.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.originalReport?.toLowerCase().includes(q)
    );
  });

  const fmt = (d: string) => {
    try {
      return new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return d;
    }
  };

  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 animate-fade-in relative overflow-hidden font-['Poppins',sans-serif]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10">
      
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <History className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg text-white font-bold tracking-tight text-shadow-glow">Case History & Management</h3>
            <p className="text-white/50 text-xs mt-1 font-medium tracking-wide">
              {dbAvailable ? `${total} case${total !== 1 ? "s" : ""} securely stored` : "Database offline — connect MongoDB"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dbAvailable && (
            <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Database className="w-3.5 h-3.5" /> Connected
            </span>
          )}
          {!dbAvailable && (
            <span className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-[10px] font-bold text-rose-400 flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <XCircle className="w-3.5 h-3.5" /> DB Offline
            </span>
          )}
          <button onClick={fetchCases} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300" title="Refresh">
            <RefreshCw className={`w-4 h-4 text-white/70 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── DB Offline State ── */}
      {!dbAvailable && (
        <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <Database className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <p className="text-base text-white/80 font-bold mb-2 tracking-wide">MongoDB Not Connected</p>
          <p className="text-sm text-white/50 max-w-[400px] mx-auto leading-relaxed">
            Set <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 text-xs">MONGODB_URI</code> in your environment variables to enable persistent case history.
          </p>
        </div>
      )}

      {/* ── Case Detail View ── */}
      {selectedCase && (
        <div className="animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => setSelectedCase(null)}
            className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider hover:text-white transition-colors mb-6 group"
          >
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </div>
            Back to Case List
          </button>

          {/* Case header */}
          <div className="p-6 rounded-2xl bg-black/20 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-2xl drop-shadow-md">{categoryIcons[selectedCase.category] || "📋"}</span>
                  <h4 className="text-xl text-white font-extrabold tracking-tight">{selectedCase.caseId}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${statusConfig[selectedCase.status]?.bg || ""} ${statusConfig[selectedCase.status]?.border || ""} ${statusConfig[selectedCase.status]?.color || ""}`}>
                    {selectedCase.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">{selectedCase.category} <span className="mx-2 opacity-50">•</span> Created {fmt(selectedCase.createdAt)}</p>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-500/20 hover:text-purple-300 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)] self-start"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export PDF
              </button>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-sm text-white/80 leading-relaxed font-medium">{selectedCase.summary}</p>
            </div>
          </div>

          {/* Status changer */}
          <div className="flex items-center gap-3 mb-8 flex-wrap p-4 rounded-2xl bg-black/20 border border-white/5">
            <span className="text-xs text-white/40 font-bold uppercase tracking-widest mr-2">Update Status:</span>
            {["new", "in_progress", "critical", "improving", "resolved"].map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all duration-300 border ${
                  selectedCase.status === s
                    ? `${statusConfig[s]?.bg} ${statusConfig[s]?.border} ${statusConfig[s]?.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Timeline */}
              {selectedCase.timeline.length > 0 && (
                <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
                  <h5 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" /> Operational Timeline
                  </h5>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedCase.timeline.map((t, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="mt-0.5">{timelineIcon(t.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white/80 leading-relaxed">{t.event}</p>
                          <p className="text-[10px] text-white/40 font-medium mt-1 tracking-wider">{fmt(t.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original Report */}
              <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
                <h5 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" /> Initial Field Report
                </h5>
                <p className="text-xs text-white/50 leading-relaxed italic border-l-2 border-purple-500/30 pl-3">{selectedCase.originalReport}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Actions Taken */}
              <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Intervention Log
                  </h5>
                  <button
                    onClick={() => setShowActionForm(!showActionForm)}
                    className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {showActionForm && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4 space-y-3 animate-fade-in">
                    <input
                      type="text"
                      placeholder="Detail the action taken..."
                      value={actionText}
                      onChange={(e) => setActionText(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white/90 text-xs focus:outline-none focus:border-amber-500/50"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Operator ID (optional)"
                        value={actionBy}
                        onChange={(e) => setActionBy(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-xs focus:outline-none focus:border-amber-500/50 flex-1"
                      />
                      <button
                        onClick={submitAction}
                        disabled={!actionText.trim() || isSubmittingAction}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 hover:scale-[1.02] transition-transform shadow-[0_0_10px_rgba(245,158,11,0.3)] disabled:opacity-50"
                      >
                        {isSubmittingAction ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Save
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedCase.actionsTaken.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-amber-50 leading-relaxed">{a.action}</p>
                        <p className="text-[10px] text-amber-500/60 font-bold mt-1 uppercase tracking-wider">Op: {a.by} <span className="mx-1 opacity-50">•</span> {fmt(a.date)}</p>
                      </div>
                    </div>
                  ))}
                  {selectedCase.actionsTaken.length === 0 && !showActionForm && (
                    <p className="text-xs text-white/30 italic">No interventions logged.</p>
                  )}
                </div>
              </div>

              {/* Feedback */}
              <div className="p-5 rounded-2xl bg-black/20 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" /> Field Notes
                  </h5>
                  <button
                    onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                    className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors uppercase tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {showFeedbackForm && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-4 animate-fade-in">
                    <textarea
                      placeholder="Add field observation..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white/90 text-xs focus:outline-none focus:border-emerald-500/50 min-h-[80px] resize-none mb-3"
                    />
                    <button
                      onClick={submitFeedback}
                      disabled={!feedbackText.trim() || isSubmittingFeedback}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-[0_0_10px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                      {isSubmittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Save Note
                    </button>
                  </div>
                )}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedCase.feedback.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <MessageSquare className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/80 leading-relaxed">{f.note}</p>
                        <p className="text-[10px] text-white/40 font-medium mt-1 tracking-wider">{fmt(f.date)}</p>
                      </div>
                    </div>
                  ))}
                  {selectedCase.feedback.length === 0 && !showFeedbackForm && (
                    <p className="text-xs text-white/30 italic">No notes added.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Case List View ── */}
      {!selectedCase && dbAvailable && (
        <div className="animate-fade-in">
          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, keyword, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white/90 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-colors h-full"
              >
                <Filter className="w-4 h-4" />
                <span className="uppercase tracking-wider">{statusFilter ? statusFilter.replace("_", " ") : "All Status"}</span>
                <ChevronDown className="w-4 h-4 opacity-50 ml-1" />
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0b0f1a] border border-white/10 py-1.5 z-20 shadow-xl animate-fade-in">
                  {["", "new", "in_progress", "critical", "improving", "resolved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatusFilter(s); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors ${
                        statusFilter === s ? "text-cyan-400 bg-cyan-500/5" : "text-white/60"
                      }`}
                    >
                      {s ? s.replace("_", " ") : "All Cases"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredCases.length === 0 && (
            <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5">
              <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-base text-white/70 font-bold tracking-wide">No Cases Found</p>
              <p className="text-sm text-white/40 mt-1">Adjust search or clear filters.</p>
            </div>
          )}

          {/* Case list */}
          {!isLoading && filteredCases.length > 0 && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCases.map((c) => {
                const sc = statusConfig[c.status] || statusConfig.uncertain;
                return (
                  <button
                    key={c.caseId}
                    onClick={() => openCase(c.caseId)}
                    className="w-full text-left p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xl drop-shadow-md">{categoryIcons[c.category] || "📋"}</span>
                        <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors tracking-wide">
                          {c.caseId}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${sc.bg} ${sc.border} ${sc.color}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{fmt(c.createdAt)}</span>
                    </div>
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-medium pl-8">{c.summary}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
