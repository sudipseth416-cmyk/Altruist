import React from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  Activity,
  AlertTriangle,
  Lightbulb,
  Map,
  Users,
  MessageSquare,
  BarChart3,
  FileText,
  CheckCircle2,
  FileSearch,
  Crosshair,
  TrendingUp,
  Fingerprint,
  Zap
} from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, color, delay, children, id }: any) => {
  const colorClass = color.split(' ').find((c: string) => c.startsWith('text-')) || 'text-white';
  const gradientClass = color.split(' ').filter((c: string) => !c.startsWith('text-')).join(' ');

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: delay * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative p-[1px] rounded-[24px] overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Animated Border Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Inner Card Content */}
      <div className="relative h-full bg-[#080c18]/90 backdrop-blur-xl rounded-[23px] p-6 flex flex-col overflow-hidden border border-white/[0.05]">
        
        {/* Soft Inner Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${gradientClass} rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-700`} />

        <div className="flex items-start gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/[0.05]">
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight mb-1">{title}</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{description}</p>
          </div>
        </div>
        
        {/* Visual Container */}
        <div className="mt-auto bg-black/40 rounded-xl p-5 border border-white/[0.04] overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// ── EXTREME PREMIUM VISUAL COMPONENTS ──

const SmartUploadVisual = () => (
  <div className="space-y-3 relative">
    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[flowLine_1s_linear_infinite]" />
    
    <div className="flex items-center justify-between border border-dashed border-blue-500/30 rounded-lg p-3 bg-blue-500/5 relative overflow-hidden group-hover:border-blue-400/50 transition-colors">
      <div className="flex items-center gap-2">
        <FileSearch className="w-4 h-4 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-200">field_report_Q3.csv</span>
          <span className="text-[8px] text-slate-500">2.4 MB • Encrypted</span>
        </div>
      </div>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-400 rounded-full"
      />
    </div>

    <div className="space-y-1.5 relative">
      <div className="flex justify-between text-[9px] text-slate-400 font-medium">
        <span>Processing NLP...</span>
        <span className="text-blue-400">84%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          initial={{ width: "0%" }}
          whileInView={{ width: "84%" }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full relative"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </motion.div>
      </div>
    </div>
  </div>
);

const DashboardVisual = () => (
  <div className="relative h-20 flex items-end gap-1.5 pt-4">
    {/* Background Grid Lines */}
    <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-white/5 pb-0.5 pl-0.5">
      {[1, 2, 3].map(i => <div key={i} className="w-full border-t border-white/[0.02]" />)}
    </div>
    
    {[
      { h1: 40, h2: 20 }, { h1: 65, h2: 30 }, { h1: 45, h2: 25 }, 
      { h1: 90, h2: 40 }, { h1: 75, h2: 35 }, { h1: 55, h2: 20 }
    ].map((bar, i) => (
      <div key={i} className="flex-1 flex flex-col justify-end relative group/bar z-10 h-full">
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: `${bar.h1}%`, opacity: 1 }}
          transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
          className="w-full bg-cyan-500/20 border border-cyan-500/30 rounded-t-sm relative flex flex-col justify-end"
        >
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: `${(bar.h2 / bar.h1) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.1 + 0.4 }}
            className="w-full bg-cyan-400 rounded-t-sm shadow-[0_0_10px_rgba(6,214,242,0.5)]"
          />
        </motion.div>
      </div>
    ))}
  </div>
);

const RiskVisual = () => (
  <div className="flex items-center justify-between h-20">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <motion.path 
          initial={{ strokeDasharray: "0, 100" }}
          whileInView={{ strokeDasharray: "75, 100" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
          fill="none" 
          stroke="#f43f5e" 
          strokeWidth="3" 
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] text-rose-400 font-bold">CRIT</span>
        <span className="text-white font-extrabold text-sm">75</span>
      </div>
    </div>
    <div className="flex flex-col gap-2 w-1/2">
      {[
        { region: "Sector A", val: "Critical", color: "text-rose-400", dot: "bg-rose-500" },
        { region: "Sector B", val: "Elevated", color: "text-amber-400", dot: "bg-amber-500" }
      ].map((r, i) => (
        <div key={i} className="flex justify-between items-center bg-white/5 rounded px-2 py-1 border border-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${r.dot} animate-pulse`} />
            <span className="text-[9px] text-slate-300">{r.region}</span>
          </div>
          <span className={`text-[8px] font-bold ${r.color}`}>{r.val}</span>
        </div>
      ))}
    </div>
  </div>
);

const ActionsVisual = () => (
  <div className="space-y-2 h-20 overflow-hidden relative">
    <div className="absolute top-0 w-full h-4 bg-gradient-to-b from-black/40 to-transparent z-10" />
    <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-black/40 to-transparent z-10" />
    <motion.div 
      animate={{ y: [0, -30] }} 
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="space-y-2 pt-2"
    >
      {[
        { text: "Dispatch Medic Unit", priority: "P1", color: "text-rose-400 border-rose-400/30 bg-rose-400/10" },
        { text: "Secure Supply Route", priority: "P2", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
        { text: "Broadcast Warning", priority: "P2", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
        { text: "Evacuate Zone C", priority: "P1", color: "text-rose-400 border-rose-400/30 bg-rose-400/10" },
      ].map((action, i) => (
        <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
          <div className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${action.color}`}>
            {action.priority}
          </div>
          <span className="text-[10px] font-medium text-slate-300">{action.text}</span>
          <Zap className="w-3 h-3 text-slate-500 ml-auto" />
        </div>
      ))}
    </motion.div>
  </div>
);

const HeatMapVisual = () => (
  <div className="h-20 rounded-lg overflow-hidden relative border border-white/10 bg-[#0a1122]">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
    
    {/* Crosshairs */}
    <Crosshair className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/10" />

    {/* Glowing Heat Nodes */}
    <motion.div 
      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-3 left-4 w-6 h-6 rounded-full bg-rose-500/60 blur-[6px]"
    />
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: [0, 2], opacity: [1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      className="absolute top-4 left-5 w-4 h-4 rounded-full border border-rose-400"
    />

    <motion.div 
      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      className="absolute bottom-2 right-6 w-10 h-10 rounded-full bg-orange-500/50 blur-[8px]"
    />

    {/* Overlay Coordinates (Patna) */}
    <div className="absolute bottom-1 right-2 text-[7px] font-mono text-cyan-400/70">
      LAT: 25.59 | LNG: 85.13
    </div>
  </div>
);

const MatchingVisual = () => (
  <div className="h-20 flex flex-col justify-center gap-3">
    <div className="flex items-center justify-between px-2 relative">
      {/* Connecting Line */}
      <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent -translate-y-1/2">
        <motion.div 
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-1/2 w-4 h-[2px] bg-white -translate-y-1/2 rounded-full shadow-[0_0_8px_#fff]" 
        />
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <Fingerprint className="w-4 h-4 text-slate-400" />
      </div>

      <motion.div 
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="px-2 py-1 rounded-full bg-violet-500/20 border border-violet-500/50 relative z-10 backdrop-blur-sm"
      >
        <span className="text-[10px] font-black text-violet-300 drop-shadow-[0_0_5px_currentColor]">98% MATCH</span>
      </motion.div>

      <div className="w-8 h-8 rounded-full bg-violet-900/50 border-2 border-violet-400 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
        <Users className="w-4 h-4 text-white" />
      </div>
    </div>
  </div>
);

const FeedbackVisual = () => (
  <div className="h-20 flex flex-col justify-center space-y-3">
    {[
      { label: "Community Trust", w: "92%", color: "emerald", val: "High" },
      { label: "Response Speed", w: "78%", color: "amber", val: "Optimal" },
    ].map((stat, i) => (
      <div key={i} className="space-y-1">
        <div className="flex justify-between text-[9px] font-bold">
          <span className="text-slate-300">{stat.label}</span>
          <span className={`text-${stat.color}-400`}>{stat.val}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: stat.w }}
            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
            className={`h-full bg-${stat.color}-400 rounded-full relative`}
          >
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
          </motion.div>
        </div>
      </div>
    ))}
  </div>
);

const ChartVisual = () => (
  <div className="h-20 relative flex items-end w-full">
    {/* Grid */}
    <div className="absolute inset-0 border-l border-b border-white/10" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:25%_25%]" />
    
    {/* Area Fill */}
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(52, 211, 153, 0.4)" />
          <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
        </linearGradient>
      </defs>
      <motion.path 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        d="M0,40 L0,30 Q15,15 25,25 T50,15 T75,20 T100,5 L100,40 Z" 
        fill="url(#chartGradient)"
      />
      {/* Line */}
      <motion.path 
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M0,30 Q15,15 25,25 T50,15 T75,20 T100,5" 
        fill="none" 
        stroke="#34d399" 
        strokeWidth="2"
        className="drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]"
      />
    </svg>
    
    {/* Data Point Dot */}
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
      className="absolute top-[12.5%] right-0 w-2 h-2 bg-white rounded-full border border-emerald-500 shadow-[0_0_10px_#34d399] -translate-x-1/2 -translate-y-1/2"
    />
  </div>
);

const PDFVisual = () => (
  <div className="h-20 flex justify-center items-center relative perspective-1000">
    {/* Background scanning laser */}
    <motion.div 
      animate={{ y: [-10, 40, -10] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute w-full h-[1px] bg-sky-400 shadow-[0_0_15px_#38bdf8] z-20"
    />

    {/* Stacked Documents */}
    <div className="relative">
      <motion.div 
        className="absolute inset-0 bg-white/5 border border-white/10 rounded-sm translate-x-2 translate-y-2"
      />
      <motion.div 
        className="absolute inset-0 bg-white/10 border border-white/20 rounded-sm translate-x-1 translate-y-1"
      />
      
      <motion.div 
        whileHover={{ y: -5, rotate: -2, scale: 1.05 }}
        className="w-14 h-18 bg-slate-900 border border-sky-500/30 rounded-sm shadow-[0_0_15px_rgba(56,189,248,0.2)] relative overflow-hidden flex flex-col p-2 gap-1.5 z-10"
      >
        <div className="flex items-center gap-1 border-b border-white/10 pb-1">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <div className="h-1 w-6 bg-white/40 rounded-full" />
        </div>
        <div className="space-y-1 mt-1">
          <div className="h-[2px] w-full bg-white/20 rounded-full" />
          <div className="h-[2px] w-5/6 bg-white/20 rounded-full" />
          <div className="h-[2px] w-4/6 bg-white/20 rounded-full" />
          <div className="h-[2px] w-full bg-white/20 rounded-full mt-2" />
        </div>
        
        {/* PDF Badge */}
        <div className="absolute bottom-1 right-1 text-[5px] font-black bg-rose-500 text-white px-0.5 rounded">
          PDF
        </div>
      </motion.div>
    </div>
  </div>
);

export default function FeatureShowcase() {
  const features = [
    { 
      id: "upload", icon: UploadCloud, title: "Multilingual OCR & Upload", 
      description: "Instantly process physical surveys and voice notes in regional Indian languages.",
      color: "from-blue-500 via-cyan-400 to-teal-400 text-cyan-400", 
      visual: <SmartUploadVisual /> 
    },
    { 
      id: "dashboard", icon: Activity, title: "Smart Prioritization Engine", 
      description: "AI ranks urgency based on severity, frequency, and district-level metrics.",
      color: "from-cyan-400 via-teal-400 to-emerald-400 text-teal-400", 
      visual: <DashboardVisual /> 
    },
    { 
      id: "risk", icon: AlertTriangle, title: "Risk Detection", 
      description: "Predictive algorithms flag critical areas before they escalate.",
      color: "from-rose-500 via-red-500 to-orange-500 text-rose-400", 
      visual: <RiskVisual /> 
    },
    { 
      id: "actions", icon: Lightbulb, title: "Smart Actions", 
      description: "Automated workflow generation tailored to specific crises.",
      color: "from-amber-400 via-orange-400 to-rose-400 text-amber-400", 
      visual: <ActionsVisual /> 
    },
    { 
      id: "heatmap", icon: Map, title: "Real-Time India Impact Map", 
      description: "Live geospatial visualization of district-level needs and active resources.",
      color: "from-orange-500 via-rose-500 to-purple-500 text-orange-400", 
      visual: <HeatMapVisual /> 
    },
    { 
      id: "volunteers", icon: Users, title: "Volunteer Matching Engine", 
      description: "Algorithmic pairing of registered helpers based on required skills and distance.",
      color: "from-violet-500 via-purple-500 to-fuchsia-500 text-violet-400", 
      visual: <MatchingVisual /> 
    },
    { 
      id: "feedback", icon: MessageSquare, title: "Feedback Intelligence Loop", 
      description: "Continuous learning system improving responses from ground-level NGO feedback.",
      color: "from-pink-500 via-rose-400 to-orange-400 text-pink-400", 
      visual: <FeedbackVisual /> 
    },
    { 
      id: "charts", icon: TrendingUp, title: "Trend Analysis", 
      description: "Historical data modeling to forecast future resource needs.",
      color: "from-emerald-400 via-green-400 to-teal-400 text-emerald-400", 
      visual: <ChartVisual /> 
    },
    { 
      id: "pdf", icon: FileText, title: "Automated Report Generator", 
      description: "One-click generation of comprehensive, donor-ready PDF briefs for transparency.",
      color: "from-sky-400 via-blue-500 to-indigo-500 text-sky-400", 
      visual: <PDFVisual /> 
    }
  ];

  return (
    <div id="features" className="mt-40 relative">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 blur-[120px] pointer-events-none -z-10" />

      <div className="text-center mb-20 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-bold mb-6 backdrop-blur-md"
        >
          <Zap className="w-3 h-3 text-cyan-400" />
          CORE CAPABILITIES
        </motion.div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-slate-200 to-[#138808]">
            Platform 
          </span>
          <br className="md:hidden"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 ml-3">
            Capabilities
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          A robust intelligence framework designed for Indian humanitarian organizations. Everything you need to coordinate, execute, and deliver impact.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <FeatureCard 
            key={feature.id} 
            id={feature.id === "volunteers" ? "volunteers" : undefined}
            title={feature.title} 
            description={feature.description}
            icon={feature.icon} 
            color={feature.color} 
            delay={idx}
          >
            {feature.visual}
          </FeatureCard>
        ))}
      </div>
    </div>
  );
}
