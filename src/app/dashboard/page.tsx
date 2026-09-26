import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DocumentCard } from "@/components/features/document-card";
import { ExportButton } from "@/components/features/export-button";
import { IndianRupee, TrendingDown, Wallet } from "lucide-react";

export default async function DashboardPage() {
  // 1. Authenticate the user
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 2. Fetch documents for this specific user directly from PostgreSQL
  const documents: any[] = await prisma.document.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Render the UI
  return (
    <main className="max-w-6xl mx-auto p-6">
      
      {/* UPDATED HEADER WITH EXPORT BUTTON */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Financial Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">
            Manage your financial documents and track AI-extracted insights.
          </p>
        </div>
        
        <ExportButton documents={documents} />
      </div>

      {documents.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-lg dark:border-zinc-800">
          <p className="text-zinc-500">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </main>
  );
}