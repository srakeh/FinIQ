import { Home, Building2, FileText, Settings, BrainCircuit, Lightbulb } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Our navigation links
const items = [
  { title: "Overview", url: "/dashboard", icon: Home },
  { title: "AI Advisor", url: "/dashboard/chat", icon: BrainCircuit },
  { title: "Recommendations", url: "/dashboard/recommendations", icon: Lightbulb },
  { title: "Startups", url: "/dashboard/startups", icon: Building2 },
  { title: "Documents", url: "/dashboard/documents", icon: FileText },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-500 font-bold tracking-wide">
            FinIQ Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} className="w-full block">
                    <SidebarMenuButton>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <UserButton showName />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}