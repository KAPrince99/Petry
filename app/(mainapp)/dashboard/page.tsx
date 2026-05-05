"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS, getBoardRoute } from "@/lib/dashboard/constants";
import { FolderKanban, Grid3x3, List, Plus, Search, Settings, SlidersHorizontal, Trash2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteBoard, getBoards } from "../actions/boardActions";
import { createBoardColumns } from "../actions/bothActions";

type ViewMode = "grid" | "list";
type BoardItem = Awaited<ReturnType<typeof getBoards>>[number];
type BoardFilters = { search: string; dateRange: { start: string | null; end: string | null } };

const defaultFilters: BoardFilters = { search: "", dateRange: { start: null, end: null } };
const EMPTY_BOARDS: Awaited<ReturnType<typeof getBoards>> = [];
const IS_FREE_PLAN = false;
const FREE_BOARD_LIMIT = 1;

function Sidebar() {
  return (
    <aside className="hidden border-r border-gray-200 bg-gray-50/80 lg:flex lg:w-64 lg:flex-col">
      <div className="border-b border-gray-200 px-5 py-5">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-900">Petry</Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200">
          <FolderKanban className="size-4 text-gray-600" /> Boards
        </Link>
        <button type="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all hover:bg-white hover:text-gray-900">
          <Settings className="size-4" /> Settings
        </button>
      </nav>
      <div className="border-t border-gray-200 px-4 py-4">
        <button type="button" className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-600 transition-all hover:bg-white hover:text-gray-900">
          <UserCircle2 className="size-5" /> Profile
        </button>
      </div>
    </aside>
  );
}

function Topbar({ viewMode, setViewMode, search, onSearchChange, onOpenFilters, onCreateBoard, creating }: { viewMode: ViewMode; setViewMode: (v: ViewMode) => void; search: string; onSearchChange: (v: string) => void; onOpenFilters: () => void; onCreateBoard: () => void; creating: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Boards</h1>
            <p className="text-sm text-gray-500">Manage projects with clarity.</p>
          </div>
          <Button onClick={onCreateBoard} disabled={creating} className="gap-2"><Plus className="size-4" />{creating ? "Creating..." : "Create Board"}</Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search boards..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}><Grid3x3 className="size-4" /></Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}><List className="size-4" /></Button>
            </div>
            <Button variant="outline" onClick={onOpenFilters}><SlidersHorizontal className="mr-1 size-4" />Filter</Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function SortableBoardCard({
  board,
  isHydrated,
  onDelete,
  deleting,
}: {
  board: BoardItem;
  isHydrated: boolean;
  onDelete: (board: BoardItem) => void;
  deleting: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: board.id, disabled: !isHydrated });
  const dndProps = isHydrated ? { ...attributes, ...listeners } : {};
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...dndProps}>
      <Link href={getBoardRoute(board.id)}>
        <Card className="group h-full rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-4 rounded ring-1 ring-black/10" style={{ backgroundColor: board.color ?? "#3b82f6" }} />
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">Board</Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-gray-500 hover:text-red-600"
                  disabled={deleting}
                  aria-label={`Delete ${board.title ?? "board"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(board);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <CardTitle className="mb-2 text-base group-hover:text-blue-600">{board.title}</CardTitle>
            <CardDescription className="mb-4 line-clamp-2 text-sm">{board.description ?? "No description yet."}</CardDescription>
            <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:justify-between">
              <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
              <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

export default function DashBoard() {
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.boards });
    },
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
    <div className="min-h-screen bg-white text-gray-900">
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
              <Card className="border-gray-200 shadow-sm"><CardContent className="p-4"><p className="text-xs font-medium text-gray-500">Total Boards</p><p className="mt-1 text-2xl font-semibold">{boards.length}</p></CardContent></Card>
              <Card className="border-gray-200 shadow-sm"><CardContent className="p-4"><p className="text-xs font-medium text-gray-500">Active Projects</p><p className="mt-1 text-2xl font-semibold">{boards.length}</p></CardContent></Card>
              <Card className="border-gray-200 shadow-sm"><CardContent className="p-4"><p className="text-xs font-medium text-gray-500">Workspace</p><p className="mt-1 text-2xl font-semibold">{user?.firstName ?? "Team"}</p></CardContent></Card>
              <Card className="border-gray-200 shadow-sm"><CardContent className="p-4"><p className="text-xs font-medium text-gray-500">Status</p><p className="mt-1 text-2xl font-semibold">Ready</p></CardContent></Card>
            </div>

            {boards.length === 0 ? (
              <Card className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400" onClick={handleCreateBoard}>
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2"><Plus className="size-7 text-gray-400" /><p className="text-sm text-gray-600">Create your first board</p></CardContent>
              </Card>
            ) : filteredBoards.length === 0 ? (
              <div className="space-y-3 py-10 text-center"><p className="text-gray-600">No boards match your filters.</p><Button variant="outline" onClick={clearFilters}>Clear filters</Button></div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredBoards.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredBoards.map((board) => (
                        <SortableBoardCard
                          key={board.id}
                          board={board}
                          isHydrated={isHydrated}
                          onDelete={handleDeleteBoard}
                          deleting={isDeletingBoard}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBoards.map((board) => (
                        <SortableBoardCard
                          key={board.id}
                          board={board}
                          isHydrated={isHydrated}
                          onDelete={handleDeleteBoard}
                          deleting={isDeletingBoard}
                        />
                      ))}
                    </div>
                  )}
                </SortableContext>
                <DragOverlay>
                  {activeBoard ? (
                    <Card className="w-[320px] rounded-xl border border-gray-200 bg-white shadow-xl"><CardContent className="p-4"><CardTitle className="text-base">{activeBoard.title}</CardTitle><CardDescription className="line-clamp-1">{activeBoard.description ?? ""}</CardDescription></CardContent></Card>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </main>
        </div>
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader><DialogTitle>Filter Boards</DialogTitle><p className="text-sm text-gray-600">Filter boards by title or last activity date.</p></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="filter-search">Search</Label><Input id="filter-search" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} placeholder="Search board titles..." /></div>
            <div className="space-y-2">
              <Label>Date range (by last update)</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div><Label className="text-xs">Start date</Label><Input type="date" value={filters.dateRange.start ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value || null } }))} /></div>
                <div><Label className="text-xs">End date</Label><Input type="date" value={filters.dateRange.end ?? ""} onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value || null } }))} /></div>
              </div>
            </div>
            <div className="flex justify-between pt-4"><Button variant="outline" onClick={clearFilters}>Clear filters</Button><Button onClick={() => setIsFilterOpen(false)}>Done</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader><DialogTitle>Upgrade to create more boards</DialogTitle><p className="text-sm text-gray-600">Free users can only create one board. Upgrade to create unlimited boards.</p></DialogHeader>
          <div className="flex justify-end space-x-4 pt-4"><Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>Cancel</Button><Button onClick={() => router.push("/")}>View plans</Button></div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(boardToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setBoardToDelete(null);
            setDeleteConfirmText("");
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Delete board</DialogTitle>
            <DialogDescription>
              This action cannot be undone. To confirm, type{" "}
              <span className="font-semibold text-gray-900">
                {boardToDelete?.title ?? "this board"}
              </span>{" "}
              below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-board-confirm">Board name</Label>
              <Input
                id="delete-board-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={boardToDelete?.title ?? "Type board name"}
                autoComplete="off"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setBoardToDelete(null);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={
                  isDeletingBoard ||
                  deleteConfirmText !== (boardToDelete?.title ?? "")
                }
              >
                {isDeletingBoard ? "Deleting..." : "Delete board"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
