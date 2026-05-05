"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  /** Use segmented light / dark controls instead of a single cycle button */
  variant?: "switch" | "segmented";
};

export function ThemeToggle({ className, variant = "switch" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("inline-flex shrink-0", className)}>
        <Button variant="outline" size="icon" className="size-8" aria-hidden disabled />
      </div>
    );
  }

  if (variant === "segmented") {
    const lightActive = theme === "light" || (theme === "system" && resolvedTheme === "light");
    const darkActive = theme === "dark" || (theme === "system" && resolvedTheme === "dark");
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-lg border border-border bg-background p-1",
          className,
        )}
        role="group"
        aria-label="Theme"
      >
        <Button
          type="button"
          variant={lightActive ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2"
          onClick={() => setTheme("light")}
        >
          <Sun className="size-3.5" />
          <span className="sr-only">Light</span>
        </Button>
        <Button
          type="button"
          variant={darkActive ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2"
          onClick={() => setTheme("dark")}
        >
          <Moon className="size-3.5" />
          <span className="sr-only">Dark</span>
        </Button>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("size-8 shrink-0", className)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
