"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo } from "react";
import type { tasks } from "@/lib/supabase/models";
import { priorityBadgeClasses } from "./utils";

export type TaskCardProps = {
  task: tasks;
  columnId: string;
  sortableDisabled?: boolean;
  isHydrated?: boolean;
};

export const TaskCard = memo(function TaskCard({
  task,
  columnId,
  sortableDisabled = false,
  isHydrated = false,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
    data: { type: "task", taskId: task.id, columnId },
    disabled: sortableDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const enableDnD = isHydrated && !sortableDisabled;
  const dndProps = enableDnD ? { ...attributes, ...listeners } : {};

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-border bg-muted/50 p-3 text-sm shadow-sm dark:bg-muted/30 ${
        sortableDisabled
          ? ""
          : "cursor-grab touch-none select-none active:cursor-grabbing"
      } ${isDragging ? "border-dashed border-primary/40 bg-primary/10 opacity-40 dark:bg-primary/15" : ""}`}
      {...dndProps}
      role="listitem"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground">{task.title}</p>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${priorityBadgeClasses(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description?.trim() ? (
        <p className="mt-1 line-clamp-2 text-muted-foreground">{task.description}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {task.due_date ? <span>Due {task.due_date.slice(0, 10)}</span> : null}
        {task.assignee?.trim() ? <span>{task.assignee}</span> : null}
      </div>
    </article>
  );
});
