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

  // Simulate new events appearing
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => Math.min(prev + 1, events.length));
    }, 8000);
    return () => clearInterval(interval);
  }, [events.length]);

  const visibleEvents = events.slice(0, visibleCount);

  return (
    <div className="glass-card h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngo-rose opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ngo-rose" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Feed
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 font-medium">
          {visibleEvents.length} events
        </span>
      </div>

      {/* Feed Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
        {visibleEvents.map((event, i) => {
          const config = typeConfig[event.type] || typeConfig.update;
          const Icon = config.icon;

          return (
            <div
              key={event.id}
              className={`
                flex items-start gap-2.5 p-2.5 rounded-xl
                ${config.bg} border ${config.border}
                transition-all duration-300
                animate-fade-in
              `}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`mt-0.5 flex-shrink-0 ${config.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {event.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-slate-500 font-medium">
                    {timeAgo(event.timestamp)}
                  </span>
                  {event.location && (
                    <>
                      <span className="text-slate-700">•</span>
                      <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
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
