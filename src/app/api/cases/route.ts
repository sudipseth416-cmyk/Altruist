import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CaseModel from "@/lib/case-model";
import { LocalDB } from "@/lib/local-db";

/* ═══════════════════════════════════════════════════════════════════
   GET /api/cases
   List all humanitarian cases.
   Fallback: If MongoDB is offline, uses LocalDB (JSON persistence).
   ═══════════════════════════════════════════════════════════════════ */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    try {
      // 1. Try MongoDB
      await connectDB();
      const query = statusFilter ? { status: statusFilter } : {};
      const cases = await CaseModel.find(query).sort({ createdAt: -1 });
      
      return NextResponse.json({ 
        cases, 
        total: cases.length, 
        source: "mongodb" 
      }, { status: 200 });

    } catch (dbErr) {
      // 2. Fallback to LocalDB
      console.warn("[NGO OS] MongoDB Offline — Falling back to LocalDB Persistence");
      let cases = await LocalDB.getAll();
      
      if (statusFilter) {
        cases = cases.filter((c: any) => c.status === statusFilter);
      }
      
      // Sort by date descending
      cases.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return NextResponse.json({ 
        cases, 
        total: cases.length, 
        source: "local-file",
        isMock: true 
      }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
