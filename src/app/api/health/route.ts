import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
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

  let dbStatus = "unchecked";
  let dbError = null;
  try {
    const count = await prisma.document.count();
    dbStatus = `connected (documents in db: ${count})`;
  } catch (err: any) {
    dbStatus = "failed";
    dbError = err?.message || String(err);
  }

  let storageStatus = "unchecked";
  let storageError = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        storageStatus = "error";
        storageError = error.message;
      } else {
        const docBucket = data?.find((b) => b.name === "documents");
        storageStatus = docBucket ? "connected ('documents' bucket found)" : "connected ('documents' bucket MISSING)";
      }
    } catch (err: any) {
      storageStatus = "failed";
      storageError = err?.message || String(err);
    }
  }

  const isHealthy = dbStatus.startsWith("connected") && storageStatus.startsWith("connected");

  return NextResponse.json({
    status: isHealthy ? "healthy" : "degraded",
    environment: envCheck,
    database: { status: dbStatus, error: dbError },
    storage: { status: storageStatus, error: storageError },
    timestamp: new Date().toISOString(),
  });
}
