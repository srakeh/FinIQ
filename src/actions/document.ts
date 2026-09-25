"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase"; // Added Supabase client

// 1. The Save function (Unchanged)
export async function saveDocumentRecord(title: string, fileUrl: string, fileType: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const newDoc = await prisma.document.create({
      data: {
        title: title,
        fileUrl: fileUrl,
        fileType: fileType,
        userId: userId,
      },
    });
    
    revalidatePath("/dashboard");
    return { success: true, document: newDoc };
  } catch (error) {
    console.error("Save Document Error:", error);
    throw new Error("Failed to save document to database");
  }
}

// 2. The Delete function (Updated with Supabase Cleanup)
export async function deleteDocument(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // A. Find the document first to get its fileUrl
    const doc = await prisma.document.findUnique({
      where: { id: id, userId: userId },
    });

    if (!doc) throw new Error("Document not found");

    // B. Extract the exact filename from the Supabase public URL
    // Splits: https://[project].supabase.co/storage/v1/object/public/documents/filename.pdf
    const urlParts = doc.fileUrl.split('/public/documents/');
    
    if (urlParts.length === 2) {
      const fileName = urlParts[1];
      
      // C. Delete the physical file from the Supabase bucket
      const { error: storageError } = await supabase
        .storage
        .from('documents')
        .remove([fileName]);

      if (storageError) {
        console.error("Failed to delete from Supabase bucket:", storageError);
        // We log the error but proceed to clean up the database anyway so the UI doesn't break
      }
    }

    // D. Delete the record from PostgreSQL
    await prisma.document.delete({
      where: { 
        id: id,
        userId: userId 
      },
    });

    // Refresh the dashboard page instantly
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete document");
  }
}