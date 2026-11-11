"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto p-8 my-12 text-center space-y-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
      <div className="h-14 w-14 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        Dashboard failed to load completely
      </h2>
      <p className="text-zinc-500 text-sm max-w-md mx-auto">
        {error?.message || "There was an issue connecting to the database or loading your data."}
      </p>
      <div className="pt-2">
        <Button
          onClick={() => reset()}
          className="inline-flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Reload Dashboard
        </Button>
      </div>
    </div>
  );
}
