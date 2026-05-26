import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const COLUMN_COUNT = 4;
const TASKS_PER_COLUMN = 3;

function BoardColumnSkeleton() {
  return (
    <div className="flex max-h-[min(70vh,720px)] flex-col rounded-lg border border-border bg-card">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="min-h-0 flex-1 space-y-2 px-3 py-3">
        {Array.from({ length: TASKS_PER_COLUMN }).map((_, taskIndex) => (
          <div
            key={taskIndex}
            className="rounded-md border border-border bg-muted/50 p-3 dark:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <Skeleton className="mt-2 h-3 w-full" />
            <div className="mt-2 flex gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BoardLoadingSkeleton = memo(function BoardLoadingSkeleton() {
  return (
    <>
      <div
        className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm"
        aria-busy="true"
        aria-label="Loading board details"
      >
        <Skeleton className="mb-4 h-2 w-full rounded-full" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-8 w-48 max-w-full" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-2/3 max-w-sm" />
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-md" />
            ))}
          </div>
        </div>
      </div>

      <div className="my-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: COLUMN_COUNT }).map((_, columnIndex) => (
          <BoardColumnSkeleton key={columnIndex} />
        ))}
      </div>
    </>
  );
});
