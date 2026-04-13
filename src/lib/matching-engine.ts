/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Resource Matching Engine
   
   The "brain" of the system. Compares extracted CrisisNeeds against
   available VolunteerProfiles and generates ranked ResourceMatches
   with a transparent scoring breakdown.
   
   Scoring Algorithm (100 points max):
   ┌────────────────────┬────────┬──────────────────────────────────┐
   │ Factor             │ Weight │ Logic                            │
   ├────────────────────┼────────┼──────────────────────────────────┤
   │ Skill Match        │ 35%    │ Direct skill ↔ category mapping  │
   │ Proximity          │ 25%    │ Haversine distance calculation   │
   │ Availability       │ 20%    │ Faster = higher score            │
   │ Experience         │ 10%    │ More years = higher score        │
   │ Current Load       │ 10%    │ Less busy = higher score         │
   └────────────────────┴────────┴──────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════════ */

import type {
  CrisisNeed,
  VolunteerProfile,
  ResourceMatch,
} from "./types";

/* ── Haversine Distance (km) ────────────────────────────────────── */

function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* ── Estimated Travel Time ──────────────────────────────────────── */

function estimateArrival(distanceKm: number, availability: string): string {
  const baseHours = distanceKm / 60; // ~60 km/h average in crisis zones

  const availabilityDelay: Record<string, number> = {
    immediate: 0,
    "within-24h": 12,
    "within-48h": 24,
    standby: 48,
  };

  const totalHours = baseHours + (availabilityDelay[availability] || 0);

  if (totalHours < 1) return "< 1 hour";
  if (totalHours < 24) return `~${Math.round(totalHours)} hours`;
  const days = Math.round(totalHours / 24);
  return `~${days} day${days > 1 ? "s" : ""}`;
}

/* ── Generate Recommendation Text ───────────────────────────────── */

function generateRecommendation(
  volunteer: VolunteerProfile,
  need: CrisisNeed,
  score: number,
  distanceKm: number
): string {
  if (score >= 85) {
    return `Excellent match. ${volunteer.name} has direct ${need.category} expertise and is ${distanceKm < 100 ? "nearby" : "within deployment range"}. Recommend immediate deployment.`;
  }
  if (score >= 70) {
    return `Strong match. ${volunteer.name}'s ${volunteer.skills[0]} skills are highly relevant. ${volunteer.availability === "immediate" ? "Available for rapid deployment." : "Can mobilize within 24h."}`;
  }
  if (score >= 50) {
    return `Moderate match. ${volunteer.name} has transferable skills from ${volunteer.organization}. Consider as backup or support personnel.`;
  }
  return `Partial match. ${volunteer.name} may assist in support roles. Primary skill set differs from immediate need.`;
}

/* ═══════════════════════════════════════════════════════════════════
   Main Matching Function
   ═══════════════════════════════════════════════════════════════════ */

export function matchVolunteers(
  need: CrisisNeed,
  volunteers: VolunteerProfile[]
): ResourceMatch[] {
  const matches: ResourceMatch[] = [];

  for (const vol of volunteers) {
    /* ── 1. Skill Match (35 points) ── */
    const hasDirectSkill = vol.skills.includes(need.category);
    const hasRelatedSkill = vol.skills.some((skill) => {
      // Define related skill pairs
      const relations: Record<string, string[]> = {
        "Water/Sanitation": ["Medical/Health", "Logistics"],
        "Medical/Health": ["Water/Sanitation", "Search & Rescue"],
        "Food Security": ["Logistics", "Shelter"],
        "Shelter": ["Logistics", "Food Security", "Protection"],
        "Protection": ["Shelter", "Communication", "Education"],
        "Logistics": ["Food Security", "Shelter", "Water/Sanitation"],
        "Search & Rescue": ["Medical/Health", "Logistics"],
        "Communication": ["Logistics", "Education"],
        "Education": ["Protection", "Communication"],
        "General": [],
      };
      return (relations[need.category] || []).includes(skill);
    });

    const skillMatch = hasDirectSkill ? 35 : hasRelatedSkill ? 18 : 5;

    /* ── 2. Proximity Score (25 points) ── */
    const distance = haversineDistance(
      need.coordinates[0], need.coordinates[1],
      vol.coordinates[0], vol.coordinates[1]
    );

    let proximityScore: number;
    if (distance < 50) proximityScore = 25;
    else if (distance < 200) proximityScore = 22;
    else if (distance < 500) proximityScore = 18;
    else if (distance < 1000) proximityScore = 12;
    else if (distance < 3000) proximityScore = 8;
    else proximityScore = 3;

    /* ── 3. Availability Score (20 points) ── */
    const availabilityScores: Record<string, number> = {
      immediate: 20,
      "within-24h": 14,
      "within-48h": 8,
      standby: 3,
    };
    const availabilityScore = availabilityScores[vol.availability] || 5;

    /* ── 4. Experience Score (10 points) ── */
    const experienceScore = Math.min(
      10,
      Math.round((vol.experience / 15) * 10)
    );

    /* ── 5. Load Score (10 points) — less busy = better ── */
    const loadScore = Math.round(((100 - vol.currentLoad) / 100) * 10);

    /* ── Total Score ── */
    const matchScore = Math.min(
      100,
      skillMatch + proximityScore + availabilityScore + experienceScore + loadScore
    );

    const arrival = estimateArrival(distance, vol.availability);
    const recommendation = generateRecommendation(vol, need, matchScore, distance);

    matches.push({
      volunteerId: vol.id,
      volunteer: vol,
      needId: need.id,
      matchScore,
      breakdown: {
        skillMatch,
        proximityScore,
        availabilityScore,
        experienceScore,
        loadScore,
      },
      estimatedArrival: arrival,
      recommendation,
    });
  }

  // Sort by match score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

/**
 * Get top N matches for a given need
 */
export function getTopMatches(
  need: CrisisNeed,
  volunteers: VolunteerProfile[],
  topN: number = 5
): ResourceMatch[] {
  return matchVolunteers(need, volunteers).slice(0, topN);
}

/**
 * Calculate overall resource coverage for a set of needs
 */
export function calculateCoverage(
  needs: CrisisNeed[],
  volunteers: VolunteerProfile[]
): {
  totalNeeds: number;
  coveredNeeds: number;
  coveragePercent: number;
  avgMatchScore: number;
  criticalGaps: string[];
} {
  let totalScore = 0;
  let coveredCount = 0;
  const criticalGaps: string[] = [];

  for (const need of needs) {
    const matches = matchVolunteers(need, volunteers);
    const bestMatch = matches[0];

    if (bestMatch && bestMatch.matchScore >= 50) {
      coveredCount++;
      totalScore += bestMatch.matchScore;
    } else {
      criticalGaps.push(`${need.category} in ${need.location}`);
    }
  }

  return {
    totalNeeds: needs.length,
    coveredNeeds: coveredCount,
    coveragePercent: needs.length > 0 ? Math.round((coveredCount / needs.length) * 100) : 0,
    avgMatchScore: coveredCount > 0 ? Math.round(totalScore / coveredCount) : 0,
    criticalGaps,
  };
}
