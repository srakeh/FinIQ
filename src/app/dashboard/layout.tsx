import Link from "next/link";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrainCircuit } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col min-h-screen min-w-0 overflow-x-hidden bg-background text-foreground transition-colors duration-200">
        {/* Modern McLaren-tuned Top Navigation Bar */}
        <header className="h-14 flex items-center justify-between border-b border-border/60 px-4 bg-card/60 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1.5 transition-colors" />
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,128,0,0.8)]" />
                FinIQ
              </span>
              <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
                / Financial Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Telemetry Status Pill */}
            <div className="hidden xs:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="hidden sm:inline">Telemetry Active</span>
              <span className="sm:hidden">Live</span>
            </div>

            {/* AI Advisor Fast Link */}
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-orange-500 dark:hover:text-orange-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-accent border border-transparent hover:border-orange-500/20"
              title="Ask AI Financial Advisor"
            >
              <BrainCircuit className="w-4 h-4 text-orange-500" />
              <span className="hidden md:inline">Advisor</span>
            </Link>

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle />
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
