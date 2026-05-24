"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type SensorDescriptor,
  type SensorOptions,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { memo, useCallback, useMemo } from "react";
import type { tasks } from "@/lib/supabase/models";
import { BoardDragOverlay } from "./BoardDragOverlay";
import { ColumnSection } from "./ColumnSection";
import type { BoardColumnWithTasks, FilteredBoardColumn } from "./types";

export type BoardKanbanProps = {
  filteredColumns: FilteredBoardColumn[];
  boardColumns: BoardColumnWithTasks[];
  activeFilterCount: number;
  isHydrated: boolean;
  activeTask: tasks | null;
  activeColumn: BoardColumnWithTasks | null;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
};

export const BoardKanban = memo(function BoardKanban({
  filteredColumns,
  boardColumns,
  activeFilterCount,
  isHydrated,
  activeTask,
  activeColumn,
  sensors,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
}: BoardKanbanProps) {
  const sortableColumnIds: UniqueIdentifier[] = useMemo(
    () => filteredColumns.map(({ column }) => `column-${column.id}`),
    [filteredColumns],
  );

  const collisionDetectionStrategy = useCallback(
    (args: Parameters<typeof pointerWithin>[0]) => {
      const pointer = pointerWithin(args);
      if (pointer.length > 0) return pointer;
      const rect = rectIntersection(args);
      if (rect.length > 0) return rect;
      return closestCorners(args);
    },
    [],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      autoScroll
    >
      <SortableContext items={sortableColumnIds} strategy={horizontalListSortingStrategy}>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {boardColumns.length === 0 ? (
            <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
              No columns found for this board.
            </div>
          ) : (
            filteredColumns.map(({ column, tasks: visibleTasks, total }) => (
              <ColumnSection
                key={column.id}
                column={column}
                visibleTasks={visibleTasks}
                total={total}
                activeFilterCount={activeFilterCount}
                isHydrated={isHydrated}
              />
            ))
          )}
        </div>
      </SortableContext>
      <DragOverlay>
        <BoardDragOverlay activeTask={activeTask} activeColumn={activeColumn} />
      </DragOverlay>
    </DndContext>
  );
});
