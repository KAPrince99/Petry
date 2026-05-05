import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BoardFilters } from "./types";

type FilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: BoardFilters;
  setFilters: (update: (prev: BoardFilters) => BoardFilters) => void;
  onClearFilters: () => void;
};

export function FilterDialog({
  open,
  onOpenChange,
  filters,
  setFilters,
  onClearFilters,
}: FilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Boards</DialogTitle>
          <p className="text-sm text-gray-600">Filter boards by title or last activity date.</p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filter-search">Search</Label>
            <Input
              id="filter-search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search board titles..."
            />
          </div>
          <div className="space-y-2">
            <Label>Date range (by last update)</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label className="text-xs">Start date</Label>
                <Input
                  type="date"
                  value={filters.dateRange.start ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value || null },
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">End date</Label>
                <Input
                  type="date"
                  value={filters.dateRange.end ?? ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value || null },
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
