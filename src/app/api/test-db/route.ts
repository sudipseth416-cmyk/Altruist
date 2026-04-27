import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════
   GET /api/test-db
   Debugging endpoint to verify MongoDB connectivity.
   ═══════════════════════════════════════════════════════════════════ */

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Attempt connection
    await connectDB();
    
    const dbState = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    return NextResponse.json({
      status: "connected",
      details: {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        state: states[dbState] || "unknown",
        latency: `${Date.now() - startTime}ms`,
        readyState: dbState
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("[NGO OS] DB Test Failed:", error.message);
    
    return NextResponse.json({
      status: "error",
      error: "Connection Failed",
      message: error.message,
      hint: "Check if MongoDB is running locally or if your Atlas IP is whitelisted (0.0.0.0/0).",
      env_present: !!process.env.MONGODB_URI
    }, { status: 500 });
  }
}
