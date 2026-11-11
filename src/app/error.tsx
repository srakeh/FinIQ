"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Something went wrong
      </h2>
      <p className="text-zinc-500 max-w-md text-sm">
        {error?.message || "An unexpected error occurred while loading this page. Please try again."}
      </p>
      <Button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
