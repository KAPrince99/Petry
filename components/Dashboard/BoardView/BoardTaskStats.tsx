"use client";

import { memo } from "react";
import type { BoardViewBoard } from "./types";

export type BoardTaskStatsProps = {
  board: BoardViewBoard;
};

export const BoardTaskStats = memo(function BoardTaskStats({ board }: BoardTaskStatsProps) {
  const totalTasks = board.columns.reduce((sum, col) => sum + col.tasks.length, 0);

  return (
    <div className="my-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Total Tasks: </span>
          {totalTasks}
        </div>
      </div>
    </div>
  );
});
