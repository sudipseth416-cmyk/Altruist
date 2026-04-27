import fs from "fs";
import path from "path";

/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Local JSON Persistence Fallback
   ═══════════════════════════════════════════════════════════════════
   This module provides a filesystem-based database that acts as a 
   seamless fallback when MongoDB is unavailable.
   ═══════════════════════════════════════════════════════════════════ */

const DATA_DIR = path.join(process.cwd(), "data");
const CASES_FILE = path.join(DATA_DIR, "cases.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure cases file exists
if (!fs.existsSync(CASES_FILE)) {
  fs.writeFileSync(CASES_FILE, JSON.stringify([], null, 2));
}

export const LocalDB = {
  /**
   * Get all cases
   */
  async getAll() {
    try {
      const data = fs.readFileSync(CASES_FILE, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("[LocalDB] Read Error:", err);
      return [];
    }
  },

  /**
   * Find case by ID
   */
  async findById(caseId: string) {
    const cases = await this.getAll();
    return cases.find((c: any) => c.caseId === caseId) || null;
  },

  /**
   * Create or Update a case
   */
  async save(caseData: any) {
    try {
      const cases = await this.getAll();
      const index = cases.findIndex((c: any) => c.caseId === caseData.caseId);
      
      const now = new Date().toISOString();
      const updatedData = {
        ...caseData,
        updatedAt: now,
        createdAt: caseData.createdAt || now
      };

      if (index !== -1) {
        cases[index] = updatedData;
      } else {
        cases.push(updatedData);
      }

      fs.writeFileSync(CASES_FILE, JSON.stringify(cases, null, 2));
      return updatedData;
    } catch (err) {
      console.error("[LocalDB] Save Error:", err);
      throw err;
    }
  }
};
