"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  selectActiveFilterCount,
  useBoardUiStore,
} from "@/store/useBoardUiStore";
import { Filter } from "lucide-react";
import { memo } from "react";
import { PRIORITIES } from "./constants";

export const BoardTaskFilterDialog = memo(function BoardTaskFilterDialog() {
  const filterOpen = useBoardUiStore((s) => s.filterOpen);
  const filters = useBoardUiStore((s) => s.filters);
  const activeFilterCount = useBoardUiStore(selectActiveFilterCount);
  const setFilterOpen = useBoardUiStore((s) => s.setFilterOpen);
  const setFilter = useBoardUiStore((s) => s.setFilter);
  const clearFilters = useBoardUiStore((s) => s.clearFilters);
  const closeFilter = useBoardUiStore((s) => s.closeFilter);

  return (
    <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          aria-label={
            activeFilterCount > 0
              ? `Filter tasks, ${activeFilterCount} active`
              : "Filter tasks"
          }
        >
          <Filter className="mr-2 size-4 shrink-0" aria-hidden />
          <span>Filter tasks</span>
          {activeFilterCount > 0 ? (
            <Badge
              variant="secondary"
              className="ml-2 min-w-5 justify-center px-1.5 tabular-nums"
            >
              {activeFilterCount}
            </Badge>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            Filter tasks
            {activeFilterCount > 0 ? (
              <Badge variant="secondary" className="font-normal tabular-nums">
                {activeFilterCount} active
              </Badge>
            ) : null}
          </DialogTitle>
          <DialogDescription>Filter tasks by priority or due date.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((priority) => (
                <Button
                  key={priority}
                  type="button"
                  onClick={() => {
                    const newPriorities = filters.priority.includes(priority)
                      ? filters.priority.filter((p) => p !== priority)
                      : [...filters.priority, priority];
                    setFilter("priority", newPriorities);
                  }}
                  variant={filters.priority.includes(priority) ? "default" : "outline"}
                  size="sm"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={filters.dueDate || ""}
              onChange={(e) => setFilter("dueDate", e.target.value || null)}
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button type="button" onClick={closeFilter}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
