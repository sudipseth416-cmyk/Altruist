"use client";

import React from "react";
import {
  LayoutDashboard,
  Globe,
  Shield,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Zap,
  Crown,
  AlertTriangle,
  Flame,
  Activity,
  Wifi,
  Server,
  Brain,
  Radio,
} from "lucide-react";
import type { SystemHealth, CrisisLocation } from "@/lib/types";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  systemHealth: SystemHealth;
  crisisLocations: CrisisLocation[];
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Globe, label: "Field Operations", active: false },
  { icon: Shield, label: "Risk Monitor", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
  { icon: HelpCircle, label: "Support", active: false },
];

const healthStatusColor = {
  online: "bg-emerald-400",
  degraded: "bg-amber-400",
  offline: "bg-rose-400",
};

export default function Sidebar({
  collapsed,
  onToggle,
  systemHealth,
  crisisLocations,
}: SidebarProps) {
  const criticalCount = crisisLocations.filter((c) => c.urgency === "critical").length;
  const highCount = crisisLocations.filter((c) => c.urgency === "high").length;
  const activeCount = crisisLocations.filter((c) => c.status === "active").length;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgba(10, 16, 32, 0.98) 0%, rgba(6, 10, 20, 0.99) 100%)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-white/[0.04]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ngo-accent via-emerald-400 to-ngo-cyan flex items-center justify-center flex-shrink-0 shadow-lg shadow-ngo-accent/25 animate-pulse-glow">
          <Zap className="w-5 h-5 text-ngo-dark-950" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in-fast">
            <h1 className="text-base font-bold text-white tracking-tight whitespace-nowrap">
              NGO OS
            </h1>
            <p className="text-2xs text-slate-500 font-medium tracking-widest uppercase whitespace-nowrap">
              Humanitarian AI
            </p>
          </div>
        )}
      </div>

      {/* Crisis Alert Counter */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-gradient-to-br from-rose-500/[0.08] to-amber-500/[0.04] border border-rose-500/15 animate-fade-in">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
            </div>
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
              Active Crises
            </span>
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-3 text-2xs font-semibold text-slate-600 uppercase tracking-widest">
            Operations
          </p>
        )}
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`
              relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-300 group
              ${
                item.active
                  ? "bg-ngo-accent/[0.08] text-ngo-accent shadow-sm shadow-ngo-accent/5"
                  : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
              }
            `}
          >
            {item.active && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-ngo-accent shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              />
            )}
            <item.icon
              className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-300 ${
                item.active
                  ? "text-ngo-accent"
                  : "text-slate-600 group-hover:text-slate-400"
              }`}
            />
            {!collapsed && (
              <span className="whitespace-nowrap transition-colors duration-300">
                {item.label}
              </span>
            )}
            {item.active && !collapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ngo-accent shadow-lg shadow-ngo-accent/50 animate-breathe" />
            )}
          </button>
        ))}
      </nav>

      {/* System Health */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-fade-in">
          <div className="flex items-center gap-2 mb-2.5">
            <Activity className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              System Health
            </span>
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
                <div className={`w-1.5 h-1.5 rounded-full ${healthStatusColor[h.status]}`} />
                <span className="text-[10px] text-slate-400 font-mono w-9 text-right">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-ngo-accent/[0.06] to-ngo-cyan/[0.03] border border-ngo-accent/10 animate-fade-in">
          <div className="flex items-center gap-2 mb-1.5">
            <Crown className="w-3.5 h-3.5 text-ngo-accent" />
            <span className="text-2xs font-bold text-ngo-accent uppercase tracking-wider">
              Pro Plan
            </span>
          </div>
          <p className="text-2xs text-slate-500 leading-relaxed">
            Full AI analysis • Unlimited reports
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.04]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] transition-all duration-300"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-400 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
