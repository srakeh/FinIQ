"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

// We'll pass the documents down from the main dashboard page
export function ExportButton({ documents }: { documents: any[] }) {
  const handleExport = () => {
    try {
      if (documents.length === 0) {
        toast.error("No documents to export yet.");
        return;
      }

      // 1. Define the CSV column headers
      const headers = [
        "Document Title",
        "Date Uploaded",
        "Document Type",
        "Account Holder",
        "Net Income",
        "Tax Deductions",
        "Portfolio Value"
      ];
      
      // 2. Map through the database records and format them for CSV
      const rows = documents.map(doc => [
        `"${doc.title}"`,
        `"${new Date(doc.createdAt).toLocaleDateString()}"`,
        `"${doc.documentType || 'N/A'}"`,
        `"${doc.accountHolder || 'N/A'}"`,
        `"${doc.netIncome || 'N/A'}"`,
        `"${doc.taxDeductions || 'N/A'}"`,
        `"${doc.portfolioValue || 'N/A'}"`
      ]);

      // 3. Combine headers and rows with commas and line breaks
      const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      // 4. Create a temporary download link and trigger the browser download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "FinIQ_Financial_Data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Successfully exported data to CSV!");
    } catch (error) {
      toast.error("Failed to export data.");
    }
  };

  return (
    <button 
      onClick={handleExport} 
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-md text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}