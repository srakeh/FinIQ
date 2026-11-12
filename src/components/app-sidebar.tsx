import {
  Home,
  Building2,
  FileText,
  Settings,
  BrainCircuit,
  Lightbulb,
  GraduationCap,
  Globe,
  Calculator,
  PieChart,
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

// Core dashboard navigation items grouped into venture categories
const primaryItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "AI Advisor", url: "/dashboard/chat", icon: BrainCircuit },
  { title: "Deal Recommendations", url: "/dashboard/recommendations", icon: Lightbulb },
];

const ventureItems = [
  { title: "Startups & Pipeline", url: "/dashboard/startups", icon: Building2 },
  { title: "Portfolio Allocator", url: "/dashboard/allocator", icon: PieChart },
  { title: "Cap Table Simulator", url: "/dashboard/calculator", icon: Calculator },
];

const resourceItems = [
  { title: "Academy Quizzes", url: "/dashboard/quiz", icon: GraduationCap },
  { title: "Document Vault", url: "/dashboard/documents", icon: FileText },
  { title: "Profile & Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar transition-colors">
      <SidebarHeader className="p-4 border-b border-sidebar-border/60">
        <Logo href="/" size="sm" />
      </SidebarHeader>

      <SidebarContent className="space-y-4">
        {/* Workstation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-500 font-bold tracking-wider uppercase text-[10px] px-2 py-1">
            Workstation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="w-full block">
                    <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-150">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Venture Capital */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-500 font-bold tracking-wider uppercase text-[10px] px-2 py-1">
            Venture & Deals
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ventureItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="w-full block">
                    <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-150">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Intelligence & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-bold tracking-wider uppercase text-[10px] px-2 py-1">
            Intelligence
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="w-full block">
                    <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-150">
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
