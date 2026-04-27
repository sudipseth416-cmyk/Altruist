import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Shield, Activity, Users, Heart, ArrowRight, Sprout, UploadCloud, BrainCircuit, Link2, FileText, Zap, BarChart3, Map, MessageSquare, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import FeatureShowcase from './FeatureShowcase';
import ProcessFlow from './ProcessFlow';
import ImpactVoices from './ImpactVoices';
import IndiaImpactMap from './IndiaImpactMap';

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
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-gradient-to-r from-[#FF6B00]/10 to-[#138808]/10 blur-[80px] -z-10 rounded-full pointer-events-none" />
            800 paper surveys.<br className="hidden sm:block" />
            <span className="text-slate-400">0 volunteers deployed.</span><br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-amber-500 to-[#138808] animate-gradient-shift bg-[length:200%_auto]">Altruist changes that.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl text-slate-400 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            Altruist collects scattered field data from NGOs across India, surfaces the most urgent community needs in real time, and matches the right volunteers to the right districts — automatically.
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
              className="relative flex items-center justify-center gap-2 text-lg px-8 py-4 w-full sm:w-auto shadow-[0_0_30px_rgba(255,107,0,0.4)] bg-gradient-to-r from-[#FF6B00] to-orange-500 hover:from-orange-500 hover:to-[#FF6B00] text-white font-semibold rounded-xl overflow-hidden group transition-all"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              Join the Mission <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGetStarted} 
              className="text-lg px-8 py-4 w-full sm:w-auto border border-[#138808]/30 text-emerald-400 hover:bg-[#138808]/10 hover:border-[#138808]/60 hover:shadow-[0_0_20px_rgba(19,136,8,0.2)] font-semibold rounded-xl transition-all"
            >
              Explore System
            </motion.button>
          </motion.div>
        </div>

        {/* ── TRUST STRIP ── */}
        <motion.div 
          id="donations"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-28 max-w-4xl mx-auto relative px-4"
        >
          <div className="py-6 px-8 rounded-[20px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-md text-center relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
            {/* Subtle top light effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            <p className="text-[14px] sm:text-[15px] text-white/70 font-medium tracking-wide leading-relaxed flex items-center justify-center gap-2 flex-wrap">
              <Map className="w-4 h-4 text-slate-400/70" /> 
              Built around real-world NGO workflows across India — including flood surveys, healthcare needs, and ration distribution systems.
            </p>
            
            <div className="mt-3 flex items-center justify-center gap-2">
              <Activity className="w-3.5 h-3.5 text-slate-500/70" />
              <p className="text-[13px] text-white/50">
                Designed for low-bandwidth environments and multilingual field data.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── PROBLEM SECTION ── */}
        <div className="mt-40 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              The Problem We're Solving
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 font-medium tracking-wide max-w-3xl mx-auto">
              Every year, thousands of Indian NGOs collect critical community data — flood surveys, healthcare assessments, ration needs. Most of it never gets acted on. Not because people don't care. Because the data is buried in paper, scattered across phones, and impossible to process at scale. Meanwhile volunteers remain underutilized. <strong className="text-white">Altruist closes that gap.</strong>
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Buried in Paper", desc: "Critical surveys lost in physical files and cabinets." },
              { icon: MessageSquare, title: "Scattered on WhatsApp", desc: "Urgent needs forwarded and forgotten in group chats." },
              { icon: AlertTriangle, title: "Delayed Response", desc: "Days lost organizing data while situations escalate." },
              { icon: Users, title: "Unused Volunteers", desc: "Willing helpers unable to find where they are needed most." }
            ].map((item, i) => (
              <div key={i} className="bg-[#080c18]/80 backdrop-blur-xl p-8 rounded-2xl border border-white/[0.05] shadow-lg flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-white/10">
                  <item.icon className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TRADITIONAL VS ALTRUIST COMPARISON ── */}
        <div className="mt-40 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Traditional NGO Workflow vs Altruist</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Traditional */}
            <div className="flex-1 bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-rose-400 mb-8 text-center flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6" /> Traditional
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-rose-400 font-bold">×</span></div>
                  <div><h4 className="font-bold text-slate-200">Paper-based & Fragmented</h4><p className="text-sm text-slate-400 mt-1">Data collected on clipboards, spreadsheets, and scattered texts.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-rose-400 font-bold">×</span></div>
                  <div><h4 className="font-bold text-slate-200">Delayed Action</h4><p className="text-sm text-slate-400 mt-1">Manual data entry takes days, slowing down the crisis response.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-rose-400 font-bold">×</span></div>
                  <div><h4 className="font-bold text-slate-200">No Prioritization</h4><p className="text-sm text-slate-400 mt-1">Loudest voices get help first, not necessarily the most critical.</p></div>
                </li>
              </ul>
            </div>
            
            <div className="hidden md:flex w-16 h-16 rounded-full bg-[#138808]/20 items-center justify-center border border-[#138808]/40 shadow-[0_0_20px_rgba(19,136,8,0.3)] z-10 -mx-8">
              <ArrowRight className="w-8 h-8 text-[#138808]" />
            </div>

            {/* Altruist */}
            <div className="flex-1 bg-[#138808]/5 border border-[#138808]/30 rounded-3xl p-8 w-full max-w-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#138808]/10 blur-3xl rounded-full" />
              <h3 className="text-2xl font-bold text-emerald-400 mb-8 text-center flex items-center justify-center gap-2 relative z-10">
                <Shield className="w-6 h-6" /> Altruist System
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4 text-emerald-400" /></div>
                  <div><h4 className="font-bold text-white">Real-Time Ingestion</h4><p className="text-sm text-slate-400 mt-1">Instant sync of scanned papers, voice notes, and chat forwards.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4 text-emerald-400" /></div>
                  <div><h4 className="font-bold text-white">AI Prioritization</h4><p className="text-sm text-slate-400 mt-1">Algorithms rank urgency by frequency, severity, and geography.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4 text-emerald-400" /></div>
                  <div><h4 className="font-bold text-white">Instant Deployment</h4><p className="text-sm text-slate-400 mt-1">Auto-matches top available volunteers with required skills.</p></div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── CORE SYSTEM (CHAOS -> INTELLIGENCE -> RESOLUTION) ── */}
        <div className="mt-40 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Chaos → Intelligence → Resolution Engine</h2>
            <p className="text-slate-400 text-lg">A robust architecture handling India's complex data realities.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-4 relative">
            {/* Animated Flow Arrows Behind */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2">
              <motion.div 
                animate={{ left: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                className="absolute top-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent shadow-[0_0_10px_#FF6B00]"
              />
            </div>

            {/* CHAOS */}
            <div className="flex-1 bg-[#080c18]/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 relative z-10 w-full">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-inner">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-center mb-6 text-slate-300">CHAOS</h3>
              <ul className="space-y-3">
                {['Paper surveys', 'WhatsApp forwards', 'Voice notes', 'Field diaries', 'Multilingual input'].map((item, i) => (
                  <li key={i} className="bg-slate-800/50 rounded-lg p-3 text-sm text-center text-slate-400 font-medium border border-slate-700/50">{item}</li>
                ))}
              </ul>
            </div>

            <ArrowRight className="w-8 h-8 text-slate-600 rotate-90 lg:rotate-0 flex-shrink-0" />

            {/* INTELLIGENCE */}
            <div className="flex-1 bg-[#FF6B00]/10 backdrop-blur-xl border border-[#FF6B00]/30 rounded-3xl p-8 relative z-10 w-full shadow-[0_0_30px_rgba(255,107,0,0.1)]">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center border border-[#FF6B00]/40">
                  <BrainCircuit className="w-8 h-8 text-[#FF6B00]" />
                </div>
              </div>
              <h3 className="text-xl font-black text-center mb-6 text-[#FF6B00]">INTELLIGENCE</h3>
              <ul className="space-y-3">
                {['AI urgency scoring', 'Clustering similar needs', 'District-level prioritization', 'Multilingual OCR'].map((item, i) => (
                  <li key={i} className="bg-[#FF6B00]/10 rounded-lg p-3 text-sm text-center text-orange-200 font-medium border border-[#FF6B00]/20">{item}</li>
                ))}
              </ul>
            </div>

            <ArrowRight className="w-8 h-8 text-slate-600 rotate-90 lg:rotate-0 flex-shrink-0" />

            {/* RESOLUTION */}
            <div className="flex-1 bg-[#138808]/10 backdrop-blur-xl border border-[#138808]/30 rounded-3xl p-8 relative z-10 w-full shadow-[0_0_30px_rgba(19,136,8,0.1)]">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#138808]/20 flex items-center justify-center border border-[#138808]/40">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-xl font-black text-center mb-6 text-emerald-400">RESOLUTION</h3>
              <ul className="space-y-3">
                {['Dashboard outputs', 'Volunteer matching', 'Actionable insights', 'Auto-generated reports'].map((item, i) => (
                  <li key={i} className="bg-[#138808]/10 rounded-lg p-3 text-sm text-center text-emerald-200 font-medium border border-[#138808]/20">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── PROCESS FLOW ── */}
        <ProcessFlow />

        {/* ── SOLUTION FEATURES ── */}
        <FeatureShowcase />

        {/* ── INDIA IMPACT MAP ── */}
        <IndiaImpactMap />

        {/* ── IMPACT VOICES (REVIEWS) ── */}
        <ImpactVoices />

        {/* ── FINAL STATEMENT ── */}
        <div className="mt-32 pb-16 text-center max-w-4xl mx-auto border-t border-white/10 pt-16">
          <p className="text-2xl font-bold text-slate-300 italic">
            "From scattered data to coordinated action — <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#138808]">Altruist transforms how India responds to community needs.</span>"
          </p>
        </div>

      </main>
    </div>
  );
}
