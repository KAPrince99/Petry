import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid3x3, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import type { ViewMode } from "./types";

type TopbarProps = {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onOpenFilters: () => void;
  onCreateBoard: () => void;
  creating: boolean;
};

export function Topbar({
  viewMode,
  setViewMode,
  search,
  onSearchChange,
  onOpenFilters,
  onCreateBoard,
  creating,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Boards</h1>
            <p className="text-sm text-gray-500">Manage projects with clarity.</p>
          </div>
          <Button onClick={onCreateBoard} disabled={creating} className="gap-2">
            <Plus className="size-4" />
            {creating ? "Creating..." : "Create Board"}
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search boards..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
            </div>
            <Button variant="outline" onClick={onOpenFilters}>
              <SlidersHorizontal className="mr-1 size-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
