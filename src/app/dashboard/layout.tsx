import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col min-h-screen">
        {/* A subtle header bar to hold the sidebar toggle button */}
        <div className="h-14 flex items-center border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-zinc-950">
          <SidebarTrigger />
        </div>
        {/* The actual page content loads below */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}