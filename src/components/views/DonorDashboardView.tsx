"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, TrendingUp, ChevronRight, Award, CircleDollarSign, 
  Globe2, Activity, MapPin, AlertTriangle, Users, Droplets, 
  Zap, ArrowRight, Clock, Flame, ShieldCheck, HeartHandshake,
  Medal, Star, CheckCircle2, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { db, doc, setDoc, collection } from '@/lib/firebase';

const DONATION_HISTORY = [
  { month: 'Jan', amount: 150 },
  { month: 'Feb', amount: 200 },
  { month: 'Mar', amount: 100 },
  { month: 'Apr', amount: 350 },
  { month: 'May', amount: 250 },
  { month: 'Jun', amount: 400 },
];

const CAUSE_DISTRIBUTION = [
  { name: 'Medical', value: 45, color: '#ec4899' },
  { name: 'Water', value: 25, color: '#06d6f2' },
  { name: 'Food', value: 20, color: '#f59e0b' },
  { name: 'Shelter', value: 10, color: '#a855f7' }
];

const LEADERBOARD = [
  { rank: 1, name: 'Elena R.', amount: 12500, impactScore: 980, avatar: 'ER', badge: 'Gold' },
  { rank: 2, name: 'Marcus T.', amount: 9800, impactScore: 845, avatar: 'MT', badge: 'Silver' },
  { rank: 3, name: 'Sarah K.', amount: 8200, impactScore: 790, avatar: 'SK', badge: 'Bronze' },
  { rank: 4, name: 'David W.', amount: 5400, impactScore: 610, avatar: 'DW', badge: null },
  { rank: 5, name: 'You', amount: 4150, impactScore: 480, avatar: 'ME', badge: null, isUser: true },
];

const ACTIVE_PROBLEMS = [
  { id: 'P1', title: 'Urban Flood Relief', location: 'Sector 4', severity: 'Critical', raised: 4500, goal: 10000, icon: <Droplets className="w-5 h-5 text-cyan-400" /> },
  { id: 'P2', title: 'Emergency Med-Kits', location: 'Northern District', severity: 'High', raised: 8200, goal: 12000, icon: <Heart className="w-5 h-5 text-rose-400" /> },
  { id: 'P3', title: 'Refugee Food Supply', location: 'Border Camp Alpha', severity: 'Critical', raised: 2100, goal: 15000, icon: <Zap className="w-5 h-5 text-amber-400" /> }
];

export default function DonorDashboardView() {
  const [mounted, setMounted] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>('500');
  const [isDonating, setIsDonating] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDonate = async () => {
    setIsDonating(true);
    try {
      if (db && Object.keys(db).length > 0 && db.type !== 'mock') {
        const ref = doc(collection(db, 'donations'), `don-${Date.now()}`);
        await setDoc(ref, { amount: Number(donationAmount), timestamp: new Date(), status: 'completed' });
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      setDonationSuccess(true);
      setTimeout(() => setDonationSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDonating(false);
    }
  };

  const calculateImpact = (val: string) => {
    const num = parseInt(val) || 0;
    return {
      families: Math.floor(num / 150),
      meals: Math.floor(num / 10),
      medKits: Math.floor(num / 500)
    };
  };

  const impact = calculateImpact(donationAmount);

  if (!mounted) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] w-full font-['Poppins',sans-serif]">
      
      {/* ── LEFT PANEL (PERSONAL IMPACT & STATS) ── */}
      <div className="w-full lg:w-[360px] shrink-0 h-full overflow-y-auto liquid-glass rounded-3xl p-6 flex flex-col gap-8 custom-scrollbar relative border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
        
        {/* Total Impact Hero */}
        <div className="text-center relative z-10 pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/20">
            <Globe2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-1">Total Lifetime Impact</h3>
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-cyan-400 tracking-tight text-shadow-glow">
            $4,150
          </div>
          <p className="text-emerald-400 text-sm font-medium mt-3 flex items-center justify-center gap-1.5"><TrendingUp className="w-4 h-4" /> Top 5% worldwide</p>
        </div>

        {/* Impact Milestones */}
        <div className="liquid-glass p-5 rounded-2xl border border-white/5 bg-white/5">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-xs text-white/50 uppercase font-bold tracking-wider">Next Milestone</span>
              <h4 className="text-white font-bold flex items-center gap-2 mt-1"><Medal className="w-4 h-4 text-amber-400" /> Impact Champion</h4>
            </div>
            <span className="text-sm font-bold text-cyan-400">$4.1k / $5k</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '83%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 relative"
            >
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px] animate-[shimmer_2s_infinite]"></div>
            </motion.div>
          </div>
        </div>

        {/* Tangible Results */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4">Your Contributions Funded:</h4>
          <div className="space-y-3">
            {[
              { label: 'Families Supported', count: '28', icon: <Users className="w-4 h-4 text-purple-400" /> },
              { label: 'Clean Water Days', count: '145', icon: <Droplets className="w-4 h-4 text-cyan-400" /> },
              { label: 'Medical Kits', count: '12', icon: <HeartHandshake className="w-4 h-4 text-rose-400" /> }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
                  <span className="text-sm font-medium text-white/80">{stat.label}</span>
                </div>
                <span className="font-bold text-white">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak & Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="liquid-glass p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 text-center flex flex-col items-center justify-center group hover:bg-orange-500/10 transition-colors">
            <Flame className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-white block">4 Months</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Donation Streak</span>
          </div>
          <div className="liquid-glass p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-center flex flex-col items-center justify-center group hover:bg-purple-500/10 transition-colors">
            <ShieldCheck className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-white block">Verified</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Altruist Donor</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT (RIGHT SIDE) ── */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col space-y-8 pr-2 pb-10">
        
        {/* Live Impact Feed */}
        <div className="liquid-glass rounded-2xl p-4 border border-emerald-500/20 flex items-center gap-4 bg-emerald-500/5 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="text-sm text-emerald-100/80 font-medium truncate whitespace-nowrap">
            <span className="text-emerald-400 font-bold">Live Feed:</span> "Anonymous donated $250 to Urban Flood Relief" • "Sarah K. funded 10 Medical Kits" • "Global target reached for Sector 4 Water Supply!"
          </div>
        </div>

        {/* Smart Donation Calculator & Matching */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="liquid-glass rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" /> Smart Impact Calculator</h3>
            
            <div className="flex items-center gap-4 mb-6">
              {['50', '150', '500', '1000'].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => setDonationAmount(amt)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    donationAmount === amt 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,214,242,0.2)]' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="relative mb-8">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xl">$</span>
              <input 
                type="number" 
                value={donationAmount} 
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full bg-[#080c18] border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-2xl font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-8">
              <div className="text-sm text-cyan-100">
                <span className="font-bold text-cyan-400">Instant Impact:</span> Provides {impact.meals > 0 ? impact.meals : 0} meals or supports {impact.families > 0 ? impact.families : 0} families.
              </div>
            </div>

            <button 
              onClick={handleDonate}
              disabled={isDonating || donationSuccess}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                donationSuccess ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,214,242,0.4)]'
              }`}
            >
              {donationSuccess ? <><Heart className="w-6 h-6 animate-pulse" /> Thank You for Your Support!</> : isDonating ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Donation'}
            </button>
          </div>

          <div className="liquid-glass rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-6">Recommended for You</h3>
            <p className="text-sm text-white/50 mb-6">Based on your past support for water and medical initiatives.</p>
            
            <div className="space-y-4">
              {ACTIVE_PROBLEMS.slice(0, 2).map(problem => (
                <div key={problem.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-black/40 rounded-xl group-hover:scale-110 transition-transform">{problem.icon}</div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{problem.title}</h4>
                        <p className="text-xs text-white/50 flex items-center gap-1"><MapPin className="w-3 h-3" />{problem.location}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-rose-500/20 text-rose-400 rounded border border-rose-500/20">{problem.severity}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-white/60">Funded: ${problem.raised}</span>
                      <span className="text-white/60">Goal: ${problem.goal}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(problem.raised/problem.goal)*100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">View All Active Cases</button>
          </div>
        </div>

        {/* Global Leaderboard (High Priority) */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Award className="w-6 h-6 text-amber-400" /> Global Impact Leaderboard</h3>
          <div className="liquid-glass rounded-3xl p-6 border border-white/5">
            <div className="grid grid-cols-1 gap-3">
              {LEADERBOARD.map((user, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                    user.isUser ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_15px_rgba(6,214,242,0.15)]' : 
                    user.rank === 1 ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 
                    'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? 'bg-amber-500 text-amber-950' : 
                      user.rank === 2 ? 'bg-slate-300 text-slate-800' : 
                      user.rank === 3 ? 'bg-orange-400 text-orange-950' : 
                      'bg-white/10 text-white/50'
                    }`}>
                      #{user.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-inner">
                      {user.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        {user.name} {user.isUser && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">You</span>}
                      </h4>
                      <p className="text-xs text-white/50">{user.impactScore} Impact Points</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-lg text-emerald-400">${user.amount.toLocaleString()}</div>
                    {user.badge && (
                      <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                        user.badge === 'Gold' ? 'text-amber-400' : user.badge === 'Silver' ? 'text-slate-300' : 'text-orange-400'
                      }`}>
                        {user.badge} Tier
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><BarChart3 className="w-6 h-6 text-purple-400" /> Analytics & Trends</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[320px]">
            {/* Donation History Chart */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/5">
              <h4 className="text-sm font-semibold text-white/60 mb-6">Your Contribution Timeline</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DONATION_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{backgroundColor: 'rgba(12,18,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Cause Distribution Pie */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/5 flex flex-col">
              <h4 className="text-sm font-semibold text-white/60 mb-2">Fund Allocation</h4>
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CAUSE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {CAUSE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: 'rgba(12,18,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
