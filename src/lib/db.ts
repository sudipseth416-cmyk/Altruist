import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════
   NGO OS — Fixed MongoDB Connection Module
   ═══════════════════════════════════════════════════════════════════
   Features:
   - Singleton pattern to prevent multiple connections in Next.js dev.
   - Enhanced debugging logs.
   - Support for Atlas + Local.
   - Proper connection state tracking.
   ═══════════════════════════════════════════════════════════════════ */

const MONGODB_URI = process.env.MONGODB_URI || "";

/* ── Debug log for environment verification ── */
console.log("[NGO OS] MONGODB_URI detected:", MONGODB_URI ? "✓ Found (masked)" : "✗ NOT FOUND");

if (!MONGODB_URI) {
  console.warn(
    "[NGO OS] CRITICAL: MONGODB_URI is missing in .env.local. " +
    "Database features will be offline. Fallback to demo mode active."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* Use global cache to survive Next.js hot reloads (HMR) */
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

if (!globalWithMongoose._mongooseCache) {
  globalWithMongoose._mongooseCache = { conn: null, promise: null };
}

const cached = globalWithMongoose._mongooseCache;

export async function connectDB(): Promise<typeof mongoose> {
  /* 1. Already connected? Return cached connection */
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) return cached.conn;
    /* If connection was lost, reset cache */
    cached.conn = null;
  }

  /* 2. No URI? Throw error for API handlers to catch */
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }

  /* 3. Connection already in progress? Return existing promise */
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // Fast fail if DB is offline (2 seconds)
      connectTimeoutMS: 5000,
    };

    console.log("[NGO OS] Initiating database connection...");
    
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("[NGO OS] ✓ MongoDB connected successfully to:", m.connection.name);
        return m;
      })
      .catch((err) => {
        console.error("[NGO OS] ✗ MongoDB Connection Error:", err.message);
        cached.promise = null; // reset promise to allow retry
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err: any) {
    cached.promise = null;
    throw new Error(`Failed to connect to database: ${err.message}`);
  }

  return cached.conn;
}
