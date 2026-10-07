import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { DocumentCard } from "@/components/features/document-card";
import { ExportButton } from "@/components/features/export-button";
import { FinancialChart } from "@/components/features/financial-chart";
import { IndianRupee, TrendingDown, Wallet } from "lucide-react"; 

function parseCurrency(val: string | null) {
  if (!val || val === "N/A") return 0;
  const num = parseFloat(val.replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const documents: any[] = await prisma.document.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  const totalIncome = documents.reduce((acc: number, doc: any) => acc + parseCurrency(doc.netIncome), 0);
  const totalTaxes = documents.reduce((acc: number, doc: any) => acc + parseCurrency(doc.taxDeductions), 0);
  const analyzedCount = documents.filter((doc: any) => doc.netIncome).length;

  const formatINR = (num: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Financial Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage your financial documents and track AI-extracted insights.</p>
        </div>
        <ExportButton documents={documents} />
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 text-zinc-500 mb-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium">Total Net Income</h3>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatINR(totalIncome)}</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 text-zinc-500 mb-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-medium">Total Tax Deductions</h3>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{formatINR(totalTaxes)}</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 text-zinc-500 mb-2">
            <IndianRupee className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-medium">Documents Analyzed</h3>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{analyzedCount}</p>
        </div>
      </div>

      {/* Chart and Documents Grid */}
      {documents.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-lg dark:border-zinc-800">
          <p className="text-zinc-500">No documents uploaded yet.</p>
        </div>
      ) : (
        <>
          {/* Financial Chart — Income vs Taxes visualization */}
          <FinancialChart documents={documents} />
                  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}