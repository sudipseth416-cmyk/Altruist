import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Shield, Activity, Users, Heart, ArrowRight, Sprout, UploadCloud, BrainCircuit, Link2, FileText, Zap, BarChart3, Map, MessageSquare, AlertTriangle, Lightbulb } from 'lucide-react';
import FeatureShowcase from './FeatureShowcase';
import ProcessFlow from './ProcessFlow';
import ImpactVoices from './ImpactVoices';

interface LandingViewProps {
  onGetStarted: () => void;
}

export default function LandingView({ onGetStarted }: LandingViewProps) {
  // Parallax mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Smooth springs for parallax
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Transform ranges for background elements
  const gridX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const gridY = useTransform(smoothY, [-1, 1], [-15, 15]);
  const orbsX = useTransform(smoothX, [-1, 1], [30, -30]);
  const orbsY = useTransform(smoothY, [-1, 1], [30, -30]);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-ngo-dark-950 text-white overflow-y-auto font-sans relative scroll-smooth overflow-x-hidden">
      {/* ── BACKGROUND ENHANCEMENT (DEPTH + MOTION) ── */}
      {/* Animated Grid with Parallax */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-grid-pattern"
        style={{ x: gridX, y: gridY }}
      />

      {/* Floating Gradient Orbs */}
      <motion.div 
        style={{ x: orbsX, y: orbsY }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[100px]"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], x: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[40%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]"
        />
      </motion.div>

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto sticky top-0 bg-ngo-dark-950/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-shadow duration-300">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400" style={{ textShadow: '0 0 20px rgba(139,92,246,0.3)' }}>Altruist</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {[
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'features', label: 'Features' },
            { id: 'volunteers', label: 'Volunteers' },
            { id: 'donations', label: 'Donations' }
          ].map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="relative text-slate-300 hover:text-white transition-colors group py-1">
              {link.label}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full shadow-[0_0_10px_rgba(6,214,242,0.5)]" />
            </button>
          ))}
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted} 
          className="py-2.5 px-6 rounded-xl font-bold text-sm text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] bg-gradient-to-r from-violet-600 to-cyan-600 border-0 hover:from-violet-500 hover:to-cyan-500 transition-all"
        >
          Sign In
        </motion.button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32">
        {/* ── HERO SECTION ── */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-8 shadow-[0_0_15px_rgba(6,214,242,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            SYSTEM ONLINE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] relative"
          >
            {/* Faint radial glow behind heading */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-gradient-to-r from-violet-500/20 to-cyan-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-500 animate-gradient-shift bg-[length:200%_auto]">Intelligence</span> that saves, <br className="hidden sm:block" /> speed that matters !!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Transform crisis response with real-time intelligence. Connect NGOs, volunteers, and donors in one unified ecosystem to solve community issues faster than ever before.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted} 
              className="relative flex items-center justify-center gap-2 text-lg px-8 py-4 w-full sm:w-auto shadow-[0_0_30px_rgba(139,92,246,0.4)] bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-xl overflow-hidden group transition-all"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              Join the Mission <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGetStarted} 
              className="text-lg px-8 py-4 w-full sm:w-auto border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 hover:border-violet-400/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] font-semibold rounded-xl transition-all"
            >
              Explore Demo
            </motion.button>
          </motion.div>
        </div>

        {/* ── IMPACT STATS ── */}
        <div id="donations" className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-32 relative">
          {[
            { label: "Active Crises Resolved", value: "2,450+" },
            { label: "Registered Volunteers", value: "12,000+" },
            { label: "Community Impact", value: "$1.4M" },
            { label: "Avg. Response Time", value: "< 4 hrs" }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md text-center hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-extrabold text-white mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── PROBLEM STATEMENT ── */}
        <div className="mt-40 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Heard of that flood in Nadia.... that needs your help <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] inline-block my-4 text-5xl sm:text-6xl font-black tracking-widest animate-pulse">
              PAPER SURVEYS!!
            </span> <br/>
            that vanishes before necessary action is taken
          </h2>
          <p className="text-lg sm:text-xl text-slate-400/80 font-medium tracking-wide">
            Putting an end to unnoticed problems due to lack of right approach
          </p>
        </div>

        {/* ── PROCESS FLOW ── */}
        <ProcessFlow />

        {/* ── SOLUTION FEATURES ── */}
        <FeatureShowcase />

        {/* ── IMPACT VOICES (REVIEWS) ── */}
        <ImpactVoices />

      </main>
    </div>
  );
}
