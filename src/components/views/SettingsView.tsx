"use client";

import React, { useState } from "react";
import { Settings, Shield, User, Bell, Globe2, Eye, Lock, Key, Palette, Monitor, Volume2, Mail, Smartphone } from "lucide-react";

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${active ? "bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_15px_rgba(6,214,242,0.4)]" : "bg-white/10"}`} role="switch" aria-checked={active}>
      <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${active ? "translate-x-6" : "translate-x-0"}`} style={active ? { boxShadow: "0 0 10px rgba(255,255,255,0.8)" } : {}} />
    </button>
  );
}

interface SettingRow { icon: typeof Shield; label: string; description: string; key: string; }

const SECURITY_SETTINGS: SettingRow[] = [
  { icon: Lock, label: "Two-Factor Authentication", description: "Require 2FA for all login attempts", key: "2fa" },
  { icon: Eye, label: "PII Auto-Masking", description: "Automatically mask personal identifiable information in reports", key: "pii" },
  { icon: Shield, label: "Encrypted Transmissions", description: "End-to-end encryption for all field communications", key: "encrypt" },
  { icon: Key, label: "Session Timeout", description: "Auto-logout after 30 minutes of inactivity", key: "session" },
];

const NOTIFICATION_SETTINGS: SettingRow[] = [
  { icon: Bell, label: "Critical Alert Notifications", description: "Immediate push notifications for critical-level alerts", key: "critical" },
  { icon: Mail, label: "Daily Digest Email", description: "Summary of operations sent at 0800 UTC daily", key: "digest" },
  { icon: Smartphone, label: "Mobile Push Alerts", description: "Real-time alerts to mobile devices", key: "mobile" },
  { icon: Volume2, label: "Audio Alerts", description: "Sound alerts for high-priority events in command center", key: "audio" },
];

const PREFERENCE_SETTINGS: SettingRow[] = [
  { icon: Palette, label: "Dark Mode", description: "Enable tactical dark theme (recommended)", key: "dark" },
  { icon: Monitor, label: "High Contrast", description: "Enhanced contrast for improved readability", key: "contrast" },
  { icon: Globe2, label: "Auto-translate Reports", description: "Use AI to translate field reports to English", key: "translate" },
];

function SettingSection({ title, icon: Icon, settings, toggles, onToggle, delay, iconColor }: {
  title: string; icon: typeof Shield; settings: SettingRow[];
  toggles: Record<string, boolean>; onToggle: (key: string) => void; delay: number; iconColor: string;
}) {
  return (
    <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 sm:p-8 opacity-0 animate-slide-up relative overflow-hidden" style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none" />
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <Icon className={`w-5 h-5 ${iconColor}`} style={{ filter: `drop-shadow(0 0 8px currentColor)` }} />
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-3 relative z-10">
        {settings.map((setting) => (
          <div key={setting.key} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-white/10 bg-black/40">
              <setting.icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white tracking-wide">{setting.label}</p>
              <p className="text-[11px] font-medium text-white/50 mt-1 leading-relaxed">{setting.description}</p>
            </div>
            <Toggle active={!!toggles[setting.key]} onToggle={() => onToggle(setting.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsView() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "2fa": true, pii: true, encrypt: true, session: true,
    critical: true, digest: true, mobile: false, audio: true,
    dark: true, contrast: false, translate: true,
  });

  const handleToggle = (key: string) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="view-container max-w-4xl font-['Poppins',sans-serif] pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
        <div>
          <h2 className="text-4xl font-extrabold text-white flex items-center gap-4 tracking-[-0.04em] text-shadow-glow mb-2">
            <Settings className="w-8 h-8 text-white/50" />
            Settings Matrix
          </h2>
          <p className="text-sm text-white/50 font-medium tracking-wide">System configuration & operational preferences</p>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(6,214,242,0.5)] hover:scale-105 transition-all self-start">Save Changes</button>
      </div>

      {/* Account Card */}
      <div className="liquid-glass rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 sm:p-8 mb-8 opacity-0 animate-slide-up relative overflow-hidden" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-cyan-500/30 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-[0_0_20px_rgba(6,214,242,0.2)]">
            <User className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-xl font-bold text-white tracking-wide">Operator Admin</p>
            <p className="text-sm text-white/50 mt-1 font-medium">admin@ngo-os.org <span className="mx-2 opacity-50">•</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold uppercase tracking-widest text-[10px]">Pro Clearance</span></p>
          </div>
          <button className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider self-start sm:self-auto">Edit Profile</button>
        </div>
      </div>

      <div className="space-y-6">
        <SettingSection title="Security Protocol" icon={Shield} settings={SECURITY_SETTINGS} toggles={toggles} onToggle={handleToggle} delay={200} iconColor="text-cyan-400" />
        <SettingSection title="Alert Channels" icon={Bell} settings={NOTIFICATION_SETTINGS} toggles={toggles} onToggle={handleToggle} delay={300} iconColor="text-purple-400" />
        <SettingSection title="Display Preferences" icon={Palette} settings={PREFERENCE_SETTINGS} toggles={toggles} onToggle={handleToggle} delay={400} iconColor="text-pink-400" />
      </div>

      <div className="liquid-glass rounded-3xl border border-rose-500/20 shadow-[0_8px_32px_rgba(244,63,94,0.1)] p-6 sm:p-8 mt-8 opacity-0 animate-slide-up relative overflow-hidden bg-rose-500/5" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none" />
        <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
          <Shield className="w-4 h-4" /> Danger Zone
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-base font-bold text-white tracking-wide">Purge System Data</p>
            <p className="text-xs text-white/50 font-medium mt-1">Permanently erase all operational history and cached intelligence.</p>
          </div>
          <button className="px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-wider self-start sm:self-auto shadow-[0_0_15px_rgba(244,63,94,0.2)]">Initiate Purge</button>
        </div>
      </div>
    </div>
  );
}
