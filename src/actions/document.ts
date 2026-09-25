"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase"; 

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

// 2. The Delete function 
export async function deleteDocument(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // A. Use findFirst to safely check both id and userId
    const doc = await prisma.document.findFirst({
      where: { id: id, userId: userId },
    });

    if (!doc) throw new Error("Document not found");

    // B. Extract the exact filename from the Supabase public URL
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
      }
    }

    // D. Delete the record from PostgreSQL (only requires id since we verified ownership above)
    await prisma.document.delete({
      where: { id: id },
    });

    // Refresh the dashboard page instantly
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete document");
  }
}

// 3. The Analytics Save function
export async function saveDocumentAnalysis(id: string, analysisData: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Use updateMany so we can safely filter by both id and userId 
    await prisma.document.updateMany({
      where: { id: id, userId: userId },
      data: {
        documentType: analysisData.documentType,
        accountHolder: analysisData.accountHolder,
        netIncome: analysisData.netIncome,
        taxDeductions: analysisData.taxDeductions,
        portfolioValue: analysisData.portfolioValue,
      },
    });
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to save analysis:", error);
    throw new Error("Database update failed");
  }
}