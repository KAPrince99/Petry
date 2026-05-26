import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

const STAT_COUNT = 4;
const BOARD_COUNT = 6;

function DashboardStatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-23 rounded-md" />
      </div>
    </div>
  );
}

function DashboardBoardCardSkeleton() {
  return (
    <div className="h-full rounded-xl border border-border bg-card shadow-sm">
      <div className="space-y-4 p-5 pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="size-4 rounded ring-1 ring-border" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="size-7 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-5 w-3/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-5 pb-5 pt-0 sm:flex-row sm:justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export type DashboardLoadingSkeletonProps = {
  includeTopbar?: boolean;
};

export const DashboardLoadingSkeleton = memo(function DashboardLoadingSkeleton({
  includeTopbar = false,
}: DashboardLoadingSkeletonProps) {
  return (
    <>
      {includeTopbar ? (
        <header
          className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75"
          aria-hidden
        >
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6">
            <Skeleton className="h-8 w-24 shrink-0 sm:h-9 sm:w-28" />
            <div className="relative mx-2 min-w-0 max-w-md flex-1">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Skeleton className="h-9 w-[4.5rem] rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </header>
      ) : null}

      <div
        className="flex-1 px-4 py-6 sm:px-6"
        aria-busy="true"
        aria-label="Loading dashboard"
      >
        <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: STAT_COUNT }).map((_, i) => (
            <DashboardStatCardSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: BOARD_COUNT }).map((_, i) => (
            <DashboardBoardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
});
