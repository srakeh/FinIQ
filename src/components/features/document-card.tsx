"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, ExternalLink, Bot, Loader2, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { extractTextFromDocument } from "@/actions/analyze";
import { deleteDocument, saveDocumentAnalysis } from "@/actions/document";
import { toast } from "sonner";

interface AnalysisResult {
  documentType: string;
  accountHolder: string;
  netIncome: string;
  taxDeductions: string;
  portfolioValue: string;
}

interface DocumentProps {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: Date;
  fileType: string;
  netIncome?: string | null;
  taxDeductions?: string | null;
  documentType?: string | null;
  accountHolder?: string | null;
  portfolioValue?: string | null;
}

export function DocumentCard({ doc }: { doc: DocumentProps }) {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(
    doc.netIncome ? {
      documentType: doc.documentType || "",
      accountHolder: doc.accountHolder || "",
      netIncome: doc.netIncome || "",
      taxDeductions: doc.taxDeductions || "",
      portfolioValue: doc.portfolioValue || ""
    } : null
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const toastId = toast.loading("Analyzing document with Gemini AI...");
    
    try {
      const result = await extractTextFromDocument(doc.fileUrl);
      if (result.success && result.data) {
        setAnalysis(result.data);
        await saveDocumentAnalysis(doc.id, result.data);
        toast.success("Analysis complete! Data saved.", { id: toastId });
        
        router.refresh();
      }
    } catch (err: any) {
      console.error("Document analysis error:", err);
      toast.error(err?.message || "Failed to analyze document. Please try again.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting document...");
    try {
      await deleteDocument(doc.id);
      toast.success("Document deleted successfully", { id: toastId });
      
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document", { id: toastId });
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden bg-card border-border/70 rounded-2xl mclaren-card-hover shadow-sm">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{doc.title}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {new Date(doc.createdAt).toLocaleDateString()} • {doc.fileType.toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Open raw document"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
              title="Delete document"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {!analysis && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(255,128,0,0.25)] disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isAnalyzing ? "Extracting Data..." : "Analyze with AI"}
          </button>
        )}

        {analysis && (
          <div className="p-3.5 bg-background/60 rounded-xl border border-border/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(255,128,0,0.6)]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Financial Extraction
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Holder</span>
                <span className="font-semibold text-foreground truncate block">{analysis.accountHolder || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Type</span>
                <span className="font-semibold text-foreground truncate block">{analysis.documentType || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Net Income</span>
                <span className="font-bold font-mono tabular-nums text-foreground">{analysis.netIncome || "₹0"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Deductions</span>
                <span className="font-bold font-mono tabular-nums text-foreground">{analysis.taxDeductions || "₹0"}</span>
              </div>
              {analysis.portfolioValue && (
                <div className="col-span-2 pt-1 border-t border-border/60">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Portfolio Value</span>
                  <span className="font-bold font-mono tabular-nums text-orange-600 dark:text-orange-400">{analysis.portfolioValue}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
