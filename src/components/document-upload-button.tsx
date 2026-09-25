"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { saveDocumentRecord } from "@/actions/document";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DocumentUploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Tracks if a file is hovering
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // The actual upload logic (extracted so both click and drop can use it)
  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || "unknown";
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      // 1. Upload to Supabase Data Lake
      const { error } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (error) throw error;

      // 2. Get the public download URL from Supabase
      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      // 3. Save the record to your PostgreSQL Database
      await saveDocumentRecord(file.name, publicUrlData.publicUrl, fileExt);

      alert("File successfully ingested into the data lake!");
      setIsOpen(false);
      router.refresh(); 
    } catch (error) {
      console.error(error);
      alert("Upload failed. Check the console.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Stops the browser from opening the PDF
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0]; // Catches the dropped file
    if (file) processFile(file);
  };

  return (
    <>
      {/* 1. The Trigger Button */}
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
      </Button>

      {/* 2. The Pop-Up Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Financial Document</DialogTitle>
            <DialogDescription>
              Select or drag a pitch deck, cap table, or financial report to securely add to your pipeline.
            </DialogDescription>
          </DialogHeader>
          
          {/* 3. The Drag & Drop Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg mt-2 transition-colors duration-200 ${
              isDragging 
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20" 
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
            }`}
          >
            <FileText className={`w-10 h-10 mb-4 ${isDragging ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700"}`} />
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.csv,.xlsx,.docx,.txt"
            />
            
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading}
              variant={isDragging ? "default" : "outline"}
              className={isDragging ? "bg-emerald-500 hover:bg-emerald-600 text-white pointer-events-none" : ""}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Uploading to Cloud..." : "Browse Local Files"}
            </Button>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 font-medium">
              {isDragging ? "Drop file to upload" : "Or drag and drop your file here"}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supported formats: PDF, CSV, XLSX, DOCX, TXT
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}