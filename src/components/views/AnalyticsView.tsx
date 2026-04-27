"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Globe2, ChevronDown, ArrowUpRight, Layers, Calendar, Download, Sparkles } from "lucide-react";
import { useCountUp } from "@/lib/useCountUp";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const MONTHLY_DATA = [
  { month: "Jan", ops: 18, resolved: 15 }, { month: "Feb", ops: 22, resolved: 19 },
  { month: "Mar", ops: 31, resolved: 27 }, { month: "Apr", ops: 28, resolved: 25 },
  { month: "May", ops: 35, resolved: 30 }, { month: "Jun", ops: 42, resolved: 38 },
  { month: "Jul", ops: 38, resolved: 35 }, { month: "Aug", ops: 45, resolved: 41 },
  { month: "Sep", ops: 40, resolved: 37 }, { month: "Oct", ops: 48, resolved: 44 },
  { month: "Nov", ops: 52, resolved: 49 }, { month: "Dec", ops: 24, resolved: 22 },
];

const CATEGORY_DATA = [
  { name: "Medical/Health", value: 32, color: "#ec4899" },
  { name: "Water/Sanitation", value: 24, color: "#06d6f2" },
  { name: "Food Security", value: 18, color: "#f59e0b" },
  { name: "Shelter", value: 14, color: "#a855f7" },
  { name: "Logistics", value: 8, color: "#3b82f6" },
  { name: "Protection", value: 4, color: "#34d399" },
];

const REGION_STATS = [
  { region: "South Asia", ops: 156, resolved: 142, rate: 91 },
  { region: "East Africa", ops: 89, resolved: 78, rate: 88 },
  { region: "Southeast Asia", ops: 67, resolved: 61, rate: 91 },
  { region: "Middle East", ops: 45, resolved: 38, rate: 84 },
  { region: "Central America", ops: 34, resolved: 30, rate: 88 },
];

const INSIGHTS = [
  { title: "Response Time Improvement", detail: "Average response time decreased 22% over the last quarter, from 2.1h to 1.6h. AI-driven routing contributed to 67% of this improvement.", trend: "+22%", positive: true },
  { title: "Resource Utilization Efficiency", detail: "Volunteer matching accuracy improved to 97.3%. Cross-skill deployment reduced idle time by 31%.", trend: "+31%", positive: true },
  { title: "Crisis Prediction Accuracy", detail: "Early warning system correctly predicted 4 of 5 major events in the past 60 days. False positive rate reduced to 12%.", trend: "80%", positive: true },
  { title: "Supply Chain Bottleneck", detail: "3 recurring logistics delays identified on NH-48 corridor. Recommending permanent alternate route activation.", trend: "-15%", positive: false },
];

export default function AnalyticsView() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("12M");
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  
  const totalOps = useCountUp(423, 1500, 200);
  const resolved = useCountUp(391, 1500, 300);
  const avgResponse = useCountUp(16, 1200, 400);
  const efficiency = useCountUp(97, 1200, 500);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="view-container font-['Poppins',sans-serif]">
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-animated opacity-20" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 opacity-0 animate-slide-up relative z-10" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
        <div>
          <h2 className="text-4xl font-bold text-white flex items-center gap-4 tracking-[-0.04em] text-shadow-glow mb-2">
            <BarChart3 className="w-8 h-8 text-purple-500" style={{ filter: "drop-shadow(0 0 10px rgba(168,85,247,0.5))" }} />
            Analytics Center
          </h2>
          <p className="text-sm text-white/50 font-medium tracking-wide">Performance metrics & operational intelligence matrix</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 bg-black/40 p-1.5 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {["7D", "30D", "12M", "ALL"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeFilter === f
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
          <button className="flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Rolling Counters — Multi-Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        {[
          { value: totalOps, label: "Total Operations", suffix: "", icon: Layers, color: "purple", gradient: "#a855f7" },
          { value: resolved, label: "Resolved", suffix: "", icon: TrendingUp, color: "emerald", gradient: "#34d399" },
          { value: avgResponse, label: "Avg Response (min)", suffix: "m", icon: Calendar, color: "cyan", gradient: "#06d6f2" },
          { value: efficiency, label: "AI Accuracy", suffix: "%", icon: PieChartIcon, color: "amber", gradient: "#f59e0b" },
        ].map((s, i) => (
          <div key={s.label} className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 opacity-0 animate-slide-up group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-400 relative overflow-hidden" style={{ animationDelay: `${100 + i * 80}ms`, animationFillMode: "forwards" }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.1] pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle, ${s.gradient}, transparent 70%)` }} />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`} style={{ backgroundColor: `${s.gradient}20`, borderColor: `${s.gradient}30` }}>
                <s.icon className={`w-5 h-5 text-white`} style={{ filter: `drop-shadow(0 0 8px ${s.gradient})` }} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight relative z-10 text-shadow-glow">{s.value.toLocaleString()}{s.suffix}</p>
            <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mt-1 relative z-10">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8 relative z-10">
        
        {/* Operations Area Chart */}
        <div className="xl:col-span-2 liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 flex flex-col opacity-0 animate-slide-up relative overflow-hidden" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-sm font-bold text-white/70 flex items-center gap-2 uppercase tracking-widest">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Operations Overview
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#06d6f2]" style={{ background: "#06d6f2" }} /><span className="text-[10px] font-bold text-white/60 uppercase">Operations</span></div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_#34d399]" style={{ background: "#34d399" }} /><span className="text-[10px] font-bold text-white/60 uppercase">Resolved</span></div>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] relative z-10">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06d6f2" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06d6f2" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                  <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'}} itemStyle={{fontWeight: 'bold'}} />
                  <Area type="monotone" dataKey="ops" stroke="#06d6f2" fillOpacity={1} fill="url(#colorOps)" strokeWidth={3} />
                  <Area type="monotone" dataKey="resolved" stroke="#34d399" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 flex flex-col opacity-0 animate-slide-up relative overflow-hidden" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/5 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-white/70 flex items-center gap-2 mb-2 uppercase tracking-widest relative z-10">
            <PieChartIcon className="w-4 h-4 text-pink-500" /> By Category
          </h3>
          <div className="flex-1 min-h-[200px] relative z-10 flex items-center justify-center">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} itemStyle={{fontWeight: 'bold', color: '#fff'}} />
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{filter: `drop-shadow(0 0 8px ${entry.color}80)`}} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 relative z-10">
            {CATEGORY_DATA.slice(0,4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: cat.color}} />
                  <span className="text-white/60 font-medium truncate">{cat.name}</span>
                </div>
                <span className="text-white font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Region Table + Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
        
        {/* Regional Performance */}
        <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 opacity-0 animate-slide-up relative overflow-hidden" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none" />
          <h3 className="text-sm font-bold text-white/70 flex items-center gap-2 mb-6 uppercase tracking-widest relative z-10">
            <Globe2 className="w-4 h-4 text-blue-500" /> Regional Performance
          </h3>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[10px] text-white/40 font-bold uppercase tracking-widest pb-3">Region</th>
                  <th className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest pb-3">Ops</th>
                  <th className="text-center text-[10px] text-white/40 font-bold uppercase tracking-widest pb-3">Resolved</th>
                  <th className="text-right text-[10px] text-white/40 font-bold uppercase tracking-widest pb-3">Rate</th>
                </tr>
              </thead>
              <tbody>
                {REGION_STATS.map((r) => (
                  <tr key={r.region} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 text-xs text-white/80 font-bold tracking-wide">{r.region}</td>
                    <td className="py-4 text-xs text-center text-white/60 font-semibold">{r.ops}</td>
                    <td className="py-4 text-xs text-center text-white/60 font-semibold">{r.resolved}</td>
                    <td className="py-4 text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        r.rate >= 90 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                        r.rate >= 85 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                        "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>{r.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-bold text-white/70 flex items-center gap-2 mb-4 uppercase tracking-widest px-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> AI Intelligence Insights
          </h3>
          {INSIGHTS.map((insight, i) => (
            <div
              key={i}
              className="liquid-glass rounded-2xl border border-white/5 p-5 cursor-pointer group hover:bg-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden relative"
              onClick={() => setExpandedInsight(expandedInsight === i ? null : i)}
            >
              <div className="flex sm:items-center gap-4 flex-col sm:flex-row relative z-10">
                <div
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex-shrink-0 self-start sm:self-auto ${
                    insight.positive
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                  }`}
                >{insight.trend}</div>
                <span className="text-sm font-bold text-white flex-1 tracking-wide">{insight.title}</span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors absolute right-0 top-0 sm:relative">
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform duration-300 ${expandedInsight === i ? "rotate-180" : ""}`} />
                </div>
              </div>
              {expandedInsight === i && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in-fast relative z-10">
                  <p className="text-xs text-white/70 leading-relaxed font-medium">{insight.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
