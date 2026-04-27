"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Radio,
  CheckCircle2,
  Users,
  Bell,
  MapPin,
} from "lucide-react";
import type { LiveFeedEvent } from "@/lib/types";

interface LiveFeedTickerProps {
  events: LiveFeedEvent[];
}

const typeConfig = {
  crisis: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", dot: "bg-rose-400" },
  alert: { icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400" },
  update: { icon: Radio, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", dot: "bg-cyan-400" },
  volunteer: { icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  resolution: { icon: CheckCircle2, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", dot: "bg-sky-400" },
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LiveFeedTicker({ events }: LiveFeedTickerProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate new events appearing
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => Math.min(prev + 1, events.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [events.length]);

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full flex flex-col relative overflow-hidden font-['Poppins',sans-serif]">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between flex-shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.1em] text-shadow-glow">
            Live Field Feed
          </h3>
        </div>
        <span className="text-[10px] text-white/40 font-bold tracking-wider uppercase bg-white/5 px-2 py-1 rounded-full border border-white/5">
          {visibleEvents.length} events
        </span>
      </div>

      {/* Feed Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar relative z-10">
        {visibleEvents.map((event, i) => {
          const config = typeConfig[event.type] || typeConfig.update;
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className={`
                group relative flex items-start gap-4 p-4 rounded-2xl
                ${config.bg} border ${config.border}
                transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                animate-fade-in hover:-translate-y-0.5 hover:bg-white/10
              `}
              style={{ animationDelay: `${i * 80}ms`, boxShadow: `inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.1)` }}
            >
              <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 border border-white/5 group-hover:scale-110 transition-transform shadow-[0_0_15px_currentColor] ${config.color}`} style={{ color: config.color.replace('text-', '') }}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 leading-relaxed font-medium mb-2 group-hover:text-white transition-colors">
                  {event.message}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] text-white/40 font-semibold bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
                    {mounted ? timeAgo(event.timestamp) : "—"}
                  </span>
                  {event.location && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-[10px] text-white/50 flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full border border-white/5">
                        <MapPin className="w-3 h-3 text-cyan-500/70" />
                        {event.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
