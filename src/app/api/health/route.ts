import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
  };

  // 1. PostgreSQL Database Ping & Latency Check
  let dbStatus = "unchecked";
  let dbLatencyMs = -1;
  let dbError: string | null = null;
  const dbStart = Date.now();
  try {
    const count = await prisma.document.count();
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = `connected (documents: ${count})`;
  } catch (err: any) {
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "failed";
    dbError = err?.message || String(err);
  }

  // 2. Supabase Storage Bucket Check
  let storageStatus = "unchecked";
  let storageLatencyMs = -1;
  let storageError: string | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const storageStart = Date.now();
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data, error } = await supabase.storage.listBuckets();
      storageLatencyMs = Date.now() - storageStart;

      if (error) {
        storageStatus = "error";
        storageError = error.message;
      } else {
        const docBucket = data?.find((b) => b.name === "documents");
        storageStatus = docBucket
          ? "connected ('documents' bucket verified)"
          : "connected ('documents' bucket missing)";
      }
    } catch (err: any) {
      storageLatencyMs = Date.now() - storageStart;
      storageStatus = "failed";
      storageError = err?.message || String(err);
    }
  }

  const isHealthy =
    dbStatus.startsWith("connected") && storageStatus.startsWith("connected");
  const totalDurationMs = Date.now() - startTime;

  const responsePayload = {
    status: isHealthy ? "healthy" : "degraded",
    application: "FinIQ Production API",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    responseDurationMs: totalDurationMs,
    environment: envCheck,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: dbError,
    },
    storage: {
      status: storageStatus,
      latencyMs: storageLatencyMs,
      error: storageError,
    },
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
