"use client";

import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";
import { boardQueryOptions } from "@/lib/react-query/board-queries";
import {
  selectActiveFilterCount,
  useBoardUiStore,
} from "@/store/useBoardUiStore";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { updateBoard } from "@/app/(mainapp)/actions/boardActions";
import { createTaskForBoard } from "@/app/(mainapp)/actions/taskActions";
import { BoardDetailsCard } from "./BoardDetailsCard";
import { BoardKanban } from "./BoardKanban";
import { BoardTaskStats } from "./BoardTaskStats";
import type { BoardColumnWithTasks, BoardViewProps } from "./types";
import { useBoardDragHandlers } from "./useBoardDragHandlers";
import { taskMatchesFilters } from "./utils";

function mutationErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  return error instanceof Error ? error.message : fallback;
}

export function BoardView({ board }: BoardViewProps) {
  const queryClient = useQueryClient();
  const filters = useBoardUiStore((s) => s.filters);
  const activeFilterCount = useBoardUiStore(selectActiveFilterCount);
  const editTitle = useBoardUiStore((s) => s.editTitle);
  const editDescription = useBoardUiStore((s) => s.editDescription);
  const editColor = useBoardUiStore((s) => s.editColor);
  const closeEdit = useBoardUiStore((s) => s.closeEdit);
  const closeCreateTask = useBoardUiStore((s) => s.closeCreateTask);
  const setBoardScope = useBoardUiStore((s) => s.setBoardScope);
  const resetBoardUi = useBoardUiStore((s) => s.resetBoardUi);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { data: boardData } = useQuery({
    ...boardQueryOptions(board.id),
    initialData: board,
  });

  const currentBoard = boardData ?? board;

  useEffect(() => {
    setBoardScope(board.id);
    return () => resetBoardUi();
  }, [board.id, resetBoardUi, setBoardScope]);

  const [boardColumns, setBoardColumns] = useState<BoardColumnWithTasks[]>(
    currentBoard.columns,
  );
  const [columnsSnapshot, setColumnsSnapshot] = useState({
    boardId: currentBoard.id,
    columns: currentBoard.columns,
  });
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (
    currentBoard.id !== columnsSnapshot.boardId ||
    currentBoard.columns !== columnsSnapshot.columns
  ) {
    setColumnsSnapshot({
      boardId: currentBoard.id,
      columns: currentBoard.columns,
    });
    setBoardColumns(currentBoard.columns);
    setActiveTaskId(null);
    setActiveColumnId(null);
  }

  const filteredColumns = useMemo(
    () =>
      boardColumns.map((column) => ({
        column,
        tasks: column.tasks.filter((task) => taskMatchesFilters(task, filters)),
        total: column.tasks.length,
      })),
    [boardColumns, filters],
  );

  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel } =
    useBoardDragHandlers({
      boardColumns,
      setBoardColumns,
      setActiveTaskId,
      setActiveColumnId,
    });

  const activeTask = useMemo(() => {
    if (!activeTaskId) return null;
    for (const col of boardColumns) {
      const task = col.tasks.find((t) => t.id === activeTaskId);
      if (task) return task;
    }
    return null;
  }, [activeTaskId, boardColumns]);

  const activeColumn = useMemo(() => {
    if (!activeColumnId) return null;
    return boardColumns.find((col) => col.id === activeColumnId) ?? null;
  }, [activeColumnId, boardColumns]);

  const invalidateBoardQueries = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.board(board.id),
      }),
      queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.boards,
      }),
    ]);
  }, [board.id, queryClient]);

  const {
    mutate: saveBoard,
    isPending,
    error: updateBoardError,
    reset: resetUpdateBoardError,
  } = useMutation({
    mutationFn: (patch: {
      title: string;
      description: string | null;
      color: string;
    }) => updateBoard(board.id, patch),
    onSuccess: async () => {
      await invalidateBoardQueries();
      closeEdit();
    },
  });

  const {
    mutate: createTask,
    isPending: isTaskPending,
    error: createTaskError,
    reset: resetCreateTaskError,
  } = useMutation({
    mutationFn: (input: Parameters<typeof createTaskForBoard>[1]) =>
      createTaskForBoard(board.id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DASHBOARD_QUERY_KEYS.board(board.id),
      });
      closeCreateTask();
    },
  });

  const submitError = mutationErrorMessage(
    updateBoardError,
    "Could not save changes.",
  );
  const taskSubmitError = mutationErrorMessage(
    createTaskError,
    "Could not create task.",
  );

  const handleUpdateBoard = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      resetUpdateBoardError();
      saveBoard({
        title: editTitle.trim() || "Untitled Board",
        description: editDescription.trim() ? editDescription.trim() : null,
        color: editColor,
      });
    },
    [
      editColor,
      editDescription,
      editTitle,
      resetUpdateBoardError,
      saveBoard,
    ],
  );

  const handleCreateTask = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      resetCreateTaskError();
      const form = e.currentTarget;
      const fd = new FormData(form);
      const taskTitle = String(fd.get("title") ?? "");
      const taskDescription = String(fd.get("description") ?? "");
      const assignee = String(fd.get("assignee") ?? "");
      const dueDate = String(fd.get("dueDate") ?? "");
      const priority = String(fd.get("priority") ?? "medium");

      createTask(
        {
          title: taskTitle,
          description: taskDescription || null,
          assignee: assignee || null,
          dueDate: dueDate || null,
          priority:
            priority === "low" || priority === "high" || priority === "medium"
              ? priority
              : "medium",
        },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
    },
    [createTask, resetCreateTaskError],
  );

  return (
    <>
      <BoardDetailsCard
        board={currentBoard}
        submitError={submitError}
        isPending={isPending}
        onUpdateBoard={handleUpdateBoard}
        taskSubmitError={taskSubmitError}
        isTaskPending={isTaskPending}
        onCreateTask={handleCreateTask}
      />
      <BoardTaskStats board={currentBoard} />
      <BoardKanban
        filteredColumns={filteredColumns}
        boardColumns={boardColumns}
        activeFilterCount={activeFilterCount}
        isHydrated={isHydrated}
        activeTask={activeTask}
        activeColumn={activeColumn}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      />
    </>
  );
}
