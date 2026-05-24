"use client";

import { memo, type ReactNode } from "react";
import { DEFAULT_BOARD_COLOR } from "./constants";
import type { BoardViewBoard } from "./types";

export type BoardDetailsCardProps = {
  board: BoardViewBoard;
  actions: ReactNode;
};

export const BoardDetailsCard = memo(function BoardDetailsCard({
  board,
  actions,
}: BoardDetailsCardProps) {
  return (
    <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div
        className="mb-4 h-2 w-full max-w-xs rounded-full"
        style={{
          backgroundColor: board.color?.trim() || DEFAULT_BOARD_COLOR,
        }}
        aria-hidden
      />
      <h1 className="text-2xl font-bold text-foreground">
        {board.title ?? "Untitled Board"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {board.description?.trim() || "No description yet."}
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-2">{actions}</div>
    </div>
  );
});
