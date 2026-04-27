import React from 'react';
import { motion } from 'framer-motion';
import { FileText, UploadCloud, BrainCircuit, Link2, Zap, ShieldCheck } from 'lucide-react';

const steps = [
  { 
    id: "01",
    icon: FileText, 
    label: "Collect", 
    desc: "Gather raw field data & surveys",
    color: "text-blue-400",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    border: "group-hover:border-blue-400/50"
  },
  { 
    id: "02",
    icon: UploadCloud, 
    label: "Ingest", 
    desc: "Secure encrypted cloud upload",
    color: "text-cyan-400",
    glow: "shadow-[0_0_30px_rgba(6,214,242,0.3)]",
    border: "group-hover:border-cyan-400/50"
  },
  { 
    id: "03",
    icon: BrainCircuit, 
    label: "Analyze", 
    desc: "AI-driven NLP & risk scoring",
    color: "text-violet-400",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    border: "group-hover:border-violet-400/50"
  },
  { 
    id: "04",
    icon: Link2, 
    label: "Match", 
    desc: "Algorithmic volunteer pairing",
    color: "text-fuchsia-400",
    glow: "shadow-[0_0_30px_rgba(217,70,239,0.3)]",
    border: "group-hover:border-fuchsia-400/50"
  },
  { 
    id: "05",
    icon: ShieldCheck, 
    label: "Report", 
    desc: "Auto-generate PDF briefs",
    color: "text-rose-400",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.3)]",
    border: "group-hover:border-rose-400/50"
  },
  { 
    id: "06",
    icon: Zap, 
    label: "Execute", 
    desc: "Real-time action deployment",
    color: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]",
    border: "group-hover:border-emerald-400/50"
  }
];

export default function ProcessFlow() {
  return (
    <div id="how-it-works" className="mt-40 relative max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-emerald-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="text-center mb-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-bold mb-6 backdrop-blur-md"
        >
          <BrainCircuit className="w-3 h-3 text-violet-400" />
          AUTOMATED PIPELINE
        </motion.div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          From Chaos to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Resolution</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          A seamless, zero-friction pipeline. Upload unstructured data and watch the system automatically route it to the right people in seconds.
        </p>
      </div>
      
      <div className="relative z-10 w-full px-4 md:px-0">
        {/* Animated Connecting Line (Desktop) */}
        <div className="hidden lg:block absolute top-[50px] left-[8%] right-[8%] h-[2px] bg-white/[0.05] -z-10">
          {/* Energy pulse traveling through the line */}
          <motion.div 
            animate={{ left: ["0%", "100%", "0%"] }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            className="absolute top-1/2 -translate-y-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06d6f2]" 
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative group flex flex-col items-center lg:block"
            >
              {/* Step Number Badge */}
              <div className="hidden lg:flex absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 group-hover:text-slate-400 transition-colors">
                STEP {step.id}
              </div>

              {/* Icon Container */}
              <div className={`w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-3xl bg-[#080c18] border border-white/10 flex items-center justify-center mb-6 relative transition-all duration-500 group-hover:scale-110 ${step.border} group-hover:${step.glow} group-hover:bg-[#0c1225]`}>
                {/* Inner gradient ring on hover */}
                <div className="absolute inset-2 rounded-2xl border border-white/[0.02] bg-gradient-to-br from-white/[0.01] to-white/[0.05] group-hover:from-white/[0.05] group-hover:to-white/[0.1] transition-colors duration-500" />
                <step.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${step.color} relative z-10 transition-transform duration-500 group-hover:scale-110`} />
              </div>

              {/* Content */}
              <div className="text-center lg:px-2">
                <h3 className="text-lg font-bold text-slate-200 group-hover:text-white mb-2 transition-colors">{step.label}</h3>
                <p className="text-xs text-slate-500 font-medium group-hover:text-slate-400 transition-colors leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Mobile/Tablet Connection Line */}
              {idx < steps.length - 1 && (
                <div className="lg:hidden w-px h-8 bg-gradient-to-b from-white/20 to-transparent my-4" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
