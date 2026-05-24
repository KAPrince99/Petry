"use client";

import { Button } from "@/components/ui/button";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { memo } from "react";

export const NoBoardsMatchFilters = memo(function NoBoardsMatchFilters() {
  const clearSearch = useDashboardUiStore((s) => s.clearSearch);

  return (
    <div className="space-y-3 py-10 text-center">
      <p className="text-muted-foreground">No boards match your search.</p>
      <Button variant="outline" onClick={clearSearch}>
        Clear search
      </Button>
    </div>
  );
});
