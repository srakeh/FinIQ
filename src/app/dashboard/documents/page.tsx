import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentUploadButton } from "@/components/document-upload-button";

export default async function DocumentsPage() {
  // Secure the route
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="p-6 space-y-6 bg-zinc-50 min-h-full dark:bg-zinc-950">
      
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Financial Documents
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Securely store and manage unstructured pitch decks and cap tables.
          </p>
        </div>
        
        {/* THIS is where we put your new smart button component! */}
        <DocumentUploadButton />
      </div>

      {/* Empty State */}
      <Card className="border-dashed shadow-sm bg-zinc-50/50 dark:bg-zinc-900/50 dark:border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No documents uploaded</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-sm">
            You haven't uploaded any files to your data lake yet. Click the button above to ingest your first document.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}