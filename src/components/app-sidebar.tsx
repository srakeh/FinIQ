import {
  Home,
  Building2,
  FileText,
  Settings,
  BrainCircuit,
  Lightbulb,
  GraduationCap,
  Globe,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import Link from "next/link";

// Our core dashboard navigation links
const items = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "AI Advisor", url: "/dashboard/chat", icon: BrainCircuit },
  { title: "Recommendations", url: "/dashboard/recommendations", icon: Lightbulb },
  { title: "Quizzes", url: "/dashboard/quiz", icon: GraduationCap },
  { title: "Startups", url: "/dashboard/startups", icon: Building2 },
  { title: "Documents", url: "/dashboard/documents", icon: FileText },
  { title: "Profile & Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar transition-colors">
      <SidebarHeader className="p-4 border-b border-sidebar-border/60">
        <Logo href="/" size="sm" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-500 font-bold tracking-wider uppercase text-[11px] px-2 py-2">
            Workstation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="w-full block">
                    <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-orange-500 dark:hover:text-orange-400 data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-500 transition-colors duration-150">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Public Portal Return Link */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/" className="w-full block">
                  <SidebarMenuButton className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
                    <Globe className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-xs">Public Homepage</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <UserButton showName />
        </div>
        <ThemeToggle className="shrink-0" />
      </SidebarFooter>
    </Sidebar>
  );
}
