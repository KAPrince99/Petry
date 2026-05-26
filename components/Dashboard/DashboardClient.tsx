"use client";

import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";
import { boardsQueryOptions } from "@/lib/react-query/board-queries";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteBoard } from "@/app/(mainapp)/actions/boardActions";
import { createBoardColumns } from "@/app/(mainapp)/actions/bothActions";
import { CreateFirstBoardCard } from "./CreateFirstBoardCard";
import { DashboardBoardsDnD } from "./DashboardBoardsDnD";
import { DashboardLoadingSkeleton } from "./DashboardLoadingSkeleton";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { NoBoardsMatchFilters } from "./NoBoardsMatchFilters";
import { Topbar } from "./Topbar";
import { UpgradeDialog } from "./UpgradeDialog";
import { DeleteBoardDialog } from "./DeleteBoardDialog";
import type { BoardItem } from "./types";

const EMPTY_BOARDS: BoardItem[] = [];
const IS_FREE_PLAN = false;
const FREE_BOARD_LIMIT = 1;

export function DashboardClient() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const search = useDashboardUiStore((s) => s.search);
  const openUpgradeDialog = useDashboardUiStore((s) => s.openUpgradeDialog);
  const boardToDelete = useDashboardUiStore((s) => s.boardToDelete);
  const closeDeleteBoard = useDashboardUiStore((s) => s.closeDeleteBoard);

  const [orderedBoards, setOrderedBoards] = useState<BoardItem[]>(
    () =>
      queryClient.getQueryData<BoardItem[]>(DASHBOARD_QUERY_KEYS.boards) ?? [],
  );
  const [activeBoard, setActiveBoard] = useState<BoardItem | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastOverId = useRef<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const { data, isPending } = useQuery({
    ...boardsQueryOptions(),
    placeholderData: () =>
      queryClient.getQueryData<BoardItem[]>(DASHBOARD_QUERY_KEYS.boards),
  });
  const boards = data ?? EMPTY_BOARDS;
  const isBoardsLoading = isPending && boards.length === 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedBoards((prev) => (prev === boards ? prev : boards));
  }, [boards]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const listSource = orderedBoards.length > 0 ? orderedBoards : boards;

  const filteredBoards = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return listSource;
    return listSource.filter((board) =>
      (board.title ?? "").toLowerCase().includes(q),
    );
  }, [listSource, search]);

  const dashboardStats = useMemo(
    () => [
      { label: "Total Boards", value: boards.length },
      { label: "Active Projects", value: boards.length },
      { label: "Workspace", value: user?.firstName ?? "Team" },
      { label: "Status", value: "Ready", active: true },
    ],
    [boards.length, user?.firstName],
  );

  const { mutate: createBoard, isPending: isCreatingBoard } = useMutation({
    mutationFn: async () =>
      createBoardColumns({
        title: "Untitled Board",
        description: "",
        color: "#3b82f6",
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.boards }),
  });

  const { mutate: removeBoard, isPending: isDeletingBoard } = useMutation({
    mutationFn: async (boardId: string) => deleteBoard(boardId),
    onMutate: async (boardId) => {
      await queryClient.cancelQueries({
        queryKey: DASHBOARD_QUERY_KEYS.boards,
      });
      const previous = queryClient.getQueryData<BoardItem[]>(
        DASHBOARD_QUERY_KEYS.boards,
      );
      setOrderedBoards((prev) => prev.filter((b) => b.id !== boardId));
      queryClient.setQueryData<BoardItem[]>(
        DASHBOARD_QUERY_KEYS.boards,
        (old) => (old ?? []).filter((b) => b.id !== boardId),
      );
      return { previous };
    },
    onError: (_err, _boardId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEYS.boards, context.previous);
        setOrderedBoards(context.previous);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.boards }),
  });

  const handleCreateBoard = useCallback(() => {
    if (IS_FREE_PLAN && boards.length >= FREE_BOARD_LIMIT) {
      openUpgradeDialog();
      return;
    }
    createBoard();
  }, [boards.length, createBoard, openUpgradeDialog]);

  const handleConfirmDelete = useCallback(() => {
    if (!boardToDelete) return;
    removeBoard(boardToDelete.id);
    closeDeleteBoard();
  }, [boardToDelete, closeDeleteBoard, removeBoard]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const board = filteredBoards.find(
        (b) => b.id === String(event.active.id),
      );
      if (board) setActiveBoard(board);
    },
    [filteredBoards],
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (lastOverId.current === overId) return;
    lastOverId.current = overId;
    setOrderedBoards((prev) => {
      const sourceIndex = prev.findIndex((b) => b.id === activeId);
      const destinationIndex = prev.findIndex((b) => b.id === overId);
      if (
        sourceIndex < 0 ||
        destinationIndex < 0 ||
        sourceIndex === destinationIndex
      )
        return prev;
      const next = [...prev];
      const [moving] = next.splice(sourceIndex, 1);
      next.splice(destinationIndex, 0, moving);
      return next;
    });
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    lastOverId.current = null;
    setActiveBoard(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;
    setOrderedBoards((prev) => {
      const sourceIndex = prev.findIndex((b) => b.id === activeId);
      const destinationIndex = prev.findIndex((b) => b.id === overId);
      if (sourceIndex < 0 || destinationIndex < 0) return prev;
      const next = [...prev];
      const [moving] = next.splice(sourceIndex, 1);
      next.splice(destinationIndex, 0, moving);
      return next;
    });
  }, []);

  return (
    <>
      {isBoardsLoading ? (
        <DashboardLoadingSkeleton includeTopbar />
      ) : (
        <>
          <Topbar onCreateBoard={handleCreateBoard} creating={isCreatingBoard} />

          <main className="flex-1 px-4 py-6 sm:px-6">
            <DashboardStatsGrid stats={dashboardStats} />

            {boards.length === 0 ? (
              <CreateFirstBoardCard onCreateBoard={handleCreateBoard} />
            ) : filteredBoards.length === 0 ? (
              <NoBoardsMatchFilters />
            ) : (
              <DashboardBoardsDnD
                boards={filteredBoards}
                isHydrated={isHydrated}
                activeBoard={activeBoard}
                deleting={isDeletingBoard}
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              />
            )}
          </main>
        </>
      )}

      <UpgradeDialog />
      <DeleteBoardDialog
        isDeletingBoard={isDeletingBoard}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}
