"use client";

import React, { useState, useEffect } from "react";
import {
  Activity, AlertTriangle, Users, Zap, MapPin, TrendingUp, Shield,
  CheckCircle2, Clock, BarChart3, Target, Server
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import type { CaseEngineResult } from "@/lib/case-engine-types";

interface ImpactPanelProps {
  result: CaseEngineResult | null;
  totalDecisions: number;
}

/* ─── Animated Counter ─── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{display.toLocaleString()}{suffix}</>;
}

export default function ImpactPanel({ result, totalDecisions }: ImpactPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalIssues = result?.issues.length ?? 0;
  const actionsTaken = result?.recommended_actions.length ?? 0;
  const riskScore = result?.risk_analysis.risk_score ?? 0;
  const confidence = Math.max(0, 100 - riskScore + 15); // mock confidence

  const trendData = [
    { time: '-4h', risk: Math.max(0, riskScore - 20) },
    { time: '-3h', risk: Math.max(0, riskScore - 10) },
    { time: '-2h', risk: Math.max(0, riskScore + 5) },
    { time: '-1h', risk: Math.max(0, riskScore - 5) },
    { time: 'Now', risk: riskScore },
  ];

  const severityData = [
    { name: 'Critical', value: result?.risk_analysis.severity === "Critical" ? 4 : 1, color: '#fb7185' },
    { name: 'High', value: result?.risk_analysis.severity === "High" ? 3 : 2, color: '#fbbf24' },
    { name: 'Medium', value: result?.risk_analysis.severity === "Medium" ? 2 : 1, color: '#facc15' },
    { name: 'Low', value: result?.risk_analysis.severity === "Low" ? 1 : 0, color: '#38bdf8' },
  ];

  if (!result) {
    return (
      <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 animate-fade-in animate-delay-500 flex flex-col items-center justify-center min-h-[400px] font-['Poppins',sans-serif]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] animate-pulse">
          <BarChart3 className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-lg font-bold text-white/50 mb-2 uppercase tracking-[0.2em]">
          Analytics Engine Offline
        </h3>
        <p className="text-sm text-white/30 text-center max-w-[250px]">
          Ingest intelligence data to initialize live tracking matrices
        </p>
      </div>
    );
  }

  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 animate-fade-in animate-delay-500 font-['Poppins',sans-serif] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg text-white font-bold tracking-tight flex items-center gap-2 text-shadow-glow">
              Impact Analytics
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </h3>
            <p className="text-white/50 text-xs mt-1 font-medium tracking-wide">
              Live humanitarian metrics & risk tracking
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      {/* ═══ Hero Metrics Row ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 relative z-10">
        
        {/* Total Issues */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-black/20 border border-white/5 group hover:bg-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-rose-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
              +{totalIssues} NEW
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight mb-1 drop-shadow-lg relative z-10">
            {mounted ? <AnimatedNumber value={totalIssues} /> : totalIssues}
          </p>
          <p className="text-xs text-white/50 font-semibold uppercase tracking-wider relative z-10">Active Issues</p>
        </div>

        {/* Risk Score */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-black/20 border border-white/5 group hover:bg-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${riskScore >= 75 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
              {result.risk_analysis.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight mb-1 drop-shadow-lg relative z-10">
            {mounted ? <AnimatedNumber value={riskScore} /> : riskScore}<span className="text-lg text-white/30 ml-1">/100</span>
          </p>
          <p className="text-xs text-white/50 font-semibold uppercase tracking-wider relative z-10">Overall Risk Score</p>
        </div>

        {/* AI Confidence */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-black/20 border border-white/5 group hover:bg-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
              OPTIMAL
            </span>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight mb-1 drop-shadow-lg relative z-10">
            {mounted ? <AnimatedNumber value={confidence} /> : confidence}<span className="text-lg text-white/30 ml-1">%</span>
          </p>
          <p className="text-xs text-white/50 font-semibold uppercase tracking-wider relative z-10">AI Confidence Level</p>
        </div>

      </div>

      {/* ═══ Charts Section ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* Risk Trend Line Chart */}
        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">
              Historical Risk Trend
            </h4>
            <span className="text-xs font-medium text-rose-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</span>
          </div>
          <div className="flex-1 min-h-[160px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="risk" stroke="#fb7185" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Severity Breakdown Bar Chart */}
        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest">
              Issue Severity Distribution
            </h4>
          </div>
          <div className="flex-1 min-h-[160px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
