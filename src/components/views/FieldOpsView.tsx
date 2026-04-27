"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Users, Truck, Clock, Radio, ChevronRight, Navigation, Wifi, ArrowUpRight, Locate } from "lucide-react";
import { useCountUp } from "@/lib/useCountUp";
import { VOLUNTEER_PROFILES, CRISIS_LOCATIONS, LIVE_FEED_EVENTS } from "@/lib/mockData";

const DEPLOYMENTS = [
  { id: "dep-1", team: "Alpha Response", lead: "Dr. Ananya Sharma", status: "en-route", eta: "2h 15m", destination: "Sector 7 Flood Zone", members: 6, progress: 65, gradient: "from-cyan-400 to-blue-500" },
  { id: "dep-2", team: "Bravo Medical", lead: "Dr. Chen Wei", status: "deployed", eta: "On site", destination: "Dhaka Medical Emergency", members: 8, progress: 100, gradient: "from-emerald-400 to-cyan-400" },
  { id: "dep-3", team: "Charlie Supply", lead: "Omar Yusuf", status: "staging", eta: "4h 30m", destination: "Nepal Food Distribution", members: 4, progress: 30, gradient: "from-amber-400 to-orange-500" },
  { id: "dep-4", team: "Delta Shelter", lead: "Raj Patel", status: "en-route", eta: "1h 45m", destination: "Chennai Shelter Crisis", members: 5, progress: 78, gradient: "from-blue-500 to-purple-500" },
  { id: "dep-5", team: "Echo Comms", lead: "Priya Nair", status: "deployed", eta: "On site", destination: "Colombo Communication", members: 3, progress: 100, gradient: "from-purple-500 to-pink-500" },
];

const statusColors: Record<string, string> = { "en-route": "badge-amber", deployed: "badge-emerald", staging: "badge-blue" };
const statusDotColors: Record<string, string> = { "en-route": "bg-amber-400", deployed: "bg-emerald-400", staging: "bg-blue-400" };

function CountStat({ value, label, icon: Icon, color, delay, gradient }: { value: number; label: string; icon: typeof Users; color: string; delay: number; gradient: string }) {
  const count = useCountUp(value, 1200, delay);
  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 opacity-0 animate-slide-up group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-400 relative overflow-hidden" style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.1] pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle, ${gradient}, transparent 70%)` }} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]`} style={{ backgroundColor: `${gradient}20`, borderColor: `${gradient}30` }}>
          <Icon className="w-6 h-6 text-white" style={{ filter: `drop-shadow(0 0 8px ${gradient})` }} />
        </div>
        <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
      <p className="text-3xl font-extrabold text-white tracking-tight relative z-10 text-shadow-glow">{count}</p>
      <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mt-1 relative z-10">{label}</p>
    </div>
  );
}

export default function FieldOpsView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedItems, setFeedItems] = useState(LIVE_FEED_EVENTS.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedItems((prev) => {
        const newItem = {
          ...LIVE_FEED_EVENTS[Math.floor(Math.random() * LIVE_FEED_EVENTS.length)],
          id: `live-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        return [newItem, ...prev.slice(0, 5)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="view-container font-['Poppins',sans-serif]">
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-animated opacity-20" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 opacity-0 animate-slide-up relative z-10" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
        <div>
          <h2 className="text-4xl font-bold text-white flex items-center gap-4 tracking-[-0.04em] text-shadow-glow mb-2">
            <GlobeIcon className="w-8 h-8 text-cyan-400" style={{ filter: "drop-shadow(0 0 10px rgba(6,214,242,0.5))" }} />
            Field Operations
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider ml-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Wifi className="w-3 h-3 animate-pulse" /> Live System
            </span>
          </h2>
          <p className="text-sm text-white/50 font-medium tracking-wide">Real-time deployment tracking & team coordination matrix</p>
        </div>
        <button className="mt-4 md:mt-0 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,214,242,0.3)] hover:shadow-[0_0_30px_rgba(6,214,242,0.5)] hover:scale-[1.02] transition-all duration-300">
          <Navigation className="w-4 h-4" /> Deploy Team
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <CountStat icon={Users} value={VOLUNTEER_PROFILES.length} label="Active Personnel" color="emerald" delay={100} gradient="#34d399" />
        <CountStat icon={Truck} value={DEPLOYMENTS.length} label="Active Deployments" color="cyan" delay={200} gradient="#06d6f2" />
        <CountStat icon={MapPin} value={CRISIS_LOCATIONS.length} label="Operation Zones" color="amber" delay={300} gradient="#f59e0b" />
        <CountStat icon={Radio} value={98} label="Comms Uptime %" color="purple" delay={400} gradient="#a855f7" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4 opacity-0 animate-slide-up" style={{ animationDelay: "450ms", animationFillMode: "forwards" }}>
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Locate className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Active Deployments Matrix</h3>
          </div>
          {DEPLOYMENTS.map((dep, i) => (
            <div
              key={dep.id}
              className="liquid-glass rounded-2xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5 cursor-pointer opacity-0 animate-slide-right group hover:bg-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden relative"
              style={{ animationDelay: `${500 + i * 100}ms`, animationFillMode: "forwards" }}
              onClick={() => setExpandedId(expandedId === dep.id ? null : dep.id)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className={`w-3.5 h-3.5 rounded-full ${statusDotColors[dep.status]} ${dep.status === "deployed" ? "animate-breathe" : dep.status === "en-route" ? "animate-blink-amber" : ""}`}
                      style={{ boxShadow: dep.status === "deployed" ? "0 0 12px rgba(52, 211, 153, 0.6)" : undefined }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-bold text-white tracking-wide">{dep.team}</span>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                        dep.status === 'deployed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        dep.status === 'en-route' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>{dep.status}</span>
                    </div>
                    <p className="text-[11px] text-white/50 font-medium truncate flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {dep.destination} <span className="mx-1 opacity-50">•</span> <Users className="w-3 h-3" /> Led by {dep.lead}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto">
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400/60" />
                      <span className="text-xs font-bold text-white/80">{dep.eta}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-purple-400/60" />
                      <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">{dep.members} units</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                    <ChevronRight className={`w-4 h-4 text-white/50 transition-transform duration-300 ${expandedId === dep.id ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full h-1.5 bg-black/40 rounded-full overflow-hidden relative z-10">
                <div
                  className={`h-full bg-gradient-to-r ${dep.gradient} relative`}
                  style={{ width: `${dep.progress}%`, transition: "width 1s ease-out", boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              {expandedId === dep.id && (
                <div className="mt-5 pt-4 border-t border-white/5 animate-fade-in-fast relative z-10">
                  <div className="grid grid-cols-3 gap-4 text-center mb-5 bg-black/20 rounded-xl p-4 border border-white/5">
                    <div><p className="text-xl font-extrabold text-white">{dep.progress}%</p><p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Mission Progress</p></div>
                    <div><p className="text-xl font-extrabold text-white">{dep.members}</p><p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Team Size</p></div>
                    <div><p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Active</p><p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Comms Status</p></div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> Track Route
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      <Radio className="w-3.5 h-3.5" /> Contact Team
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Feed */}
        <div className="opacity-0 animate-slide-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
          <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-white/5 pb-4">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-[0.15em]">Live Operation Log</h3>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
              {feedItems.map((item, i) => {
                const urgencyBorders: Record<string, string> = { critical: "border-l-rose-500 bg-rose-500/5", high: "border-l-amber-500 bg-amber-500/5", medium: "border-l-purple-500 bg-purple-500/5", low: "border-l-cyan-500 bg-cyan-500/5" };
                return (
                  <div
                    key={item.id + i}
                    className={`p-4 rounded-xl border-l-4 ${urgencyBorders[item.urgency]} border-y border-r border-white/5 animate-fade-in hover:bg-white/5 transition-colors`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <p className="text-[11px] text-white/80 font-medium leading-relaxed mb-2">{item.message}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded border border-white/5">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {item.location && <span className="text-[9px] font-bold text-cyan-400/70 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {item.location}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
    </svg>
  );
}
