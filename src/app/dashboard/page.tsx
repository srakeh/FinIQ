import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import prisma from "@/lib/prisma";
import { DocumentCard } from "@/components/features/document-card";
import { ExportButton } from "@/components/features/export-button";
import { DocumentUploadButton } from "@/components/document-upload-button";
import { IndianRupee, TrendingDown, Wallet, AlertCircle, Sparkles } from "lucide-react"; 

// Dynamically import heavy Recharts visualization to reduce initial JS bundle size
const FinancialChart = dynamic(
  () => import("@/components/features/financial-chart").then((mod) => mod.FinancialChart),
  {
    loading: () => (
      <div className="h-[300px] w-full rounded-2xl bg-card border border-border/60 animate-pulse mb-8" />
    ),
  }
); 

function parseCurrency(val: string | null) {
  if (!val || val === "N/A") return 0;
  const num = parseFloat(val.replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
}

export const maxDuration = 60;

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let documents: any[] = [];
  let dbError: string | null = null;

  try {
    documents = await prisma.document.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error: any) {
    console.error("Dashboard database query error:", error);
    dbError = "Unable to connect to the database right now. Please check your database settings or try again shortly.";
  }

  const totalIncome = documents.reduce((acc: number, doc: any) => acc + parseCurrency(doc.netIncome), 0);
  const totalTaxes = documents.reduce((acc: number, doc: any) => acc + parseCurrency(doc.taxDeductions), 0);
  const analyzedCount = documents.filter((doc: any) => doc.netIncome).length;

  const formatINR = (num: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* DB Connection Notice if applicable */}
      {dbError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{dbError}</p>
        </div>
      )}

      {/* Header with Upload and Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-500">
              Portfolio Overview
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your financial documents and track AI-extracted metrics in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DocumentUploadButton />
          <ExportButton documents={documents} />
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-card border border-border/70 rounded-2xl shadow-sm mclaren-card-hover space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Net Income</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tabular-nums tracking-tight">
            {formatINR(totalIncome)}
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <span>Aggregated across verified filings</span>
          </p>
        </div>
        
        <div className="p-6 bg-card border border-border/70 rounded-2xl shadow-sm mclaren-card-hover space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tax Deductions</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tabular-nums tracking-tight">
            {formatINR(totalTaxes)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Section 80C, 80D, and capital deductions
          </p>
        </div>

        <div className="p-6 bg-card border border-border/70 rounded-2xl shadow-sm mclaren-card-hover space-y-2">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Documents Analyzed</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tabular-nums tracking-tight">
            {analyzedCount}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Processed via Gemini 3.1 Flash-Lite
          </p>
        </div>
      </div>

      {/* Chart and Documents Grid */}
      {documents.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-border rounded-2xl space-y-4 bg-card/40">
          <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            No documents uploaded yet. Start by uploading a financial statement, payslip, or cap table to analyze with AI!
          </p>
          <div className="inline-block pt-2">
            <DocumentUploadButton />
          </div>
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
