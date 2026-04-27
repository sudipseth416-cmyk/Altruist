"use client";

import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, Flame, Eye, TrendingUp, Activity, ChevronDown, Target } from "lucide-react";
import { useCountUp } from "@/lib/useCountUp";

const RISK_ALERTS = [
  { id: "r1", title: "Flood Escalation — Bihar Sector 7", level: "critical" as const, probability: 92, region: "South Asia", description: "Water levels rising 15cm/hr. Dam overflow imminent. 1,200+ civilians in danger zone.", mitigation: "Immediate evacuation of zones A3-A7. Deploy water barriers.", time: "3 min ago" },
  { id: "r2", title: "Hospital Capacity — Dhaka Central", level: "critical" as const, probability: 88, region: "South Asia", description: "ICU at 97% capacity. Medical supply chain disrupted. 14 critical patients awaiting transfer.", mitigation: "Activate overflow protocol. Request MSF reinforcement.", time: "12 min ago" },
  { id: "r3", title: "Cyclone Track Deviation — Bay of Bengal", level: "warning" as const, probability: 74, region: "South Asia", description: "Category 3 cyclone shifted 40km south. Chennai coastline now in direct path. 48h window.", mitigation: "Update evacuation routes. Pre-position supplies at inland shelters.", time: "28 min ago" },
  { id: "r4", title: "Supply Route Compromise — NH48", level: "warning" as const, probability: 61, region: "South Asia", description: "Bridge integrity compromised by flooding. Aid convoy reroute required.", mitigation: "Activate alternate route via SH-17. Coordinate with local authorities.", time: "1h ago" },
  { id: "r5", title: "Communication Degradation — Eastern Sector", level: "info" as const, probability: 45, region: "South Asia", description: "Satellite uplink intermittent. Field teams reporting 30% packet loss.", mitigation: "Switch to backup HF frequency. Deploy portable relay station.", time: "2h ago" },
  { id: "r6", title: "Personnel Fatigue Index — Alpha Team", level: "info" as const, probability: 38, region: "South Asia", description: "Team operating for 18+ continuous hours. Performance degradation expected.", mitigation: "Rotate shift. Deploy Bravo standby team.", time: "3h ago" },
];

const THREAT_ZONES = [
  { name: "Bihar", level: 95, gradient: "from-rose-500 via-pink-500 to-red-600" },
  { name: "Dhaka", level: 88, gradient: "from-rose-500 via-orange-500 to-pink-500" },
  { name: "Chennai", level: 72, gradient: "from-amber-500 via-orange-400 to-pink-400" },
  { name: "Kathmandu", level: 56, gradient: "from-amber-400 via-yellow-400 to-orange-400" },
  { name: "Mumbai", level: 44, gradient: "from-blue-500 via-purple-400 to-cyan-400" },
  { name: "Colombo", level: 31, gradient: "from-emerald-500 via-teal-400 to-cyan-400" },
];

const levelStyles = {
  critical: { border: "border-rose-500/30", bg: "rgba(244, 63, 94, 0.05)", text: "text-rose-400", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20", anim: "animate-blink-critical", dotBg: "bg-rose-500" },
  warning: { border: "border-amber-500/30", bg: "rgba(245, 158, 11, 0.05)", text: "text-amber-400", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", anim: "animate-blink-amber", dotBg: "bg-amber-400" },
  info: { border: "border-blue-500/20", bg: "rgba(59, 130, 246, 0.05)", text: "text-blue-400", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", anim: "", dotBg: "bg-blue-400" },
};

export default function RiskMonitorView() {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const criticalCount = useCountUp(2, 1000, 100);
  const warningCount = useCountUp(2, 1000, 200);
  const infoCount = useCountUp(2, 1000, 300);
  const overallRisk = useCountUp(78, 1500, 400);

  const [radarAngle, setRadarAngle] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setRadarAngle((a) => (a + 2) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="view-container font-['Poppins',sans-serif]">
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-animated opacity-20" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 opacity-0 animate-slide-up relative z-10" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
        <div>
          <h2 className="text-4xl font-bold text-white flex items-center gap-4 tracking-[-0.04em] text-shadow-glow mb-2">
            <Shield className="w-8 h-8 text-rose-500" style={{ filter: "drop-shadow(0 0 10px rgba(244,63,94,0.5))" }} />
            Risk Monitor
            <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-[10px] font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider ml-2 shadow-[0_0_15px_rgba(244,63,94,0.2)] animate-pulse">
              <Flame className="w-3 h-3" /> 2 Critical
            </span>
          </h2>
          <p className="text-sm text-white/50 font-medium tracking-wide">Tactical threat assessment & early warning system matrix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 relative z-10">
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Overall Risk", value: overallRisk, suffix: "%", color: "rose", icon: Target, gradient: "#f43f5e" },
            { label: "Critical", value: criticalCount, suffix: "", color: "rose", icon: Flame, gradient: "#ec4899" },
            { label: "Warning", value: warningCount, suffix: "", color: "amber", icon: AlertTriangle, gradient: "#f59e0b" },
            { label: "Advisory", value: infoCount, suffix: "", color: "blue", icon: Eye, gradient: "#3b82f6" },
          ].map((s, i) => (
            <div key={s.label} className={`liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 opacity-0 animate-slide-up group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-400 relative overflow-hidden`} style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: "forwards" }}>
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.1] pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle, ${s.gradient}, transparent 70%)` }} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`} style={{ backgroundColor: `${s.gradient}20`, borderColor: `${s.gradient}30` }}>
                <s.icon className={`w-5 h-5 text-white`} style={{ filter: `drop-shadow(0 0 8px ${s.gradient})` }} />
              </div>
              <p className="text-3xl font-extrabold text-white tracking-tight relative z-10 text-shadow-glow">{s.value}{s.suffix}</p>
              <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mt-1 relative z-10">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Multi-Color Radar */}
        <div className="lg:col-span-2 liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 flex flex-col items-center justify-center opacity-0 animate-scale-in relative overflow-hidden" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          <div className="relative w-48 h-48 rounded-full border border-white/5 z-10" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.05), rgba(4, 6, 14, 0.8))" }}>
            <div className="absolute inset-4 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-12 rounded-full border border-white/5" />
            <div className="absolute inset-16 rounded-full border border-white/5" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(135deg, #06d6f2, #a855f7)", boxShadow: "0 0 15px rgba(168, 85, 247, 0.8)" }} />
            <div
              className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
              style={{
                transform: `rotate(${radarAngle}deg)`,
                background: "linear-gradient(90deg, rgba(6, 214, 242, 0.8), rgba(168, 85, 247, 0.4), transparent)",
                filter: "blur(0.5px)",
                boxShadow: "0 0 15px rgba(6, 214, 242, 0.4)",
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left opacity-[0.1]"
              style={{
                transform: `rotate(${radarAngle}deg)`,
                background: "conic-gradient(from 0deg, rgba(168, 85, 247, 0.6), transparent 40deg)",
              }}
            />
            <div className="absolute top-[15%] left-[60%] w-3 h-3 rounded-full bg-rose-500 animate-blink-critical" style={{ boxShadow: "0 0 12px rgba(244, 63, 94, 0.8)" }} />
            <div className="absolute top-[35%] left-[20%] w-2.5 h-2.5 rounded-full bg-rose-500 animate-blink-critical" style={{ boxShadow: "0 0 12px rgba(244, 63, 94, 0.8)" }} />
            <div className="absolute top-[65%] left-[75%] w-2 h-2 rounded-full bg-amber-400 animate-blink-amber" style={{ boxShadow: "0 0 8px rgba(245, 158, 11, 0.6)" }} />
            <div className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full bg-blue-400 animate-breathe" style={{ boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)" }} />
          </div>
          <p className="text-[10px] text-white/50 mt-5 font-bold uppercase tracking-[0.2em] relative z-10">Threat Radar <span className="mx-2 opacity-30">•</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Live</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        {/* Heatmap Bars */}
        <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 opacity-0 animate-slide-up relative overflow-hidden" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[40px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">Threat Index by Region</h3>
          </div>
          <div className="space-y-5 relative z-10">
            {THREAT_ZONES.map((zone, i) => (
              <div key={zone.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{zone.name}</span>
                  <span className={`text-[11px] font-bold ${zone.level > 70 ? "text-rose-400" : zone.level > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                    {zone.level}%
                  </span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full bg-gradient-to-r ${zone.gradient} relative`}
                    style={{ width: `${zone.level}%`, transition: "width 1s ease-out", boxShadow: "0 0 10px rgba(255,255,255,0.2)" }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Cards */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-4 opacity-0 animate-slide-up" style={{ animationDelay: "550ms", animationFillMode: "forwards" }}>
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Active Alerts Log</h3>
          </div>
          {RISK_ALERTS.map((alert, i) => {
            const style = levelStyles[alert.level];
            const isExpanded = expandedAlert === alert.id;
            return (
              <div
                key={alert.id}
                className={`liquid-glass rounded-2xl border ${style.border} p-5 cursor-pointer opacity-0 animate-slide-left hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group`}
                style={{ animationDelay: `${600 + i * 80}ms`, animationFillMode: "forwards", background: style.bg }}
                onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-[40px] rounded-full pointer-events-none group-hover:opacity-40 transition-opacity" style={{ backgroundColor: style.text.replace('text-', '') }} />
                <div className="flex sm:items-center gap-4 relative z-10 flex-col sm:flex-row">
                  <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${style.dotBg} ${style.anim}`} style={{ boxShadow: alert.level === "critical" ? "0 0 12px rgba(244, 63, 94, 0.6)" : undefined }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="text-base font-bold text-white tracking-wide">{alert.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${style.badge}`}>{alert.level}</span>
                    </div>
                    <p className="text-[11px] text-white/50 font-medium">{alert.region} <span className="mx-1 opacity-50">•</span> {alert.time}</p>
                  </div>
                  <div className="text-right flex-shrink-0 flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0 mt-2 sm:mt-0">
                    <div className="text-center sm:text-right">
                      <p className={`text-xl font-extrabold text-shadow-glow ${style.text}`}>{alert.probability}%</p>
                      <p className="text-[9px] text-white/40 uppercase tracking-wider font-bold mt-0.5">Probability</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors hidden sm:flex mt-2">
                      <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-white/10 animate-fade-in-fast space-y-4 relative z-10">
                    <p className="text-sm text-white/70 leading-relaxed font-medium">{alert.description}</p>
                    <div className="p-4 rounded-xl border border-white/10 bg-black/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Recommended Mitigation</p>
                      <p className="text-xs text-white/90 leading-relaxed font-semibold">{alert.mitigation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
