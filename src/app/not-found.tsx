import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, LayoutDashboard, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

      <div className="relative max-w-lg w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl shadow-black/40 text-emerald-400">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            HTTP 404 &bull; Missing Node
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Page Not Found
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            The requested investment route, startup record, or financial intelligence ledger could not be located or may have been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Platform Home
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-xs text-zinc-600 font-mono">
          FINIQ_ROUTER_EXCEPTION: 0x404_PAGE_UNREACHABLE
        </div>
      </div>
    </div>
  );
}
