import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-border bg-muted/40 px-10 py-12 lg:flex lg:flex-col lg:justify-between dark:bg-muted/25 xl:px-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-foreground transition-opacity hover:opacity-80"
          >
            <span className="text-3xl font-semibold tracking-tight">Petry</span>
          </Link>

          <div className="max-w-lg space-y-4">
            <p className="text-base font-medium text-muted-foreground">Project management, simplified</p>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground xl:text-6xl">
              Work clearly with Petry.
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to continue, or create an account to get started.
            </p>
          </div>

          <Link href="/" className="text-base text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6 lg:right-10 lg:top-10">
            <ThemeToggle variant="segmented" />
          </div>
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-lg sm:p-7 dark:shadow-black/20">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
