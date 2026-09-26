"use client";

import { useState } from "react";
import { FileText, ExternalLink, Bot, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { extractTextFromDocument } from "@/actions/analyze";
import { deleteDocument, saveDocumentAnalysis } from "@/actions/document";
import { toast } from "sonner"; // 1. Import toast

interface AnalysisResult {
  documentType: string;
  accountHolder: string;
  netIncome: string;
  taxDeductions: string;
  portfolioValue: string;
}

// ... DocumentProps interface remains exactly the same ...
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
    // 2. Trigger loading toast
    const toastId = toast.loading("Analyzing document with Gemini AI...");
    
    try {
      const result = await extractTextFromDocument(doc.fileUrl);
      if (result.success && result.data) {
        setAnalysis(result.data);
        await saveDocumentAnalysis(doc.id, result.data);
        // 3. Update to success toast
        toast.success("Analysis complete! Data saved.", { id: toastId });
      }
    } catch (err) {
      // 4. Update to error toast
      toast.error("Failed to analyze document. Please try again.", { id: toastId });
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete document", { id: toastId });
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow dark:border-zinc-800">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{doc.title}</p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">
              {new Date(doc.createdAt).toLocaleDateString()} • {doc.fileType.toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
              <ExternalLink className="h-4 w-4 text-zinc-500" />
            </a>
            <button onClick={handleDelete} disabled={isDeleting} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-500 hover:text-red-600 rounded-md transition-colors">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-red-600" /> : <Trash2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {!analysis && (
          <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 transition-colors dark:bg-zinc-50 dark:text-zinc-900">
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
            {isAnalyzing ? "Extracting Data..." : "Analyze with AI"}
          </button>
        )}

        {analysis && (
          <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">Financial Extraction</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-zinc-500 block">Account Holder</span><span className="font-medium text-zinc-900 dark:text-zinc-50">{analysis.accountHolder}</span></div>
              <div><span className="text-zinc-500 block">Document</span><span className="font-medium text-zinc-900 dark:text-zinc-50">{analysis.documentType}</span></div>
              <div><span className="text-zinc-500 block">Net Income</span><span className="font-medium text-zinc-900 dark:text-zinc-50">{analysis.netIncome}</span></div>
              <div><span className="text-zinc-500 block">Tax Deductions</span><span className="font-medium text-zinc-900 dark:text-zinc-50">{analysis.taxDeductions}</span></div>
              <div className="col-span-2 mt-1"><span className="text-zinc-500 block">Portfolio Value</span><span className="text-zinc-700 dark:text-zinc-300">{analysis.portfolioValue}</span></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}