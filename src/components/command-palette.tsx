"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Home,
  BrainCircuit,
  Lightbulb,
  GraduationCap,
  Building2,
  FileText,
  Settings,
  Globe,
  Sun,
  Moon,
  UploadCloud,
  BarChart3,
  Sparkles,
  ArrowRight,
  Calculator,
  PieChart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Navigation" | "Actions" | "AI Advisor";
  action: () => void;
  badge?: string;
}

export function CommandPalette({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // Global keydown listener for Cmd + K or Ctrl + K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateTo = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  const commands: CommandItem[] = React.useMemo(
    () => [
      // Navigation
      {
        id: "nav-overview",
        title: "Portfolio Overview",
        subtitle: "Executive financial dashboard and metrics",
        icon: Home,
        category: "Navigation",
        action: () => navigateTo("/dashboard"),
      },
      {
        id: "nav-advisor",
        title: "AI Financial Advisor",
        subtitle: "Ask questions grounded in your financial documents",
        icon: BrainCircuit,
        category: "Navigation",
        badge: "AI",
        action: () => navigateTo("/dashboard/chat"),
      },
      {
        id: "nav-recommendations",
        title: "Deal Recommendations",
        subtitle: "Matchmaker for angel investments & deal flow",
        icon: Lightbulb,
        category: "Navigation",
        action: () => navigateTo("/dashboard/recommendations"),
      },
      {
        id: "nav-allocator",
        title: "Portfolio Allocator & Power Law",
        subtitle: "AngelList-style fund constructor, check sizing & reserve ratios",
        icon: PieChart,
        category: "Navigation",
        badge: "New",
        action: () => navigateTo("/dashboard/allocator"),
      },
      {
        id: "nav-calculator",
        title: "SAFE & Cap Table Simulator",
        subtitle: "Model valuation caps, dilution, and exit waterfalls",
        icon: Calculator,
        category: "Navigation",
        badge: "Tool",
        action: () => navigateTo("/dashboard/calculator"),
      },
      {
        id: "nav-quiz",
        title: "Angel Investor Academy",
        subtitle: "Interactive financial quizzes on SAFEs & valuations",
        icon: GraduationCap,
        category: "Navigation",
        action: () => navigateTo("/dashboard/quiz"),
      },
      {
        id: "nav-analytics",
        title: "Quiz Mastery Analytics",
        subtitle: "Historical learning curves and category scores",
        icon: BarChart3,
        category: "Navigation",
        action: () => navigateTo("/dashboard/quiz/analytics"),
      },
      {
        id: "nav-startups",
        title: "Startup Directory",
        subtitle: "Track portfolio startups and add new investments",
        icon: Building2,
        category: "Navigation",
        action: () => navigateTo("/dashboard/startups"),
      },
      {
        id: "nav-documents",
        title: "Document Vault",
        subtitle: "View and manage parsed PDFs, CSVs, and statements",
        icon: FileText,
        category: "Navigation",
        action: () => navigateTo("/dashboard/documents"),
      },
      {
        id: "nav-settings",
        title: "Profile & Settings",
        subtitle: "Investor check size, sector interests, and data export",
        icon: Settings,
        category: "Navigation",
        action: () => navigateTo("/dashboard/settings"),
      },
      {
        id: "nav-home",
        title: "Public Landing Page",
        subtitle: "Return to FinIQ marketing homepage",
        icon: Globe,
        category: "Navigation",
        action: () => navigateTo("/"),
      },
      // Actions
      {
        id: "act-theme",
        title: `Switch to ${resolvedTheme === "dark" ? "Alpine Light" : "Carbon Dark"} Mode`,
        subtitle: "Toggle between McLaren high-performance themes",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        category: "Actions",
        action: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          setOpen(false);
        },
      },
      {
        id: "act-upload",
        title: "Upload Financial Document",
        subtitle: "Ingest a new balance sheet, statement, or cap table",
        icon: UploadCloud,
        category: "Actions",
        badge: "Ingest",
        action: () => navigateTo("/dashboard"),
      },
    ],
    [resolvedTheme]
  );

  // Filter commands by query
  const filtered = React.useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Handle keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filtered.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      } else if (query.trim()) {
        // Direct query to chat
        navigateTo(`/dashboard/chat?prompt=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  return (
    <>
      {/* Trigger Button displayed in Header */}
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/70 bg-card/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-orange-500/40 hover:bg-accent transition-all duration-150 ${triggerClassName || ""}`}
        title="Open Command Palette (Cmd + K)"
      >
        <Search className="w-3.5 h-3.5 text-orange-500" />
        <span className="hidden sm:inline">Search or jump to...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-background/80 border border-border rounded text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Floating Modal Command Palette */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="p-0 max-w-xl overflow-hidden bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl rounded-2xl gap-0"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">Command Palette</DialogTitle>

          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/70">
            <Search className="w-4 h-4 text-orange-500 shrink-0" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command, search pages, or ask FinIQ Advisor..."
              className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[11px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded bg-muted font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="mx-auto w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Ask FinIQ Advisor: &quot;{query}&quot;
                </p>
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to launch this financial query in Advisor Chat.
                </p>
                <button
                  onClick={() =>
                    navigateTo(
                      `/dashboard/chat?prompt=${encodeURIComponent(query.trim())}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Ask Advisor <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? "bg-orange-500/15 text-foreground border border-orange-500/30 shadow-sm"
                        : "text-foreground hover:bg-accent/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected
                            ? "bg-orange-500 text-white shadow-[0_0_10px_rgba(255,128,0,0.5)]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold truncate">
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-500 uppercase tracking-wide">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-muted/30 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Navigate:</span>
              <kbd className="px-1 py-0.5 rounded bg-card border text-[10px] font-mono">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-card border text-[10px] font-mono">↓</kbd>
            </div>
            <div className="flex items-center gap-2">
              <span>Execute:</span>
              <kbd className="px-1 py-0.5 rounded bg-card border text-[10px] font-mono">↵</kbd>
            </div>
            <div className="flex items-center gap-2">
              <span>Close:</span>
              <kbd className="px-1 py-0.5 rounded bg-card border text-[10px] font-mono">esc</kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
