"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm text-muted-foreground opacity-60 ${className || ""}`}
        disabled
        aria-label="Loading theme"
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      onClick={toggleTheme}
      className={`relative h-9 px-2.5 rounded-lg border border-border/60 bg-card/60 backdrop-blur-md hover:bg-accent hover:border-orange-500/40 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-200 group ${className || ""}`}
      title={isDark ? "Switch to McLaren Alpine Light" : "Switch to McLaren Carbon Dark"}
      aria-label="Toggle color theme"
    >
      <div className="relative flex items-center justify-center">
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${
            isDark
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100 text-orange-500"
          }`}
        />
        <Moon
          className={`absolute h-4 w-4 transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100 text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(255,128,0,0.5)]"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-medium">
          {isDark ? "Carbon Dark" : "Alpine Light"}
        </span>
      )}
    </Button>
  );
}
