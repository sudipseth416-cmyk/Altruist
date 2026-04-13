"use client";

import React, { useState } from "react";
import {
  Zap,
  Star,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  Users,
  Shield,
  Target,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";
import type { ResourceMatch, CrisisNeed } from "@/lib/types";

interface MatchingPanelProps {
  need: CrisisNeed | null;
  matches: ResourceMatch[];
}

/* ── Score Color ── */
function scoreColor(score: number): string {
  if (score >= 85) return "#34d399";
  if (score >= 70) return "#22d3ee";
  if (score >= 50) return "#fbbf24";
  return "#fb7185";
}

function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Moderate";
  return "Partial";
}

/* ── Match Card ── */
function MatchCard({ match, rank }: { match: ResourceMatch; rank: number }) {
  const [expanded, setExpanded] = useState(rank === 0);
  const vol = match.volunteer;
  const color = scoreColor(match.matchScore);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300
        ${rank === 0
          ? "border-ngo-accent/25 bg-gradient-to-br from-ngo-accent/[0.06] to-transparent"
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
        }
      `}
    >
      {/* Rank indicator */}
      {rank === 0 && (
        <div className="absolute top-0 right-0 px-2.5 py-1 rounded-bl-xl bg-ngo-accent/15 border-b border-l border-ngo-accent/20">
          <span className="text-[9px] font-bold text-ngo-accent uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3" /> Best Match
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-lg flex-shrink-0 border border-white/[0.06]">
            {vol.avatar}
          </div>

          {/* Name + org */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white truncate">
                {vol.name}
              </h4>
              <span className="text-[10px] font-medium text-slate-500 flex-shrink-0">
                #{rank + 1}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">{vol.organization}</p>
          </div>

          {/* Score ring */}
          <div className="flex-shrink-0 relative">
            <svg width="48" height="48" className="-rotate-90">
              <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="18" fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - match.matchScore / 100)}
                style={{ transition: "stroke-dashoffset 1s ease-out", filter: `drop-shadow(0 0 4px ${color}60)` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{match.matchScore}</span>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-slate-400">
            <MapPin className="w-3 h-3" /> {vol.location}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-slate-400">
            <Clock className="w-3 h-3" /> {match.estimatedArrival}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold"
            style={{ background: `${color}15`, color }}
          >
            <Star className="w-3 h-3" /> {scoreLabel(match.matchScore)}
          </span>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Less detail" : "Score breakdown"}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 space-y-3 animate-fade-in">
            {/* Score breakdown bars */}
            <div className="space-y-2">
              {[
                { label: "Skill Match", value: match.breakdown.skillMatch, max: 35, icon: Target },
                { label: "Proximity", value: match.breakdown.proximityScore, max: 25, icon: MapPin },
                { label: "Availability", value: match.breakdown.availabilityScore, max: 20, icon: Clock },
                { label: "Experience", value: match.breakdown.experienceScore, max: 10, icon: TrendingUp },
                { label: "Capacity", value: match.breakdown.loadScore, max: 10, icon: Activity },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <s.icon className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="text-[10px] text-slate-400 w-16 flex-shrink-0">{s.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(s.value / s.max) * 100}%`,
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-white font-semibold w-6 text-right">
                    {s.value}/{s.max}
                  </span>
                </div>
              ))}
            </div>

            {/* Skills tags */}
            <div>
              <p className="text-[10px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {vol.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
              <p className="text-[10px] text-slate-500 font-medium mb-1">AI Recommendation</p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {match.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Main Panel
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function MatchingPanel({ need, matches }: MatchingPanelProps) {
  if (!need || matches.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px] animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-400 mb-1">
          Resource Matching
        </h3>
        <p className="text-xs text-slate-600 text-center max-w-[220px]">
          Parse a crisis report to see volunteer matches with compatibility scores
        </p>
      </div>
    );
  }

  const topMatch = matches[0];

  return (
    <div className="glass-card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box-cyan">
            <Zap className="w-5 h-5 text-ngo-cyan" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Resource Matching</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              {matches.length} volunteers matched for {need.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
          <Shield className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-500 font-medium">
            Avg: {Math.round(matches.reduce((s, m) => s + m.matchScore, 0) / matches.length)}%
          </span>
        </div>
      </div>

      {/* Need summary */}
      <div className="mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Matching for:
          </span>
          <span className="badge badge-cyan text-[10px]">{need.category}</span>
          <span className="text-[10px] text-slate-500">in</span>
          <span className="text-[10px] text-white font-medium">{need.location}</span>
          {need.population > 0 && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-400">
                {need.population.toLocaleString()} affected
              </span>
            </>
          )}
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
        {matches.slice(0, 5).map((match, idx) => (
          <MatchCard key={match.volunteerId} match={match} rank={idx} />
        ))}
      </div>
    </div>
  );
}
