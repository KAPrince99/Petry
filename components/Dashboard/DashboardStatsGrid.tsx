import { memo } from "react";
import { DashboardStatCard } from "./DashboardStatCard";

export type DashboardStatItem = {
  label: string;
  value: string | number;
  active?: boolean;
};

export type DashboardStatsGridProps = {
  stats: DashboardStatItem[];
};

export const DashboardStatsGrid = memo(function DashboardStatsGrid({
  stats,
}: DashboardStatsGridProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => (
        <DashboardStatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          active={stat.active}
        />
      ))}
    </div>
  );
});
