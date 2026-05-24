"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { memo } from "react";
import type { tasks } from "@/lib/supabase/models";
import { TaskCard } from "./TaskCard";
import type { BoardColumnWithTasks } from "./types";

export type ColumnSectionProps = {
  column: BoardColumnWithTasks;
  visibleTasks: tasks[];
  total: number;
  activeFilterCount: number;
  isHydrated?: boolean;
};

export const ColumnSection = memo(function ColumnSection({
  column,
  visibleTasks,
  total,
  activeFilterCount,
  isHydrated = false,
}: ColumnSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${column.id}`,
    data: { type: "column", columnId: column.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
    id: `column-drop-${column.id}`,
    data: { type: "column-drop", columnId: column.id },
  });

  const taskIds = visibleTasks.map((task) => `task-${task.id}`);
  const columnDndProps = isHydrated ? { ...attributes, ...listeners } : {};

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`flex max-h-[min(70vh,720px)] flex-col rounded-lg border border-border bg-card ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
      role="region"
      aria-label={`${column.title ?? "Untitled Column"} column`}
    >
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate font-semibold text-foreground">
              {column.title ?? "Untitled Column"}
            </h2>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {activeFilterCount > 0
                ? `${visibleTasks.length}/${total}`
                : total}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label={`Open options for ${column.title ?? "this column"}`}
            {...columnDndProps}
          >
            <Ellipsis className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setDropNodeRef}
          className={`min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3 ${
            isOver
              ? "rounded-b-lg bg-blue-50/40 ring-1 ring-inset ring-blue-200"
              : ""
          }`}
          role="list"
          aria-label={`Tasks in ${column.title ?? "column"}`}
        >
          {total === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          ) : visibleTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks match these filters.</p>
          ) : (
            visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                sortableDisabled={activeFilterCount > 0}
                isHydrated={isHydrated}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
});
