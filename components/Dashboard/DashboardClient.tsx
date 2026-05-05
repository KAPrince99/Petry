"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteBoard, getBoards } from "@/app/(mainapp)/actions/boardActions";
import { createBoardColumns } from "@/app/(mainapp)/actions/bothActions";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SortableBoardCard } from "./SortableBoardCard";
import { FilterDialog } from "./FilterDialog";
import { UpgradeDialog } from "./UpgradeDialog";
import { DeleteBoardDialog } from "./DeleteBoardDialog";
import type { BoardFilters, BoardItem, ViewMode } from "./types";

const defaultFilters: BoardFilters = { search: "", dateRange: { start: null, end: null } };
const EMPTY_BOARDS: Awaited<ReturnType<typeof getBoards>> = [];
const IS_FREE_PLAN = false;
const FREE_BOARD_LIMIT = 1;

export function DashboardClient() {
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<BoardItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [orderedBoards, setOrderedBoards] = useState<BoardItem[]>([]);
  const [activeBoard, setActiveBoard] = useState<BoardItem | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const lastOverId = useRef<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const { data } = useQuery({ queryKey: DASHBOARD_QUERY_KEYS.boards, queryFn: getBoards });
  const boards = data ?? EMPTY_BOARDS;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderedBoards((prev) => (prev === boards ? prev : boards));
  }, [boards]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  const filteredBoards = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return orderedBoards.filter((board) => {
      const title = (board.title ?? "").toLowerCase();
      if (q && !title.includes(q)) return false;
      const boardDate = new Date(board.updated_at || board.created_at);
      if (filters.dateRange.start) {
        const start = new Date(filters.dateRange.start);
        start.setHours(0, 0, 0, 0);
        if (boardDate < start) return false;
      }
      if (filters.dateRange.end) {
        const end = new Date(filters.dateRange.end);
        end.setHours(23, 59, 59, 999);
        if (boardDate > end) return false;
      }
      return true;
    });
  }, [orderedBoards, filters]);

  const { mutate: createBoard, isPending } = useMutation({
    mutationFn: async () => createBoardColumns({ title: "Untitled Board", description: "", color: "#3b82f6" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.boards }),
  });

  const { mutate: removeBoard, isPending: isDeletingBoard } = useMutation({
    mutationFn: async (boardId: string) => deleteBoard(boardId),
    onMutate: async (boardId) => {
      await queryClient.cancelQueries({ queryKey: DASHBOARD_QUERY_KEYS.boards });
      const previous = queryClient.getQueryData<BoardItem[]>(DASHBOARD_QUERY_KEYS.boards);
      setOrderedBoards((prev) => prev.filter((b) => b.id !== boardId));
      queryClient.setQueryData<BoardItem[]>(DASHBOARD_QUERY_KEYS.boards, (old) => (old ?? []).filter((b) => b.id !== boardId));
      return { previous };
    },
    onError: (_err, _boardId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DASHBOARD_QUERY_KEYS.boards, context.previous);
        setOrderedBoards(context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.boards }),
  });

  const handleCreateBoard = () => {
    if (IS_FREE_PLAN && boards.length >= FREE_BOARD_LIMIT) {
      setShowUpgradeDialog(true);
      return;
    }
    createBoard();
  };

  const clearFilters = () => setFilters(defaultFilters);
  const handleDeleteBoard = (board: BoardItem) => {
    setBoardToDelete(board);
    setDeleteConfirmText("");
  };
  const handleConfirmDelete = () => {
    if (!boardToDelete) return;
    removeBoard(boardToDelete.id);
    setBoardToDelete(null);
    setDeleteConfirmText("");
  };

  const handleDragStart = (event: DragStartEvent) => {
    const board = filteredBoards.find((b) => b.id === String(event.active.id));
    if (board) setActiveBoard(board);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (lastOverId.current === overId) return;
    lastOverId.current = overId;
    setOrderedBoards((prev) => {
      const sourceIndex = prev.findIndex((b) => b.id === activeId);
      const destinationIndex = prev.findIndex((b) => b.id === overId);
      if (sourceIndex < 0 || destinationIndex < 0 || sourceIndex === destinationIndex) return prev;
      const next = [...prev];
      const [moving] = next.splice(sourceIndex, 1);
      next.splice(destinationIndex, 0, moving);
      return next;
    });
  };
  const handleDragEnd = (event: DragEndEvent) => {
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
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            viewMode={viewMode}
            setViewMode={setViewMode}
            search={filters.search}
            onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            onOpenFilters={() => setIsFilterOpen(true)}
            onCreateBoard={handleCreateBoard}
            creating={isPending}
          />

          <main className="flex-1 px-4 py-6 sm:px-6">
            <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              <Card className="border-border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">Total Boards</p>
                  <p className="mt-1 text-2xl font-semibold">{boards.length}</p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">Active Projects</p>
                  <p className="mt-1 text-2xl font-semibold">{boards.length}</p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">Workspace</p>
                  <p className="mt-1 text-2xl font-semibold">{user?.firstName ?? "Team"}</p>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <p className="mt-1 text-2xl font-semibold">Ready</p>
                </CardContent>
              </Card>
            </div>

            {boards.length === 0 ? (
              <Card
                className="cursor-pointer border-2 border-dashed border-muted-foreground/35 hover:border-primary/60"
                onClick={handleCreateBoard}
              >
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2">
                  <Plus className="size-7 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Create your first board</p>
                </CardContent>
              </Card>
            ) : filteredBoards.length === 0 ? (
              <div className="space-y-3 py-10 text-center">
                <p className="text-muted-foreground">No boards match your filters.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredBoards.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredBoards.map((board) => <SortableBoardCard key={board.id} board={board} isHydrated={isHydrated} onDelete={handleDeleteBoard} deleting={isDeletingBoard} />)}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBoards.map((board) => <SortableBoardCard key={board.id} board={board} isHydrated={isHydrated} onDelete={handleDeleteBoard} deleting={isDeletingBoard} />)}
                    </div>
                  )}
                </SortableContext>
                <DragOverlay>
                  {activeBoard ? (
                    <Card className="w-[320px] rounded-xl border border-border bg-card shadow-xl">
                      <CardContent className="p-4">
                        <CardTitle className="text-base">{activeBoard.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{activeBoard.description ?? ""}</CardDescription>
                      </CardContent>
                    </Card>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </main>
        </div>
      </div>

      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        setFilters={setFilters}
        onClearFilters={clearFilters}
      />

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        onViewPlans={() => router.push("/")}
      />

      <DeleteBoardDialog
        boardToDelete={boardToDelete}
        deleteConfirmText={deleteConfirmText}
        onDeleteConfirmTextChange={setDeleteConfirmText}
        isDeletingBoard={isDeletingBoard}
        onOpenChange={(open) => {
          if (!open) {
            setBoardToDelete(null);
            setDeleteConfirmText("");
          }
        }}
        onCancel={() => {
          setBoardToDelete(null);
          setDeleteConfirmText("");
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
