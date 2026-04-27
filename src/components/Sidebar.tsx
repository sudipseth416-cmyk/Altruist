"use client";

import React from "react";
import {
  LayoutDashboard, Globe, Shield, BarChart3, Settings, ChevronLeft,
  Zap, Crown, AlertTriangle, Flame, Activity, Brain, Server, Radio, History, MessageSquare
} from "lucide-react";
import type { SystemHealth, CrisisLocation } from "@/lib/types";

export type ViewId = "dashboard" | "field-ops" | "risk" | "analytics" | "feedback" | "cases" | "faq" | "settings" | "volunteer-dash" | "donor-dash";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  systemHealth: SystemHealth;
  crisisLocations: CrisisLocation[];
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}



const healthStatusColor = {
  online: "bg-emerald-400",
  degraded: "bg-amber-400",
  offline: "bg-rose-400",
};

export default function Sidebar({
  collapsed, onToggle, systemHealth, crisisLocations, activeView, onNavigate,
}: SidebarProps) {
  const criticalCount = crisisLocations.filter((c) => c.urgency === "critical").length;
  const highCount = crisisLocations.filter((c) => c.urgency === "high").length;
  const activeCount = crisisLocations.filter((c) => c.status === "active").length;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
      style={{
        background: "linear-gradient(180deg, rgba(6, 8, 20, 0.99) 0%, rgba(4, 6, 14, 1) 100%)",
        borderRight: "1px solid rgba(168, 85, 247, 0.06)",
      }}
    >
      {/* Aurora glow effects behind sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-72 h-72 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #a855f7, transparent 70%)",
            animation: "aurora 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #06d6f2, transparent 70%)",
            animation: "aurora 15s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 -left-16 w-32 h-32 rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, #ec4899, transparent 70%)",
            animation: "aurora 18s ease-in-out infinite 3s",
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative flex items-center gap-3 px-5 h-[72px] border-b border-white/[0.04]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg animate-glow-pulse-multi"
          style={{
            background: "linear-gradient(135deg, #06d6f2, #a855f7, #ec4899)",
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
          }}
        >
          <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in-fast">
            <h1 className="text-base font-bold text-white tracking-tight whitespace-nowrap">
              Altruist
            </h1>
            <p className="text-2xs font-medium tracking-widest uppercase whitespace-nowrap text-gradient-purple">
              Humanitarian AI
            </p>
          </div>
        )}
      </div>

      {/* Crisis Alert Counter */}
      {!collapsed && (
        <div
          className="relative mx-3 mt-4 p-3 rounded-xl border border-rose-500/15 animate-fade-in overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(244, 63, 94, 0.06), rgba(168, 85, 247, 0.03))",
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
            </div>
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Active Crises</span>
            <span className="ml-auto text-lg font-bold text-white">{activeCount}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Flame className="w-3 h-3 text-rose-400" />
              <span className="text-[10px] text-slate-400 flex-1">Critical</span>
              <span className="text-xs font-bold text-rose-300 min-w-[20px] text-right">{criticalCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-slate-400 flex-1">High</span>
              <span className="text-xs font-bold text-amber-300 min-w-[20px] text-right">{highCount}</span>
            </div>
          </div>
        </div>
      )}

      {collapsed && (
        <div className="mx-3 mt-4 p-2 rounded-xl bg-rose-500/[0.08] border border-rose-500/15 flex flex-col items-center">
          <Flame className="w-4 h-4 text-rose-400 mb-1" />
          <span className="text-sm font-bold text-white">{activeCount}</span>
        </div>
      )}

      {/* Spacing */}
      <div className="flex-1" />

      {/* System Health */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-fade-in">
          <div className="flex items-center gap-2 mb-2.5">
            <Activity className="w-3 h-3 text-ngo-purple" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Health</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "AI Engine", status: systemHealth.aiEngine.status, value: `${systemHealth.aiEngine.latency}ms`, icon: Brain },
              { label: "Data Feed", status: systemHealth.dataIngestion.status, value: `${systemHealth.dataIngestion.throughput}%`, icon: Server },
              { label: "Matching", status: systemHealth.matchingEngine.status, value: `${systemHealth.matchingEngine.accuracy}%`, icon: Zap },
              { label: "Comms", status: systemHealth.communications.status, value: `${systemHealth.communications.uptime}%`, icon: Radio },
            ].map((h) => (
              <div key={h.label} className="flex items-center gap-2">
                <h.icon className="w-3 h-3 text-slate-600 flex-shrink-0" />
                <span className="text-[10px] text-slate-500 flex-1">{h.label}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${healthStatusColor[h.status]} animate-breathe`} />
                <span className="text-[10px] text-slate-400 font-mono w-9 text-right">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Badge */}
      {!collapsed && (
        <div
          className="mx-3 mb-3 p-3 rounded-xl border border-purple-500/10 animate-fade-in"
          style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.06), rgba(6, 214, 242, 0.03))",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-3.5 h-3.5 text-ngo-purple" />
            <span className="text-2xs font-bold uppercase tracking-wider text-gradient-purple">Pro Plan</span>
          </div>
          <p className="text-2xs text-slate-500 leading-relaxed">Full AI analysis • Unlimited reports</p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="relative p-3 border-t border-white/[0.04]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-ngo-cyan hover:bg-white/[0.03] transition-all duration-300 active:scale-95"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
