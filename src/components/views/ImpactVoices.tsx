import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, CheckCircle, HeartPulse } from 'lucide-react';

const REVIEWS = [
  {
    name: "Sarah Jenkins",
    role: "Field Officer",
    roleColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    rating: 5,
    text: "Resolved a critical flood case in under 4 hours. The AI matching system is incredibly accurate and literally saved lives.",
    avatar: "SJ"
  },
  {
    name: "Dr. Ahmed Khan",
    role: "Volunteer",
    roleColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    rating: 5,
    text: "As a medical volunteer, I get instantly notified when my specific skills are needed in my exact radius. Brilliant platform.",
    avatar: "AK"
  },
  {
    name: "Elena Rostova",
    role: "Donor",
    roleColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    rating: 4,
    text: "Total transparency. I love seeing the automated PDF reports of exactly how my supplies were distributed on the ground.",
    avatar: "ER"
  },
  {
    name: "Marcus Chen",
    role: "Admin",
    roleColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    rating: 5,
    text: "The risk factor prediction heatmap allows us to deploy resources proactively before the situation escalates further.",
    avatar: "MC"
  },
  {
    name: "Priya Sharma",
    role: "Volunteer",
    roleColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    rating: 5,
    text: "Matching volunteers has never been this efficient. I'm out there helping people rather than filling out endless paperwork.",
    avatar: "PS"
  },
  {
    name: "David Okafor",
    role: "Field Officer",
    roleColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    rating: 5,
    text: "It just works. Even with spotty connection, the ingestion system grabs my field notes and organizes the chaos effortlessly.",
    avatar: "DO"
  }
];

const ReviewCard = ({ review }: any) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="w-[350px] flex-shrink-0 p-6 rounded-[24px] bg-[#080c18]/80 backdrop-blur-xl border border-white/[0.05] hover:border-white/10 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 relative group"
  >
    {/* Subtle Inner Glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-10 rounded-[24px] blur-sm transition-opacity" />
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />
    
    <div className="flex justify-between items-start mb-5 relative z-10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-black text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          {review.avatar}
        </div>
        <div>
          <h4 className="font-bold text-slate-100 text-[15px]">{review.name}</h4>
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${review.roleColor} mt-1 inline-block`}>
            {review.role}
          </span>
        </div>
      </div>
      <div className="flex gap-0.5 bg-black/40 px-2 py-1 rounded-full border border-white/[0.05]">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" : "text-slate-700"}`} />
        ))}
      </div>
    </div>
    
    <p className="text-[14px] text-slate-400 font-medium leading-relaxed relative z-10 italic">
      "{review.text}"
    </p>
  </motion.div>
);

export default function ImpactVoices() {
  return (
    <div className="mt-40 relative py-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-emerald-500/5 via-cyan-500/5 to-purple-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header & Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-bold mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.15)]"
            >
              <HeartPulse className="w-3 h-3 animate-pulse" />
              VOICES OF IMPACT
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">
              Real people. Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">change.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              See how Altruist is empowering responders on the ground and making a difference when seconds count.
            </p>
          </div>

          {/* Trust Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 self-start lg:self-end"
          >
            <div className="bg-[#080c18] border border-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-lg flex-1 sm:flex-none">
              <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
                <Users className="w-5 h-5 drop-shadow-[0_0_8px_rgba(6,214,242,0.5)]" />
                <span className="font-black text-2xl text-white">12.5k+</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Responders</div>
            </div>
            
            <div className="bg-[#080c18] border border-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-lg flex-1 sm:flex-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 blur-xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-2 text-amber-400 mb-1.5 relative z-10">
                <Star className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                <span className="font-black text-2xl text-white">4.9</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider relative z-10">Average Rating</div>
            </div>
            
            <div className="hidden sm:block bg-[#080c18] border border-white/5 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 mb-1.5">
                <CheckCircle className="w-5 h-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="font-black text-2xl text-white">3,200+</span>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Missions Resolved</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Carousel */}
      <div className="relative w-full overflow-hidden flex pb-12 pt-4">
        {/* Deep Fade Edges for smooth entry/exit */}
        <div className="absolute top-0 bottom-0 left-0 w-12 md:w-40 bg-gradient-to-r from-[#04060e] via-[#04060e]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 md:w-40 bg-gradient-to-l from-[#04060e] via-[#04060e]/80 to-transparent z-20 pointer-events-none" />
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, ease: "linear", repeat: Infinity }}
          className="flex gap-6 px-6 w-max"
        >
          {/* Double array for seamless loop */}
          {[...REVIEWS, ...REVIEWS].map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
