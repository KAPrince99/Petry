"use client";

import { memo } from "react";
import type { tasks } from "@/lib/supabase/models";
import type { BoardColumnWithTasks } from "./types";
import { priorityBadgeClasses } from "./utils";

export type BoardDragOverlayProps = {
  activeTask: tasks | null;
  activeColumn: BoardColumnWithTasks | null;
};

export const BoardDragOverlay = memo(function BoardDragOverlay({
  activeTask,
  activeColumn,
}: BoardDragOverlayProps) {
  if (activeTask) {
    return (
      <article className="w-[280px] scale-[1.02] rounded-md border border-border bg-card p-3 text-sm shadow-2xl">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-foreground">{activeTask.title}</p>
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${priorityBadgeClasses(activeTask.priority)}`}
          >
            {activeTask.priority}
          </span>
        </div>
      </article>
    );
  }

  if (activeColumn) {
    return (
      <section className="w-[280px] scale-[1.01] rounded-lg border border-border bg-card p-3 shadow-2xl">
        <h2 className="truncate font-semibold text-foreground">
          {activeColumn.title ?? "Untitled Column"}
        </h2>
      </section>
    );
  }

  return null;
});
