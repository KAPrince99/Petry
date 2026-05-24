"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  rectIntersection,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { memo, useMemo } from "react";
import { SortableBoardCard } from "./SortableBoardCard";
import type { BoardItem } from "./types";

export type DashboardBoardsDnDProps = {
  boards: BoardItem[];
  isHydrated: boolean;
  activeBoard: BoardItem | null;
  deleting: boolean;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

export const DashboardBoardsDnD = memo(function DashboardBoardsDnD({
  boards,
  isHydrated,
  activeBoard,
  deleting,
  sensors,
  onDragStart,
  onDragOver,
  onDragEnd,
}: DashboardBoardsDnDProps) {
  const viewMode = useDashboardUiStore((s) => s.viewMode);
  const boardIds = useMemo(() => boards.map((b) => b.id), [boards]);

  const boardCards = useMemo(
    () =>
      boards.map((board) => (
        <SortableBoardCard
          key={board.id}
          board={board}
          isHydrated={isHydrated}
          deleting={deleting}
        />
      )),
    [boards, isHydrated, deleting],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={boardIds} strategy={verticalListSortingStrategy}>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{boardCards}</div>
        ) : (
          <div className="space-y-4">{boardCards}</div>
        )}
      </SortableContext>
      <DragOverlay>
        {activeBoard ? (
          <Card className="w-[320px] rounded-xl border border-border bg-card shadow-xl">
            <CardContent className="p-4">
              <CardTitle className="text-base">{activeBoard.title}</CardTitle>
              <CardDescription className="line-clamp-1">
                {activeBoard.description ?? ""}
              </CardDescription>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});
