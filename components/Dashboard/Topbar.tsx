"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { Grid3x3, List, Loader2, Plus, Search } from "lucide-react";
import { memo } from "react";

export type TopbarProps = {
  onCreateBoard: () => void;
  creating: boolean;
};

export const Topbar = memo(function Topbar({
  onCreateBoard,
  creating,
}: TopbarProps) {
  const viewMode = useDashboardUiStore((s) => s.viewMode);
  const search = useDashboardUiStore((s) => s.search);
  const setViewMode = useDashboardUiStore((s) => s.setViewMode);
  const setSearch = useDashboardUiStore((s) => s.setSearch);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        <h1 className="shrink-0 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Boards
        </h1>

        <div className="relative mx-2 min-w-0 flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search boards..."
            className="pl-9"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid3x3 className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="cursor-pointer"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="size-4" />
            </Button>
          </div>
          <Button
            onClick={onCreateBoard}
            disabled={creating}
            className="shrink-0 cursor-pointer gap-2 disabled:cursor-not-allowed"
          >
            {creating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Create Board
          </Button>
        </div>
      </div>
    </header>
  );
});
