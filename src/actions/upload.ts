"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service role key (bypasses RLS)
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^["']|["']$/g, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']|["']$/g, '');
  if (!url || !key) {
    throw new Error(
      `Supabase credentials missing in environment (URL: ${!!url}, SERVICE_ROLE_KEY: ${!!key}). Please configure SUPABASE_SERVICE_ROLE_KEY in Vercel settings.`
    );
  }
  return createClient(url, key);
}

export async function uploadDocument(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized. Please sign in." };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    const fileExt = file.name.split(".").pop() || "unknown";
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    const supabase = getServerSupabase();

    // Convert File to ArrayBuffer for server-side upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage (server-side, bypasses RLS)
    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) return { error: `Storage upload failed: ${error.message}` };

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    return {
      publicUrl: publicUrlData.publicUrl,
      fileExt,
    };
  } catch (err: any) {
    console.error("uploadDocument error:", err);
    return { error: err.message || "Failed to upload document" };
  }
}
