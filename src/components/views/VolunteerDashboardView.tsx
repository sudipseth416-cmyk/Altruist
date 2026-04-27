"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Camera, Send, ShieldAlert, CheckCircle2, 
  ChevronRight, Activity, BarChart3, AlertTriangle, Image as ImageIcon, 
  Check, FileText, LifeBuoy, UserPlus, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { db, doc, setDoc, collection } from '@/lib/firebase';

const MOCK_ACTIVITY = [
  { day: 'Mon', hours: 4 }, { day: 'Tue', hours: 7 }, { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 8 }, { day: 'Fri', hours: 5 }, { day: 'Sat', hours: 9 }, { day: 'Sun', hours: 6 }
];

const MOCK_ANALYTICS = [
  { name: 'W1', resolved: 12, new: 15 },
  { name: 'W2', resolved: 18, new: 14 },
  { name: 'W3', resolved: 15, new: 20 },
  { name: 'W4', resolved: 25, new: 18 },
];

const PIE_DATA = [
  { name: 'Completed', value: 75, color: '#10b981' },
  { name: 'Pending', value: 25, color: '#3b82f6' }
];

const URGENT_NEEDS = [
  { id: 'URG-01', title: 'Medical Supply Shortage', location: 'Sector 7 Clinic', severity: 'Critical', type: 'Medical' },
  { id: 'URG-02', title: 'Water Distribution', location: 'Refugee Camp Alpha', severity: 'High', type: 'Logistics' },
  { id: 'URG-03', title: 'Search & Rescue Coord', location: 'Downtown Block 4', severity: 'Critical', type: 'Rescue' }
];

export default function VolunteerDashboardView() {
  const [activeTab, setActiveTab] = useState<'assigned' | 'status' | 'actions'>('assigned');
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleJoinMission = async (caseId: string) => {
    setIsJoining(true);
    try {
      // Check if db is a real Firestore instance (has type 'firestore') or handle mock gracefully
      if (db && Object.keys(db).length > 0 && db.type !== 'mock') {
        const ref = doc(collection(db, 'assignments'), `${caseId}-${Date.now()}`);
        await setDoc(ref, { caseId, status: 'Assigned', timestamp: new Date() });
      } else {
        await new Promise(r => setTimeout(r, 800)); // Simulate network
      }
      setJoinSuccess(caseId);
      setTimeout(() => setJoinSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsJoining(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)] w-full font-['Poppins',sans-serif]">
      
      {/* ── LEFT SIDEBAR (FIXED) ── */}
      <div className="w-full lg:w-[340px] shrink-0 h-full overflow-y-auto liquid-glass rounded-3xl p-6 flex flex-col gap-8 custom-scrollbar relative border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />
        
        {/* Task Completion Progress */}
        <div>
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">Mission Progress</h3>
          <div className="relative h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-white tracking-tight">75%</span>
              <span className="text-xs text-white/50">Completed</span>
            </div>
          </div>
        </div>

        {/* Field Reports Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="liquid-glass p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-2xl font-bold text-white block mb-1">12</span>
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Completed</span>
          </div>
          <div className="liquid-glass p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
            <span className="text-2xl font-bold text-cyan-400 block mb-1">4</span>
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">In Progress</span>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="flex-1 min-h-[180px]">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Activity (7 Days)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_ACTIVITY}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{backgroundColor: 'rgba(12,18,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
              />
              <Bar dataKey="hours" fill="url(#colorCyan)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06d6f2" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06d6f2" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── MAIN CONTENT (RIGHT SIDE) ── */}
      <div className="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-2 liquid-glass rounded-2xl mb-8 w-fit border border-white/5">
          {[
            { id: 'assigned', label: 'Assigned Reports', icon: <FileText className="w-4 h-4" /> },
            { id: 'status', label: 'Status Update', icon: <Activity className="w-4 h-4" /> },
            { id: 'actions', label: 'Field Actions', icon: <LifeBuoy className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] border border-white/10' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {activeTab === 'assigned' && (
              <div className="space-y-8 pb-10">
                {/* Emergency Spotlight Case */}
                <div className="relative overflow-hidden rounded-3xl p-[1px] group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-rose-600 to-transparent opacity-80" />
                  <div className="relative bg-[#080c18] rounded-[23px] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[80px] pointer-events-none rounded-full" />
                    
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-400 text-xs font-bold uppercase tracking-wider animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> High Alert
                        </span>
                        <span className="text-xs text-white/50 font-medium">Updated 2 mins ago</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Urban Flood Evacuation</h2>
                      <p className="text-white/70 max-w-xl text-sm leading-relaxed mb-6">
                        Rapid rising water levels in Sector 4. Elderly residents trapped on second floors requiring immediate boat-assisted evacuation.
                      </p>
                      <div className="flex items-center gap-5 text-sm text-white/80">
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"><MapPin className="w-4 h-4 text-cyan-400" /> Sector 4, City Center</span>
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"><Clock className="w-4 h-4 text-cyan-400" /> T-Minus 45 mins</span>
                      </div>
                    </div>

                    <div className="relative z-10 shrink-0 w-full md:w-auto">
                      <button 
                        onClick={() => handleJoinMission('CAS-EMERGENCY')}
                        disabled={isJoining || joinSuccess === 'CAS-EMERGENCY'}
                        className={`w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.3)]
                          ${joinSuccess === 'CAS-EMERGENCY' ? 'bg-emerald-500 text-white shadow-emerald-500/40' : 'bg-rose-500 hover:bg-rose-600 text-white hover:scale-105'}`}
                      >
                        {joinSuccess === 'CAS-EMERGENCY' ? (
                          <><CheckCircle2 className="w-5 h-5" /> Mission Joined</>
                        ) : isJoining ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Join This Mission <ChevronRight className="w-5 h-5" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Urgent Needs List */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-6 bg-cyan-400 rounded-full" />
                    Urgent Needs Queue
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {URGENT_NEEDS.map(need => (
                      <div key={need.id} className="liquid-glass rounded-2xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                            need.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {need.severity}
                          </span>
                          <span className="text-xs text-white/40">{need.type}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2 leading-tight">{need.title}</h4>
                        <p className="text-sm text-white/50 flex items-center gap-1.5 mb-6"><MapPin className="w-3.5 h-3.5" /> {need.location}</p>
                        
                        <button 
                          onClick={() => handleJoinMission(need.id)}
                          disabled={joinSuccess === need.id}
                          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex justify-center items-center gap-2 ${
                            joinSuccess === need.id 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                          }`}
                        >
                          {joinSuccess === need.id ? <><Check className="w-4 h-4" /> Joined</> : 'Join Mission'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics Section */}
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-2 h-6 bg-purple-500 rounded-full" />
                    Performance Analytics
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[300px]">
                    <div className="liquid-glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                      <h4 className="text-sm font-semibold text-white/60 mb-6">Resolution Rate vs New Cases</h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip contentStyle={{backgroundColor: 'rgba(12,18,40,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}} />
                          <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                          <Area type="monotone" dataKey="new" stroke="#a855f7" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="liquid-glass rounded-3xl p-6 border border-white/5 relative overflow-hidden flex flex-col justify-center items-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
                      <div className="text-center mb-8 relative z-10">
                        <h4 className="text-sm font-semibold text-white/60 mb-2 uppercase tracking-wider">Overall Impact Score</h4>
                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-500 mt-4 text-shadow-glow">
                          94.2
                        </div>
                        <p className="text-emerald-400 text-sm font-medium mt-2 flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4" /> +2.4% this month</p>
                      </div>
                      <div className="w-full max-w-sm h-3 bg-white/5 rounded-full overflow-hidden relative z-10">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '94.2%' }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full relative"
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px] animate-[shimmer_2s_infinite]"></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'status' && (
              <div className="max-w-2xl mx-auto py-8">
                <div className="liquid-glass rounded-3xl p-8 border border-white/5">
                  <h3 className="text-2xl font-bold text-white mb-6">Status Update Form</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Select Active Mission</label>
                      <select className="w-full bg-[#080c18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors">
                        <option>Urban Flood Evacuation (Sector 4)</option>
                        <option>Medical Supply Shortage (Sector 7)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Mission Status</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Pending', 'In Progress', 'Resolved'].map(stat => (
                          <button key={stat} className="py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                            {stat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Field Notes</label>
                      <textarea 
                        rows={4}
                        placeholder="Provide details about the current situation..."
                        className="w-full bg-[#080c18] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Proof / Image Upload (Optional)</label>
                      <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="bg-white/5 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">Click to upload photo</span>
                      </div>
                    </div>

                    <button className="w-full liquid-glass-strong py-4 rounded-xl text-white font-bold tracking-wide hover:shadow-[0_0_20px_rgba(6,214,242,0.3)] transition-all">
                      Submit Update
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="max-w-4xl mx-auto py-8">
                <h3 className="text-2xl font-bold text-white mb-8">Quick Field Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="liquid-glass rounded-3xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Mark Task Completed</h4>
                    <p className="text-white/50 text-sm">Instantly notify Command that your current primary mission objective is achieved.</p>
                  </div>

                  <div className="liquid-glass rounded-3xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                      <UserPlus className="w-6 h-6 text-amber-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Request Support</h4>
                    <p className="text-white/50 text-sm">Send a flare for additional volunteer backup or resources at your location.</p>
                  </div>

                  <div className="liquid-glass rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,214,242,0.3)]">
                      <Send className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Contact Admin</h4>
                    <p className="text-white/50 text-sm">Open a direct priority channel with the command center coordinators.</p>
                  </div>

                  <div className="liquid-glass rounded-3xl p-6 border border-rose-500/20 hover:border-rose-500/40 transition-colors group cursor-pointer bg-rose-500/5">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                      <ShieldAlert className="w-6 h-6 text-rose-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Declare Emergency</h4>
                    <p className="text-rose-300/70 text-sm">Trigger an immediate red-flag alert for life-threatening situations.</p>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
