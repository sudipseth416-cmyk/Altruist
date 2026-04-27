"use client";

import React, { useState, useEffect } from "react";
import {
  Bell, Search, User, Wifi, Sparkles, Globe2, Clock,
  LayoutDashboard, Globe, Shield, BarChart3, Settings, History, MessageSquare, HelpCircle
} from "lucide-react";
import type { ViewId } from "@/components/Sidebar";

const navItems: { icon: any; label: string; id: ViewId }[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Globe, label: "Field Operations", id: "field-ops" },
  { icon: Shield, label: "Risk Monitor", id: "risk" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: MessageSquare, label: "Field Feedback", id: "feedback" },
  { icon: History, label: "Case History", id: "cases" },
  { icon: HelpCircle, label: "FAQ", id: "faq" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export default function Header({ activeView, onNavigate, userRole = 'admin', onLogout }: { activeView?: ViewId, onNavigate?: (id: ViewId) => void, userRole?: string, onLogout?: () => void }) {
  const [timeStr, setTimeStr] = useState("--:--");
  const [dateStr, setDateStr] = useState("---");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDateStr(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 h-[72px] flex items-center justify-between px-6"
      style={{
        background: "linear-gradient(180deg, rgba(4, 6, 14, 0.96) 0%, rgba(4, 6, 14, 0.85) 100%)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        borderBottom: "1px solid rgba(168, 85, 247, 0.06)",
      }}
    >


      {/* Navigation (Left Aligned) */}
      <nav className="hidden lg:flex items-center justify-start flex-1 gap-2 overflow-x-auto hide-scrollbar min-w-0" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {(userRole === 'volunteer' 
          ? [{ icon: LayoutDashboard, label: "Volunteer Portal", id: "volunteer-dash" as ViewId }]
          : userRole === 'donor'
            ? [{ icon: LayoutDashboard, label: "Impact Panel", id: "donor-dash" as ViewId }]
            : navItems
        ).map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`
                relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-300 whitespace-nowrap group
                ${isActive
                  ? "text-white shadow-sm"
                  : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                }
              `}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(6, 214, 242, 0.06), rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.04))",
              } : undefined}
            >
              <item.icon className={`w-[18px] h-[18px] transition-all duration-300 ${isActive ? "text-ngo-cyan" : "text-slate-600 group-hover:text-slate-400 group-hover:scale-110 group-hover:rotate-3"}`} />
              <span className={`transition-colors duration-300 ${isActive ? "text-gradient" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div
                  className="ml-1.5 w-1.5 h-1.5 rounded-full animate-breathe"
                  style={{
                    background: "linear-gradient(135deg, #06d6f2, #a855f7)",
                    boxShadow: "0 0 8px rgba(168, 85, 247, 0.5)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 shrink-0 ml-4">
        {/* Date Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
          <span className="text-[11px] text-slate-500 font-medium">{dateStr}</span>
        </div>

        {/* Live Feed & Time */}
        <div className="hidden sm:flex flex-col items-end justify-center gap-1">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border"
            style={{
              background: "linear-gradient(135deg, rgba(6, 214, 242, 0.06), rgba(168, 85, 247, 0.04))",
              borderColor: "rgba(168, 85, 247, 0.15)",
            }}
          >
            <Wifi className="w-3 h-3 text-ngo-cyan" />
            <span className="text-[11px] font-medium text-gradient">Live Feed</span>
          </div>
          <div className="flex items-center gap-1 pr-1 text-[10px] text-slate-400 font-medium tracking-wide">
            <Clock className="w-3 h-3 text-slate-500" />
            {timeStr}
          </div>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-ngo-dark-950 animate-breathe"
            style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
          />
        </button>

        {/* Divider */}
        <span className="w-px h-8 bg-white/[0.06] -mx-1.5" />

        {/* User Profile */}
        <button onClick={onLogout} className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border group-hover:border-purple-400/40 transition-colors duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(6, 214, 242, 0.15), rgba(168, 85, 247, 0.15))",
              borderColor: "rgba(168, 85, 247, 0.2)",
            }}
          >
            <User className="w-4 h-4 text-ngo-cyan group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-sm font-medium text-slate-300 leading-tight group-hover:text-rose-400 transition-colors">
              {userRole === 'admin' ? 'Operator' : userRole === 'volunteer' ? 'Volunteer' : 'Donor'}
            </span>
            <span className="block text-2xs text-slate-600 leading-tight group-hover:text-rose-500 transition-colors">Log Out</span>
          </div>
        </button>
      </div>
    </header>
  );
}
