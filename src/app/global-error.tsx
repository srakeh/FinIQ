"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Layout Critical Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 antialiased font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">System Critical Exception</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The root layout failed to initialize. Please reload the application or restart your session.
            </p>
            {error?.digest && (
              <p className="text-xs font-mono text-zinc-500">
                Digest: <span className="text-zinc-400">{error.digest}</span>
              </p>
            )}
          </div>

          <div>
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold text-sm transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
