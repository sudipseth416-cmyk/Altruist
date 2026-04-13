"use client";

import React from "react";
import {
  Bell,
  Search,
  User,
  Wifi,
  Sparkles,
  Globe2,
  Clock,
} from "lucide-react";

export default function Header() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <header
      className="sticky top-0 z-40 h-[72px] flex items-center justify-between px-6"
      style={{
        background: "linear-gradient(180deg, rgba(6, 10, 20, 0.95) 0%, rgba(6, 10, 20, 0.8) 100%)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: Title + Status */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Command Center
            <Sparkles className="w-4 h-4 text-ngo-accent/60 animate-breathe" />
          </h2>
          <div className="flex items-center gap-2.5 mt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngo-accent opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ngo-accent"></span>
              </span>
              <span className="text-xs text-ngo-accent font-medium">Online</span>
            </div>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              South Asia
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeStr}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center max-w-md w-full mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-ngo-accent transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search operations, reports, datasets..."
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Date Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
          <span className="text-[11px] text-slate-500 font-medium">{dateStr}</span>
        </div>

        {/* Live Feed */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ngo-accent/[0.06] border border-ngo-accent/15">
          <Wifi className="w-3.5 h-3.5 text-ngo-accent" />
          <span className="text-xs font-medium text-ngo-accent-light">
            Live Feed
          </span>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-300"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-ngo-rose rounded-full ring-2 ring-ngo-dark-950 animate-breathe" />
        </button>

        {/* Divider */}
        <span className="w-px h-8 bg-white/[0.06] mx-0.5" />

        {/* User Profile */}
        <button className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ngo-accent/25 to-ngo-cyan/25 flex items-center justify-center border border-ngo-accent/20 group-hover:border-ngo-accent/40 transition-colors duration-300">
            <User className="w-4 h-4 text-ngo-accent-light" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-sm font-medium text-slate-300 leading-tight">
              Operator
            </span>
            <span className="block text-2xs text-slate-600 leading-tight">
              Admin
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
