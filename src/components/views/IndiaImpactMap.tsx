import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity, ArrowUpRight } from 'lucide-react';

export default function IndiaImpactMap() {
  const regions = [
    { name: "Nadia (West Bengal)", action: "Flood Relief", status: "critical", lat: 35, lng: 70 },
    { name: "Murshidabad (West Bengal)", action: "Medical Team", status: "critical", lat: 40, lng: 68 },
    { name: "Kendrapara (Odisha)", action: "Ration Distribution", status: "high", lat: 55, lng: 60 },
    { name: "Patna (Bihar)", action: "Anganwadi Support", status: "high", lat: 30, lng: 55 },
  ];

  return (
    <div className="mt-40 max-w-6xl mx-auto relative px-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-gradient-to-r from-[#FF6B00]/10 via-amber-500/10 to-[#138808]/10 blur-[120px] pointer-events-none -z-10" />

      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <Activity className="w-4 h-4 animate-pulse" />
          REAL-TIME IMPACT MAP
        </motion.div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">India District Intelligence</h2>
        <p className="text-slate-400 text-lg">Live operations monitoring across West Bengal, Bihar, and Odisha.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left: Interactive Map Area */}
        <div className="lg:col-span-3 bg-[#080c18]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-8 relative flex items-center justify-center overflow-hidden min-h-[400px]">
          {/* Stylized Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          {/* Abstract India SVG Representation */}
          <div className="relative w-full max-w-[300px] aspect-square z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {/* Very simplified abstract India outline for tech-vibe */}
              <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M 30 10 L 45 5 L 60 15 L 75 30 L 90 45 L 85 60 L 60 85 L 45 95 L 35 85 L 20 60 L 10 40 L 25 25 Z" 
                fill="rgba(255, 255, 255, 0.02)" 
                stroke="rgba(255, 255, 255, 0.2)" 
                strokeWidth="0.5" 
              />
              
              {/* Highlighted States Area roughly mapped */}
              <motion.path 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                d="M 50 30 L 70 40 L 60 60 L 40 50 Z" 
                fill="url(#stateGradient)" 
                className="opacity-40"
              />

              <defs>
                <linearGradient id="stateGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#138808" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Heat indicators */}
              {regions.map((region, i) => (
                <g key={i}>
                  <motion.circle 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2 + i, repeat: Infinity }}
                    cx={region.lng} cy={region.lat} r="3" 
                    fill={region.status === 'critical' ? '#ef4444' : '#f59e0b'} 
                    className="blur-[2px]"
                  />
                  <circle cx={region.lng} cy={region.lat} r="1" fill="#fff" />
                </g>
              ))}
            </svg>

            {/* Floating Labels */}
            {regions.map((region, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + (i * 0.2) }}
                className="absolute flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10"
                style={{ top: `${region.lat}%`, left: `${region.lng + 5}%` }}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${region.status === 'critical' ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="text-[9px] font-bold text-white whitespace-nowrap">{region.name.split(' ')[0]}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Top Urgent Needs List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-200">Active District Priorities</h3>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">Live Sync</span>
          </div>

          {regions.map((region, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#080c18]/60 backdrop-blur-md p-4 rounded-2xl border border-white/[0.05] hover:border-white/20 transition-all group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${region.status === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                  {region.status === 'critical' ? <AlertTriangle className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{region.action}</h4>
                  <p className="text-xs text-slate-400">{region.name}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </div>
            </motion.div>
          ))}
          
          <button className="mt-4 py-3 rounded-xl border border-[#FF6B00]/30 text-[#FF6B00] font-bold text-sm hover:bg-[#FF6B00]/10 transition-colors flex items-center justify-center gap-2">
            View Complete Impact Map <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
