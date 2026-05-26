"use client";

import { memo, type FormEvent } from "react";
import { BoardTaskFilterDialog } from "./BoardTaskFilterDialog";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { DEFAULT_BOARD_COLOR } from "./constants";
import { EditBoardDialog } from "./EditBoardDialog";
import type { BoardViewBoard } from "./types";

export type BoardDetailsCardProps = {
  board: BoardViewBoard;
  isPending: boolean;
  onUpdateBoard: (e: FormEvent<HTMLFormElement>) => void;
  isTaskPending: boolean;
  onCreateTask: (e: FormEvent<HTMLFormElement>) => void;
};

export const BoardDetailsCard = memo(function BoardDetailsCard({
  board,
  isPending,
  onUpdateBoard,
  isTaskPending,
  onCreateTask,
}: BoardDetailsCardProps) {
  return (
    <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div
        className="mb-4 h-2 w-full rounded-full"
        style={{
          backgroundColor: board.color?.trim() || DEFAULT_BOARD_COLOR,
        }}
        aria-hidden
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {board.title ?? "Untitled Board"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {board.description?.trim() || "No description yet."}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <BoardTaskFilterDialog />
          <EditBoardDialog
            board={board}
            isPending={isPending}
            onSubmit={onUpdateBoard}
          />
          <CreateTaskDialog
            isTaskPending={isTaskPending}
            onSubmit={onCreateTask}
          />
        </div>
      </div>
    </div>
  );
});
