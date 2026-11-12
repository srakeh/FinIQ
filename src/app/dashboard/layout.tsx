import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrainCircuit, Activity } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col min-h-screen min-w-0 overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
        {/* Subtle, highly responsive top navigation header */}
        <header className="h-14 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 px-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" />
            <div className="h-4 w-px bg-zinc-200 dark:border-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                FinIQ
              </span>
              <span className="hidden sm:inline text-xs font-normal text-zinc-400">
                / Financial Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden xs:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">Engine Active</span>
              <span className="sm:hidden">Live</span>
            </div>

            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
              title="Ask AI Financial Advisor"
            >
              <BrainCircuit className="w-4 h-4 text-emerald-500" />
              <span className="hidden md:inline">Advisor</span>
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <div className="flex-1 min-w-0 w-full overflow-y-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
