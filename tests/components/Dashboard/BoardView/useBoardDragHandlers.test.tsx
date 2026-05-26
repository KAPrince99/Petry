import { useBoardDragHandlers } from "@/components/Dashboard/BoardView/useBoardDragHandlers";
import { createColumn } from "@/tests/fixtures/board";
import { createTask } from "@/tests/fixtures/tasks";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import type { BoardColumnWithTasks } from "@/components/Dashboard/BoardView/types";

function useHarness(initial: BoardColumnWithTasks[]) {
  const [boardColumns, setBoardColumns] = useState(initial);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const handlers = useBoardDragHandlers({
    boardColumns,
    setBoardColumns,
    setActiveTaskId,
    setActiveColumnId,
  });

  return {
    boardColumns,
    activeTaskId,
    activeColumnId,
    ...handlers,
  };
}

describe("useBoardDragHandlers", () => {
  it("tracks active task on drag start", () => {
    const columns = [
      createColumn({
        id: "c1",
        tasks: [createTask({ id: "t1" })],
      }),
    ];

    const { result } = renderHook(() => useHarness(columns));

    act(() => {
      result.current.handleDragStart({
        active: {
          id: "task-t1",
          data: { current: { type: "task", taskId: "t1", columnId: "c1" } },
        },
      } as never);
    });

    expect(result.current.activeTaskId).toBe("t1");
    expect(result.current.activeColumnId).toBeNull();
  });

  it("clears active ids on drag cancel", () => {
    const { result } = renderHook(() =>
      useHarness([createColumn({ tasks: [createTask({ id: "t1" })] })]),
    );

    act(() => {
      result.current.handleDragStart({
        active: {
          id: "task-t1",
          data: { current: { type: "task", taskId: "t1", columnId: "c1" } },
        },
      } as never);
      result.current.handleDragCancel();
    });

    expect(result.current.activeTaskId).toBeNull();
    expect(result.current.activeColumnId).toBeNull();
  });

  it("reorders columns on column drag end", () => {
    const columns = [
      createColumn({ id: "c1", title: "One", sort_order: 0 }),
      createColumn({ id: "c2", title: "Two", sort_order: 1 }),
    ];

    const { result } = renderHook(() => useHarness(columns));

    act(() => {
      result.current.handleDragEnd({
        active: {
          id: "column-c1",
          data: { current: { type: "column", columnId: "c1" } },
        },
        over: {
          id: "column-c2",
          data: { current: { type: "column", columnId: "c2" } },
        },
      } as never);
    });

    expect(result.current.boardColumns.map((c) => c.id)).toEqual(["c2", "c1"]);
  });
});
