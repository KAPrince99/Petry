"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FolderKanban, Settings, UserCircle2 } from "lucide-react";
import { memo } from "react";

function isBoardDetailPath(pathname: string): boolean {
  return /^\/dashboard\/[^/]+$/.test(pathname);
}

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const onBoardPage = isBoardDetailPath(pathname);

  return (
    <aside className="hidden border-r border-border bg-muted/40 lg:flex lg:w-64 lg:flex-col dark:bg-muted/20">
      <div className="border-b border-border px-5 py-[19px]">
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Petry
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {onBoardPage ? (
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow"
          >
            <ArrowLeft className="size-4 shrink-0" />
            Back to dashboard
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-border"
          >
            <FolderKanban className="size-4 text-muted-foreground" />
            Dashboard
          </Link>
        )}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-background hover:text-foreground"
        >
          <Settings className="size-4" />
          Settings
        </button>
      </nav>
      <div className="border-t border-border px-4 py-4">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-all hover:bg-background hover:text-foreground"
        >
          <UserCircle2 className="size-5" />
          Profile
        </button>
      </div>
    </aside>
  );
});
