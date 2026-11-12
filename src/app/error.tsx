"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, LayoutDashboard, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Application Error caught by root boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(239,68,68,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative max-w-lg w-full space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shadow-xl shadow-red-500/10">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            Runtime Exception
          </span>
          <h1 className="text-3xl font-extrabold text-white">
            An Unexpected System Error Occurred
          </h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            {error?.message || "FinIQ encountered an unhandled execution state while processing this request."}
          </p>
          {error?.digest && (
            <p className="text-xs font-mono text-zinc-500 pt-1">
              Error Digest: <span className="text-zinc-400 select-all">{error.digest}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry Execution
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto text-zinc-400 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        <div className="pt-6 text-xs text-zinc-600 font-mono">
          FINIQ_FAILSAFE &bull; AUTOMATIC CONTEXT RECOVERY ACTIVE
        </div>
      </div>
    </div>
  );
}
