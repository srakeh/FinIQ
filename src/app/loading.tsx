import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
            <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-emerald-500/20 blur-sm pointer-events-none -z-10" />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold tracking-wide text-zinc-200">
            Synchronizing FinIQ Ledger
          </p>
          <p className="text-xs text-zinc-500 font-mono">
            ESTABLISHING SECURE PROTOCOL...
          </p>
        </div>
      </div>
    </div>
  );
}
