/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Natural Language Parser
   
   Extracts structured CrisisNeed data from free-text field reports.
   Uses a keyword / regex approach — no external API needed.
   
   Input:  "Flooding in Sector 7, 50 families displaced, urgent need
            for clean water"
   Output: { location: "Sector 7", category: "Water/Sanitation",
             urgency: "Critical", population: 50, ... }
   ═══════════════════════════════════════════════════════════════════ */

import type { CrisisNeed, NeedCategory } from "./types";

/* ── Known Location Database ────────────────────────────────────── */

interface LocationEntry {
  keywords: string[];
  name: string;
  coordinates: [number, number];
}

const LOCATION_DB: LocationEntry[] = [
  { keywords: ["sector 7", "sector-7", "bihar"], name: "Sector 7, Bihar", coordinates: [25.6, 85.1] },
  { keywords: ["sector 3", "sector-3"], name: "Sector 3", coordinates: [25.62, 85.15] },
  { keywords: ["sector 12", "sector-12"], name: "Sector 12", coordinates: [25.58, 85.08] },
  { keywords: ["dhaka", "bangladesh"], name: "Dhaka, Bangladesh", coordinates: [23.81, 90.41] },
  { keywords: ["chennai", "tamil nadu"], name: "Chennai, India", coordinates: [13.08, 80.27] },
  { keywords: ["mumbai", "bombay"], name: "Mumbai, India", coordinates: [19.08, 72.88] },
  { keywords: ["delhi", "new delhi"], name: "Delhi, India", coordinates: [28.61, 77.21] },
  { keywords: ["kathmandu", "nepal"], name: "Kathmandu, Nepal", coordinates: [27.72, 85.32] },
  { keywords: ["colombo", "sri lanka"], name: "Colombo, Sri Lanka", coordinates: [6.93, 79.86] },
  { keywords: ["karachi", "pakistan"], name: "Karachi, Pakistan", coordinates: [24.86, 67.0] },
  { keywords: ["kolkata", "calcutta"], name: "Kolkata, India", coordinates: [22.57, 88.36] },
  { keywords: ["patna"], name: "Patna, India", coordinates: [25.61, 85.14] },
  { keywords: ["yangon", "myanmar", "burma"], name: "Yangon, Myanmar", coordinates: [16.87, 96.2] },
  { keywords: ["nairobi", "kenya"], name: "Nairobi, Kenya", coordinates: [-1.29, 36.82] },
  { keywords: ["lagos", "nigeria"], name: "Lagos, Nigeria", coordinates: [6.52, 3.38] },
  { keywords: ["accra", "ghana"], name: "Accra, Ghana", coordinates: [5.6, -0.19] },
];

/* ── Category Classification ────────────────────────────────────── */

interface CategoryPattern {
  category: NeedCategory;
  keywords: string[];
  weight: number; // higher = stronger signal
}

const CATEGORY_PATTERNS: CategoryPattern[] = [
  {
    category: "Water/Sanitation",
    keywords: ["water", "clean water", "drinking water", "sanitation", "wash", "contamination",
               "purification", "sewage", "hygiene", "latrine", "toilet", "well", "borehole",
               "waterborne", "dehydration", "flood", "flooding", "flooded"],
    weight: 10,
  },
  {
    category: "Medical/Health",
    keywords: ["medical", "medicine", "hospital", "clinic", "doctor", "nurse", "health",
               "injury", "injured", "disease", "outbreak", "cholera", "malaria", "epidemic",
               "pandemic", "vaccine", "surgical", "ambulance", "first aid", "trauma",
               "wound", "infection", "pregnant", "maternal"],
    weight: 10,
  },
  {
    category: "Food Security",
    keywords: ["food", "hunger", "famine", "nutrition", "malnutrition", "starving", "starvation",
               "ration", "grain", "rice", "supplies", "feeding", "meal", "kitchen", "harvest",
               "crop", "agricultural"],
    weight: 10,
  },
  {
    category: "Shelter",
    keywords: ["shelter", "housing", "tent", "tarp", "displaced", "displacement", "homeless",
               "camp", "refugee", "evacuate", "evacuation", "roof", "destroy", "destroyed",
               "collapse", "collapsed", "building", "structural"],
    weight: 10,
  },
  {
    category: "Protection",
    keywords: ["protection", "vulnerable", "child", "children", "women", "elderly", "violence",
               "trafficking", "abuse", "safety", "security", "gbv", "gender-based",
               "unaccompanied", "minor", "separated"],
    weight: 9,
  },
  {
    category: "Logistics",
    keywords: ["logistics", "transport", "supply chain", "road", "bridge", "route", "convoy",
               "delivery", "warehouse", "storage", "fuel", "vehicle", "helicopter", "airlift",
               "blocked", "blockage", "access"],
    weight: 8,
  },
  {
    category: "Search & Rescue",
    keywords: ["search", "rescue", "trapped", "missing", "survivor", "earthquake", "rubble",
               "debris", "landslide", "avalanche", "swift water", "extraction"],
    weight: 10,
  },
  {
    category: "Communication",
    keywords: ["communication", "radio", "satellite", "network", "internet", "phone",
               "signal", "coordination", "information", "connectivity"],
    weight: 7,
  },
  {
    category: "Education",
    keywords: ["education", "school", "teacher", "learning", "students", "classroom",
               "training", "literacy"],
    weight: 6,
  },
];

/* ── Urgency Detection ──────────────────────────────────────────── */

const URGENCY_KEYWORDS = {
  critical: [
    "urgent", "urgently", "emergency", "critical", "immediately", "life-threatening",
    "dying", "dead", "death", "collapse", "destroyed", "catastroph", "disaster",
    "desperate", "severe", "acute", "mass casualty", "outbreak", "epidemic",
    "imminent", "crisis",
  ],
  high: [
    "serious", "significant", "major", "escalating", "deteriorating", "overwhelmed",
    "overcrowded", "shortage", "displaced", "flood", "cyclone", "earthquake",
    "stranded", "cut off", "isolated", "dangerous",
  ],
  medium: [
    "concern", "growing", "moderate", "developing", "increasing", "monitoring",
    "possible", "anticipated", "planned", "needed", "required",
  ],
  low: [
    "stable", "improving", "minor", "routine", "maintenance", "preventive",
    "assessment", "reporting", "normal",
  ],
};

/* ── Population Extraction ──────────────────────────────────────── */

function extractPopulation(text: string): number {
  const lower = text.toLowerCase();

  // Match patterns like "50 families", "1,200 people", "3500 affected"
  const patterns = [
    /(\d[\d,]*)\s*(?:families|households)/i,
    /(\d[\d,]*)\s*(?:people|persons|individuals|residents|villagers|civilians)/i,
    /(\d[\d,]*)\s*(?:affected|displaced|homeless|stranded|trapped|injured|victims)/i,
    /population[:\s]*(\d[\d,]*)/i,
    /approximately\s*(\d[\d,]*)/i,
    /(?:about|around|nearly|over|more than)\s*(\d[\d,]*)/i,
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ""), 10);
      // If it says "families" or "households", multiply by avg family size
      if (/families|households/.test(match[0])) {
        return num * 5; // avg family = 5 people
      }
      return num;
    }
  }

  // Fallback: find any standalone number > 5 in the text
  const numbers = text.match(/\b(\d[\d,]*)\b/g);
  if (numbers) {
    for (const n of numbers) {
      const val = parseInt(n.replace(/,/g, ""), 10);
      if (val >= 5 && val <= 1000000) return val;
    }
  }

  return 0; // Unknown
}

/* ── Location Extraction ────────────────────────────────────────── */

function extractLocation(text: string): { name: string; coordinates: [number, number] } {
  const lower = text.toLowerCase();

  // Check sector pattern first: "Sector X" or "sector-X"
  const sectorMatch = text.match(/sector[\s-]*(\d+)/i);

  // Try known locations database
  for (const loc of LOCATION_DB) {
    for (const keyword of loc.keywords) {
      if (lower.includes(keyword)) {
        return { name: loc.name, coordinates: loc.coordinates };
      }
    }
  }

  // If we found a sector but not in DB, generate approximate location
  if (sectorMatch) {
    const sectorNum = parseInt(sectorMatch[1], 10);
    return {
      name: `Sector ${sectorNum}`,
      coordinates: [25.5 + sectorNum * 0.05, 85.0 + sectorNum * 0.03],
    };
  }

  // Try to find any capitalized phrase that looks like a place name
  const placeMatch = text.match(/(?:in|at|near|from)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/);
  if (placeMatch) {
    return {
      name: placeMatch[1],
      coordinates: [20 + Math.random() * 10, 75 + Math.random() * 15],
    };
  }

  return {
    name: "Unknown Location",
    coordinates: [22.0, 82.0], // Central India default
  };
}

/* ── Category Classification ────────────────────────────────────── */

function classifyCategory(text: string): NeedCategory {
  const lower = text.toLowerCase();
  let bestCategory: NeedCategory = "General";
  let bestScore = 0;

  for (const pattern of CATEGORY_PATTERNS) {
    let score = 0;
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        score += pattern.weight;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = pattern.category;
    }
  }

  return bestCategory;
}

/* ── Urgency Detection ──────────────────────────────────────────── */

function detectUrgency(text: string): "critical" | "high" | "medium" | "low" {
  const lower = text.toLowerCase();
  const scores = { critical: 0, high: 0, medium: 0, low: 0 };

  for (const [level, keywords] of Object.entries(URGENCY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        scores[level as keyof typeof scores] += 3;
      }
    }
  }

  // Boost urgency if population is large
  const pop = extractPopulation(text);
  if (pop > 1000) scores.critical += 2;
  else if (pop > 500) scores.high += 2;
  else if (pop > 100) scores.medium += 1;

  // Find highest scoring urgency
  let highest: "critical" | "high" | "medium" | "low" = "medium";
  let highestScore = 0;
  for (const [level, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      highest = level as typeof highest;
    }
  }

  return highest;
}

/* ═══════════════════════════════════════════════════════════════════
   Main Parser — parseNaturalLanguage
   ═══════════════════════════════════════════════════════════════════ */

export function parseNaturalLanguage(rawText: string): CrisisNeed {
  const location = extractLocation(rawText);
  const category = classifyCategory(rawText);
  const urgency = detectUrgency(rawText);
  const population = extractPopulation(rawText);

  // Generate a concise description
  const description = rawText.length > 200 ? rawText.slice(0, 197) + "..." : rawText;

  return {
    id: `need-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    rawText,
    location: location.name,
    coordinates: location.coordinates,
    category,
    urgency,
    population,
    description,
    timestamp: new Date().toISOString(),
    status: "active",
  };
}

/**
 * Parse multiple needs from a single block of text.
 * Splits on sentence boundaries and processes each chunk,
 * then deduplicates overlapping locations.
 */
export function parseMultipleNeeds(rawText: string): CrisisNeed[] {
  // If the text is short enough, treat as single need
  if (rawText.length < 100) {
    return [parseNaturalLanguage(rawText)];
  }

  // Try to split by clear separators
  const chunks = rawText
    .split(/(?:\n\n+|;\s*|\.\s+(?=[A-Z]))/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  if (chunks.length <= 1) {
    return [parseNaturalLanguage(rawText)];
  }

  // Parse each chunk and deduplicate by location
  const seen = new Set<string>();
  const results: CrisisNeed[] = [];

  for (const chunk of chunks) {
    const need = parseNaturalLanguage(chunk);
    const key = `${need.location}-${need.category}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push(need);
    }
  }

  return results;
}
