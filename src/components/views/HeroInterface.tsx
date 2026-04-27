"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Activity, 
  ShieldAlert, 
  ClipboardCheck, 
  Globe2, 
  HeartHandshake, 
  BarChart3, 
  Menu,
  Clock,
  TrendingUp
} from 'lucide-react';

interface HeroInterfaceProps {
  userRole: string;
  onContinue: () => void;
  user: any;
  onLogout: () => void;
}

export default function HeroInterface({ userRole, onContinue, user, onLogout }: HeroInterfaceProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const config = {
    admin: {
      heading: "Command the response with intelligence",
      cta: "Open Command Center",
      pills: ["Risk Monitoring", "Analytics", "Case Control"],
      info: "System Active — 3 new reports in last hour",
      features: [
        { name: "System Efficiency", icon: <Activity />, value: 92, unit: "%", color: "from-cyan-400 to-blue-500", glow: "rgba(6,214,242,0.4)", trend: "+18% efficiency", data: [40, 55, 60, 85, 80, 92] },
        { name: "Critical Risks", icon: <ShieldAlert />, value: 4, unit: " Active", color: "from-rose-400 to-red-500", glow: "rgba(244,63,94,0.4)", trend: "-2 since yesterday", data: [12, 10, 8, 9, 6, 4] }
      ]
    },
    volunteer: {
      heading: "Act where it matters most",
      cta: "View Assigned Tasks",
      pills: ["Assigned Reports", "Status Updates", "Field Actions"],
      info: "You have 3 active high-priority assignments",
      features: [
        { name: "Task Completion", icon: <ClipboardCheck />, value: 85, unit: "%", color: "from-emerald-400 to-green-500", glow: "rgba(16,185,129,0.4)", trend: "+12% this week", data: [40, 50, 65, 70, 80, 85] },
        { name: "Field Reports", icon: <Globe2 />, value: 14, unit: " Logged", color: "from-purple-400 to-indigo-500", glow: "rgba(168,85,247,0.4)", trend: "3 pending review", data: [2, 5, 4, 8, 12, 14] }
      ]
    },
    donor: {
      heading: "Fuel impact. See change happen.",
      cta: "View Your Impact",
      pills: ["Donations", "Impact Tracking", "History"],
      info: "Your contributions directly impacted 245 lives",
      features: [
        { name: "Fund Utilization", icon: <HeartHandshake />, value: 98, unit: "%", color: "from-pink-400 to-rose-500", glow: "rgba(236,72,153,0.4)", trend: "Fully allocated", data: [70, 80, 85, 90, 96, 98] },
        { name: "Active Projects", icon: <BarChart3 />, value: 6, unit: " Supported", color: "from-amber-400 to-orange-500", glow: "rgba(245,158,11,0.4)", trend: "2 wrapping up", data: [2, 3, 3, 4, 5, 6] }
      ]
    }
  };

  const currentConfig = config[userRole as keyof typeof config] || config.admin;

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row font-['Poppins',sans-serif] bg-[#04060e] text-white overflow-hidden">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute min-w-full min-h-full object-cover opacity-40 mix-blend-screen"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-network-of-data-connections-in-a-dark-space-2621-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060e] via-[#04060e]/80 to-transparent"></div>
      </div>

      {/* LEFT PANEL */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full md:w-[52%] h-full flex flex-col p-8 md:p-16 justify-between"
      >
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="liquid-glass rounded-2xl p-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 z-0"></div>
              <Globe2 className="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform" />
            </motion.div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">ALTRUIST</h1>
              <p className="text-xs text-white/50 uppercase tracking-[0.2em] font-medium mt-0.5">{userRole}</p>
            </div>
          </div>
          <button className="liquid-glass p-3 rounded-full hover:scale-110 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Center Hero Content */}
        <div className="max-w-2xl mt-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-[-0.03em] text-white/70 mb-10 text-shadow-glow"
          >
            {currentConfig.heading.split(' ').map((word, i) => {
              const emphasis = ['intelligence', 'most', 'happen.'];
              const isEmphasis = emphasis.includes(word.toLowerCase()) || emphasis.includes(word.replace('.', '').toLowerCase());
              if (isEmphasis) {
                return (
                  <span key={i} className="font-['Source_Serif_4',serif] italic font-light text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    {' '}{word}
                  </span>
                );
              }
              return <span key={i}> {word}</span>;
            })}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            {currentConfig.pills.map((pill, idx) => (
              <span key={idx} className="liquid-glass px-6 py-2.5 rounded-full text-sm font-medium text-white/90 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-white/5 transition-colors cursor-default">
                {pill}
              </span>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            onClick={onContinue}
            className="liquid-glass-strong group relative flex items-center gap-5 px-10 py-4 rounded-full text-lg font-medium hover:scale-[1.02] transition-all duration-400 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <span className="relative z-10 tracking-wide text-white/95">{currentConfig.cta}</span>
            <div className="relative z-10 bg-white/10 p-2.5 rounded-full group-hover:bg-white/25 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        </div>

        {/* Bottom Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 md:mt-0 flex items-center gap-3 text-white/60"
        >
          <Clock className="w-4 h-4" />
          <p className="text-sm">Every second matters in crisis response.</p>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="relative z-10 w-full md:w-[48%] h-full p-8 md:p-16 flex flex-col justify-between border-l border-white/5 bg-black/20 backdrop-blur-[2px]"
      >
        {/* Top Bar */}
        <div className="flex justify-end gap-4">
          <button onClick={onLogout} className="liquid-glass px-6 py-2 rounded-full text-sm hover:bg-white/5 transition-colors">
            Sign Out
          </button>
        </div>

        {/* Dynamic Info Cards & Charts */}
        <div className="flex flex-col gap-6 w-full max-w-md mx-auto mt-20 md:mt-0 relative">
          
          {/* Subtle Radial Glow Behind Cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full z-0"></div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="liquid-glass-strong p-6 rounded-3xl relative z-10 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,214,242,0.8)]" />
              <p className="text-sm font-medium text-white/90 tracking-wide">{currentConfig.info}</p>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full mt-4 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full relative"
              >
                <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/40 blur-[2px] animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 relative z-10">
            {currentConfig.features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (idx * 0.1), duration: 0.8 }}
                className="liquid-glass p-6 rounded-3xl group hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-400 border border-white/5 hover:border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden group-hover:scale-110 transition-transform duration-300`}
                      style={{ boxShadow: `0 0 20px ${feature.glow}, inset 0 1px 1px rgba(255,255,255,0.4)` }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 text-white drop-shadow-md">
                        {React.cloneElement(feature.icon, { className: "w-6 h-6" })}
                      </div>
                    </motion.div>
                    <span className="font-semibold text-lg text-white/90 tracking-tight">{feature.name}</span>
                  </div>
                  <TrendingUp className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
                
                {/* Mini Bar Chart Area */}
                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex items-end gap-1.5 h-14">
                    {feature.data.map((val, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t-md relative group/bar hover:bg-white/10 transition-colors">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${val}%` }}
                          transition={{ delay: 1.2 + (idx * 0.2) + (i * 0.1), duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute bottom-0 w-full rounded-t-md bg-gradient-to-t ${feature.color} opacity-80 group-hover/bar:opacity-100 transition-opacity`}
                        >
                          {/* Top glow indicator */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-white/50 rounded-t-md shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        </motion.div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">{feature.trend}</span>
                    <span className="text-xl font-bold text-white tracking-tight">{feature.value}<span className="text-sm font-medium text-white/60 ml-0.5">{feature.unit}</span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
