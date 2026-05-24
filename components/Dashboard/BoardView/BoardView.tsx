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
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { updateBoard } from "@/app/(mainapp)/actions/boardActions";
import { getBoardWithColumns } from "@/app/(mainapp)/actions/bothActions";
import { createTaskForBoard } from "@/app/(mainapp)/actions/taskActions";
import { BoardDetailsCard } from "./BoardDetailsCard";
import { BoardKanban } from "./BoardKanban";
import { BoardTaskFilterDialog } from "./BoardTaskFilterDialog";
import { BoardTaskStats } from "./BoardTaskStats";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { DEFAULT_BOARD_COLOR } from "./constants";
import { EditBoardDialog } from "./EditBoardDialog";
import type {
  BoardColumnWithTasks,
  BoardTaskFilters,
  BoardViewProps,
} from "./types";
import { useBoardDragHandlers } from "./useBoardDragHandlers";
import {
  activeTaskFilterCount,
  colorFromBoard,
  defaultTaskFilters,
  taskMatchesFilters,
} from "./utils";

function mutationErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  return error instanceof Error ? error.message : fallback;
}

export function BoardView({ board }: BoardViewProps) {
  const queryClient = useQueryClient();
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
    queryKey: DASHBOARD_QUERY_KEYS.board(board.id),
    queryFn: async () => {
      const result = await getBoardWithColumns(board.id);
      if (!result) {
        throw new Error("Board not found");
      }
      return result;
    },
    initialData: board,
  });

  const currentBoard = boardData ?? board;

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

  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(DEFAULT_BOARD_COLOR);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<BoardTaskFilters>(defaultTaskFilters);

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

  const handleFilterChange = useCallback(
    <K extends keyof BoardTaskFilters>(key: K, value: BoardTaskFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultTaskFilters());
  }, []);

  const closeFilterDialog = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const activeFilterCount = useMemo(
    () => activeTaskFilterCount(filters),
    [filters],
  );

  const filteredColumns = useMemo(
    () =>
      boardColumns.map((column) => ({
        column,
        tasks: column.tasks.filter((task) => taskMatchesFilters(task, filters)),
        total: column.tasks.length,
      })),
    [boardColumns, filters],
  );

  const resetFormFromBoard = useCallback(() => {
    setTitle(currentBoard.title?.trim() || "");
    setDescription(currentBoard.description?.trim() || "");
    setColor(colorFromBoard(currentBoard.color));
  }, [currentBoard.title, currentBoard.description, currentBoard.color]);

  const handleEditOpenChange = useCallback(
    (open: boolean) => {
      setEditOpen(open);
      if (open) {
        resetFormFromBoard();
      }
    },
    [resetFormFromBoard],
  );

  const handleCreateTaskOpenChange = useCallback((open: boolean) => {
    setIsCreateTaskOpen(open);
  }, []);

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
      setEditOpen(false);
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
      setIsCreateTaskOpen(false);
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
        title: title.trim() || "Untitled Board",
        description: description.trim() ? description.trim() : null,
        color,
      });
    },
    [color, description, resetUpdateBoardError, saveBoard, title],
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

  const boardActions = useMemo(
    () => (
      <>
        <BoardTaskFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          filters={filters}
          activeFilterCount={activeFilterCount}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          onApply={closeFilterDialog}
        />
        <EditBoardDialog
          open={editOpen}
          onOpenChange={handleEditOpenChange}
          title={title}
          description={description}
          color={color}
          submitError={submitError}
          isPending={isPending}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onColorChange={setColor}
          onSubmit={handleUpdateBoard}
        />
        <CreateTaskDialog
          open={isCreateTaskOpen}
          onOpenChange={handleCreateTaskOpenChange}
          taskSubmitError={taskSubmitError}
          isTaskPending={isTaskPending}
          onSubmit={handleCreateTask}
        />
      </>
    ),
    [
      activeFilterCount,
      clearFilters,
      closeFilterDialog,
      color,
      description,
      editOpen,
      filters,
      handleCreateTask,
      handleCreateTaskOpenChange,
      handleEditOpenChange,
      handleFilterChange,
      handleUpdateBoard,
      isCreateTaskOpen,
      isFilterOpen,
      isPending,
      isTaskPending,
      submitError,
      taskSubmitError,
      title,
    ],
  );

  return (
    <>
      <BoardDetailsCard board={currentBoard} actions={boardActions} />
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
