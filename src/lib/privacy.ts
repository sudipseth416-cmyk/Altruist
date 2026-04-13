/**
 * Privacy Protection Module — NGO OS
 *
 * Masks personal identifiable information (PII) in text:
 * - Personal names → "User_XXX"
 * - Phone numbers → "📞 [REDACTED]"
 * - Email addresses → "✉️ [REDACTED]"
 *
 * Uses a curated list of common first names across multiple regions
 * and replaces them with anonymized identifiers like "User_102".
 */

/* ═══════════════════════════════════════════════════════════════════
   Common first names (multi-regional, partial — extend as needed)
   ═══════════════════════════════════════════════════════════════════ */
const COMMON_NAMES = new Set([
  // South Asian
  "ravi", "priya", "amit", "sunita", "rahul", "anita", "suresh", "deepa",
  "vijay", "meena", "rajesh", "kavita", "sanjay", "neha", "arun", "pooja",
  "manoj", "rekha", "kumar", "geeta", "ashok", "suman", "ramesh", "lata",
  "mohan", "rita", "gopal", "kamla", "hari", "sita", "krishna", "radha",
  "dinesh", "rani", "prakash", "kiran", "sunil", "nisha", "mukesh", "savita",
  "mahesh", "uma", "pawan", "manju", "naresh", "asha", "lalit", "usha",
  "rohit", "swati", "gaurav", "divya", "nitin", "shweta", "varun", "sneha",
  "arjun", "sakshi", "tushar", "tanvi", "akash", "kriti", "harsh", "pallavi",
  "ananya", "lakshmi",

  // African
  "amina", "kwame", "fatima", "omar", "zainab", "ibrahim", "aisha", "yusuf",
  "halima", "musa", "khadija", "ali", "mariam", "hassan", "safiya", "adam",
  "hawa", "abdi", "fanta", "moussa", "aminata", "oumar", "fatoumata", "bakary",
  "adama", "sekou", "djénéba", "mamadou", "kadiatou", "boubacar", "oumou", "cheick",
  "kofi", "ama", "akua", "yaa", "adjoa", "efua", "abena", "afua", "amara",

  // Middle Eastern
  "ahmed", "mohammad", "layla", "yasmin", "tariq", "nour", "khalid", "sara",
  "hamza", "lina", "karim", "hana", "bilal", "dina", "jamal", "rania",
  "samir", "maya", "faisal", "dalal", "nabil", "nisreen", "waleed", "amal",

  // Latin American
  "maria", "jose", "juan", "ana", "carlos", "rosa", "pedro", "lucia",
  "miguel", "carmen", "jorge", "elena", "francisco", "isabel", "antonio", "teresa",
  "roberto", "patricia", "rafael", "claudia", "fernando", "adriana", "alejandro", "gabriela",

  // East Asian
  "wei", "ming", "ling", "hui", "jing", "yan", "lei", "xiao",
  "yuki", "kenji", "yumi", "takeshi", "sakura", "hiroshi", "ayumi", "chen",

  // Common English
  "john", "james", "mary", "sarah", "michael", "david", "lisa", "jennifer",
  "robert", "william", "jessica", "susan", "thomas", "daniel", "nancy", "karen",
  "mark", "paul", "linda", "betty", "peter", "george", "helen", "sandra",
  "andrew", "steven", "donna", "carol", "edward", "brian", "sharon", "michelle",
  "emma", "olivia", "noah", "liam", "sophia", "ava", "jane", "alice",
]);

/* ═══════════════════════════════════════════════════════════════════
   Name Masking Engine
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Simple hash to generate a consistent numeric ID from a name,
 * so the same name always maps to the same User_XXX identifier.
 */
function nameToId(name: string): number {
  let hash = 0;
  const lower = name.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    hash = (hash * 31 + lower.charCodeAt(i)) & 0x7fffffff;
  }
  return 100 + (hash % 900); // Range: User_100 to User_999
}

/**
 * Masks any recognized personal name in the given text.
 * Names are matched as whole words (case-insensitive) and
 * replaced with "User_XXX" where XXX is a deterministic ID.
 */
export function maskNames(text: string): string {
  if (!text) return text;
  return text.replace(/\b[A-Za-zÀ-ÿ]+\b/g, (match) => {
    if (COMMON_NAMES.has(match.toLowerCase())) {
      return `User_${nameToId(match)}`;
    }
    return match;
  });
}

/* ═══════════════════════════════════════════════════════════════════
   Phone Number Masking
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Detects and masks phone numbers in multiple international formats:
 * +91-98765-43210, +1 (555) 123-4567, 09876543210, etc.
 */
export function maskPhoneNumbers(text: string): string {
  if (!text) return text;

  // International format: +XX-XXXX-XXXXXX, +XX XXXX XXXXXX
  let masked = text.replace(
    /\+?\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{2,5}[\s-]?\d{2,6}/g,
    "📞 [REDACTED]"
  );

  // Local format with leading 0: 09876543210
  masked = masked.replace(
    /\b0\d{9,12}\b/g,
    "📞 [REDACTED]"
  );

  return masked;
}

/* ═══════════════════════════════════════════════════════════════════
   Email Masking
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Detects and masks email addresses.
 */
export function maskEmails(text: string): string {
  if (!text) return text;
  return text.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "✉️ [REDACTED]"
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Combined PII Masking
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Apply all PII masking to a single text string.
 * Order matters: emails first (contain dots that might interfere),
 * then phones, then names.
 */
export function maskAllPII(text: string): string {
  if (!text) return text;
  let result = maskEmails(text);
  result = maskPhoneNumbers(result);
  result = maskNames(result);
  return result;
}

/**
 * Apply name masking to all text fields in an AnalysisResult object.
 * This runs server-side before the results are sent to the client.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function maskAnalysisResult<T>(result: T): T {
  if (result === null || result === undefined || typeof result !== "object") {
    return result;
  }

  const masked = { ...result } as Record<string, unknown>;

  for (const key of Object.keys(masked)) {
    const value = masked[key];

    if (typeof value === "string") {
      masked[key] = maskAllPII(value);
    } else if (Array.isArray(value)) {
      masked[key] = value.map((item) => {
        if (typeof item === "string") return maskAllPII(item);
        if (typeof item === "object" && item !== null) {
          return maskAnalysisResult(item);
        }
        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskAnalysisResult(value);
    }
  }

  return masked as T;
}

/** Summary of what was masked (for UI display) */
export interface PIIMaskingSummary {
  namesCount: number;
  phonesCount: number;
  emailsCount: number;
  totalRedacted: number;
}

/**
 * Analyze text and return a count of PII items found (without masking).
 */
export function countPII(text: string): PIIMaskingSummary {
  if (!text) return { namesCount: 0, phonesCount: 0, emailsCount: 0, totalRedacted: 0 };

  let namesCount = 0;
  let phonesCount = 0;
  let emailsCount = 0;

  // Count emails
  const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  emailsCount = emailMatches?.length ?? 0;

  // Count phones
  const phoneMatches = text.match(/\+?\d{1,3}[\s-]?\(?\d{1,4}\)?[\s-]?\d{2,5}[\s-]?\d{2,6}/g);
  phonesCount = phoneMatches?.length ?? 0;

  // Count names
  const words = text.match(/\b[A-Za-zÀ-ÿ]+\b/g) || [];
  for (const w of words) {
    if (COMMON_NAMES.has(w.toLowerCase())) namesCount++;
  }

  return {
    namesCount,
    phonesCount,
    emailsCount,
    totalRedacted: namesCount + phonesCount + emailsCount,
  };
}
