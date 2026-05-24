import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { memo } from "react";

const ACTIVE_STATUS_VALUES = new Set(["ready", "active", "online"]);

export type DashboardStatCardProps = {
  label: string;
  value: string | number;
  active?: boolean;
};

export const DashboardStatCard = memo(function DashboardStatCard({
  label,
  value,
  active,
}: DashboardStatCardProps) {
  const isNumber = typeof value === "number";
  const isStatus = label === "Status";
  const isActive =
    isStatus &&
    (active ??
      (typeof value === "string" &&
        ACTIVE_STATUS_VALUES.has(value.toLowerCase())));

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-0">
        <p className="min-w-0 truncate text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <div
          className={cn(
            "flex h-9 w-23 shrink-0 items-center justify-center gap-1.5 rounded-md px-2",
            isStatus
              ? isActive
                ? "bg-emerald-500/12"
                : "bg-amber-500/12"
              : "bg-muted/70",
          )}
        >
          {isStatus ? (
            <>
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  isActive ? "bg-emerald-500" : "bg-amber-500",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "truncate text-md font-semibold",
                  isActive
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-700 dark:text-amber-400",
                )}
              >
                {value}
              </span>
            </>
          ) : (
            <span
              className={cn(
                "truncate font-semibold",
                isNumber ? "text-sm tabular-nums" : "text-sm",
              )}
            >
              {value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
