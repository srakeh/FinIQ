"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw, Home, LifeBuoy } from "lucide-react";

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Module Error caught:", error);
  }, [error]);

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto my-8">
      <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-zinc-900/60 backdrop-blur-md p-8 shadow-xl shadow-black/40 text-center space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="h-14 w-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-md">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Module Telemetry Notice
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Module Encountered an Issue
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            {error?.message || "There was a problem synchronizing financial ledger data or loading this submodule."}
          </p>
          {error?.digest && (
            <p className="text-xs font-mono text-zinc-500 pt-1">
              Trace Digest: <span className="text-zinc-300 select-all">{error.digest}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCcw className="h-4 w-4" />
            Reload Module
          </Button>

          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 flex items-center gap-2 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Return to Overview
            </Button>
          </Link>

          <Link href="/dashboard/settings">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <LifeBuoy className="h-4 w-4" />
              System Diagnostics
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-zinc-800/60 text-xs text-zinc-500 flex items-center justify-between">
          <span>Module Isolation: Isolated to current route</span>
          <span className="font-mono">STATUS: 500_HANDLED</span>
        </div>
      </div>
    </div>
  );
}
