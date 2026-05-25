import { memo } from "react";

export const DashboardLoadingSkeleton = memo(function DashboardLoadingSkeleton() {
  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[4.25rem] animate-pulse rounded-lg border border-border bg-muted/50"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[180px] animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    </>
  );
});
