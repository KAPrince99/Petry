"use client";

import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { BoardColumnWithTasks, DragData } from "./types";

type UseBoardDragHandlersOptions = {
  boardColumns: BoardColumnWithTasks[];
  setBoardColumns: Dispatch<SetStateAction<BoardColumnWithTasks[]>>;
  setActiveTaskId: Dispatch<SetStateAction<string | null>>;
  setActiveColumnId: Dispatch<SetStateAction<string | null>>;
};

export function useBoardDragHandlers({
  boardColumns,
  setBoardColumns,
  setActiveTaskId,
  setActiveColumnId,
}: UseBoardDragHandlersOptions) {
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const data = event.active.data.current as DragData | undefined;

      if (data?.type === "task" && data.taskId) {
        const task = boardColumns
          .flatMap((col) => col.tasks)
          .find((t) => t.id === data.taskId);
        setActiveTaskId(task?.id ?? null);
        setActiveColumnId(null);
        return;
      }

      if (data?.type === "column" && data.columnId) {
        setActiveColumnId(data.columnId);
        setActiveTaskId(null);
      }
    },
    [boardColumns, setActiveColumnId, setActiveTaskId],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as DragData | undefined;
      const overData = over.data.current as DragData | undefined;

      if (activeData?.type !== "task" || !activeData.taskId) {
        return;
      }

      setBoardColumns((prev) => {
        const activeId = activeData.taskId as string;
        const overId =
          overData?.type === "task"
            ? (overData.taskId as string | undefined)
            : (over.id as string);
        if (!overId) return prev;

        const sourceColumnIndex = prev.findIndex((col) =>
          col.tasks.some((t) => t.id === activeId),
        );
        const destinationColumnIndex = prev.findIndex(
          (col) => col.id === overId || col.tasks.some((t) => t.id === overId),
        );
        if (sourceColumnIndex < 0 || destinationColumnIndex < 0) return prev;

        const sourceColumn = prev[sourceColumnIndex];
        const destinationColumn = prev[destinationColumnIndex];
        const movingIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId);
        if (movingIndex < 0) return prev;

        const overIndex = destinationColumn.tasks.findIndex((t) => t.id === overId);

        if (sourceColumnIndex === destinationColumnIndex) {
          if (overIndex < 0 || movingIndex === overIndex) return prev;
          const reordered = arrayMove(sourceColumn.tasks, movingIndex, overIndex);
          const next = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
          next[sourceColumnIndex].tasks = reordered;
          return next.map((col) => ({
            ...col,
            tasks: col.tasks.map((task, index) => ({
              ...task,
              sort_order: index,
            })),
          }));
        }

        const next = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
        const [movingTask] = next[sourceColumnIndex].tasks.splice(movingIndex, 1);
        movingTask.column_id = next[destinationColumnIndex].id;
        const insertAt =
          overIndex >= 0 ? overIndex : next[destinationColumnIndex].tasks.length;
        next[destinationColumnIndex].tasks.splice(insertAt, 0, movingTask);

        return next.map((col) => ({
          ...col,
          tasks: col.tasks.map((task, index) => ({ ...task, sort_order: index })),
        }));
      });
    },
    [setBoardColumns],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTaskId(null);
      setActiveColumnId(null);

      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as DragData | undefined;
      const overData = over.data.current as DragData | undefined;

      if (activeData?.type === "column" && overData?.type === "column") {
        if (active.id === over.id) return;
        setBoardColumns((prev) => {
          const oldIndex = prev.findIndex((col) => `column-${col.id}` === active.id);
          const newIndex = prev.findIndex((col) => `column-${col.id}` === over.id);
          if (oldIndex < 0 || newIndex < 0) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
        return;
      }

      if (activeData?.type !== "task" || !activeData.taskId) {
        return;
      }

      setBoardColumns((prev) => {
        const activeId = activeData.taskId as string;
        const overId =
          overData?.type === "task"
            ? (overData.taskId as string | undefined)
            : (over.id as string);
        if (!overId) return prev;

        const sourceColumnIndex = prev.findIndex((col) =>
          col.tasks.some((t) => t.id === activeId),
        );
        const destinationColumnIndex = prev.findIndex(
          (col) => col.id === overId || col.tasks.some((t) => t.id === overId),
        );
        if (sourceColumnIndex < 0 || destinationColumnIndex < 0) return prev;

        const next = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
        const sourceTasks = next[sourceColumnIndex].tasks;
        const movingIndex = sourceTasks.findIndex((t) => t.id === activeId);
        if (movingIndex < 0) return prev;

        const [movingTask] = sourceTasks.splice(movingIndex, 1);
        movingTask.column_id = next[destinationColumnIndex].id;

        const destinationTasks = next[destinationColumnIndex].tasks;
        const destinationIndex = destinationTasks.findIndex((t) => t.id === overId);

        destinationTasks.splice(
          destinationIndex >= 0 ? destinationIndex : destinationTasks.length,
          0,
          movingTask,
        );

        return next.map((col) => ({
          ...col,
          tasks: col.tasks.map((task, index) => ({ ...task, sort_order: index })),
        }));
      });
    },
    [setActiveColumnId, setActiveTaskId, setBoardColumns],
  );

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null);
    setActiveColumnId(null);
  }, [setActiveColumnId, setActiveTaskId]);

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
