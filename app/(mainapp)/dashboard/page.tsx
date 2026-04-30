"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import {
  Filter,
  Grid3x3,
  Kanban,
  List,
  Plus,
  Rocket,
  Search,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getBoards } from "../actions/boardActions";
import { createBoardColumns } from "../actions/bothActions";

type ViewMode = "grid" | "list";

type BoardFilters = {
  search: string;
  dateRange: { start: string | null; end: string | null };
  taskCount: { min: number | null; max: number | null };
};

const defaultFilters: BoardFilters = {
  search: "",
  dateRange: { start: null, end: null },
  taskCount: { min: null, max: null },
};

/** Toggle when billing/plan is wired (Clerk metadata, Stripe, etc.). */
const IS_FREE_PLAN = false;
const FREE_BOARD_LIMIT = 1;

export default function DashBoard() {
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<BoardFilters>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const { data: boards = [] } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  const filteredBoards = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return boards.filter((board) => {
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
  }, [boards, filters]);

  const boardsUpdatedThisWeek = useMemo(
    () =>
      boards.filter((board) => {
        const updatedAt = new Date(board.updated_at);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return updatedAt > oneWeekAgo;
      }).length,
    [boards],
  );

  const boardsCreatedThisMonth = useMemo(() => {
    const now = new Date();
    return boards.filter((b) => {
      const c = new Date(b.created_at);
      return (
        c.getMonth() === now.getMonth() && c.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [boards]);

  const dummy = {
    title: "Untitled Board",
    description: "",
    color: "#3b82f6",
  };

  const {
    mutate: createBoard,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async () => createBoardColumns(dummy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  useEffect(() => {
    if (!isSuccess) return;
    const id = window.setTimeout(() => reset(), 4000);
    return () => window.clearTimeout(id);
  }, [isSuccess, reset]);

  const handleCreateBoard = () => {
    if (IS_FREE_PLAN && boards.length >= FREE_BOARD_LIMIT) {
      setShowUpgradeDialog(true);
      return;
    }
    createBoard();
  };

  const clearFilters = () => setFilters(defaultFilters);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "there"}
            ! 👋
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your boards today.
          </p>

          <Button
            className="my-4 cursor-pointer hover:bg-blue-600 text-white"
            onClick={handleCreateBoard}
            disabled={isPending}
          >
            {isPending ? (
              "Creating..."
            ) : (
              <>
                <Plus className="mr-2" /> Create Board
              </>
            )}
          </Button>

          {isError && (
            <div className="text-red-600 mt-2 text-sm">
              {error instanceof Error ? error.message : "Error creating board."}
            </div>
          )}
          {isSuccess && (
            <div className="text-green-600 mt-2 text-sm">
              Board created successfully!
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Boards
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Kanban className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Projects
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boards.length}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Recent Activity
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boardsUpdatedThisWeek}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center text-lg">
                  📊
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    New this month
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {boardsCreatedThisMonth}
                  </p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Kanban className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Boards
              </h2>
              <p className="text-gray-600">Manage your projects and tasks</p>
              {IS_FREE_PLAN && (
                <p className="text-sm text-gray-500 mt-1">
                  Free plan: {boards.length}/{FREE_BOARD_LIMIT} boards used
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 rounded bg-white border p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>

              <Button type="button" onClick={handleCreateBoard}>
                <Plus className="h-4 w-4 mr-1" />
                Create Board
              </Button>
            </div>
          </div>

          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              id="board-search"
              placeholder="Search boards..."
              className="pl-10"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          {boards.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <Card
                className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group sm:col-span-full max-w-md mx-auto sm:mx-0"
                onClick={handleCreateBoard}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[200px]">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium text-center">
                    No boards yet — create your first board
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : filteredBoards.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-gray-600">No boards match your filters.</p>
              <Button variant="outline" type="button" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredBoards.map((board) => (
                <Link href={`/dashboard/${board.id}`} key={board.id}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="w-4 h-4 rounded shrink-0 ring-1 ring-black/10"
                          style={{
                            backgroundColor: board.color ?? "#3b82f6",
                          }}
                        />
                        <Badge className="text-xs shrink-0" variant="secondary">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {board.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-4 line-clamp-2">
                        {board.description ?? ""}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0 gap-2">
                        <span>
                          Created{" "}
                          {new Date(board.created_at).toLocaleDateString()}
                        </span>
                        <span>
                          Updated{" "}
                          {new Date(board.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              <Card
                className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group"
                onClick={handleCreateBoard}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              {filteredBoards.map((board, index) => (
                <div key={board.id} className={index > 0 ? "mt-4" : ""}>
                  <Link href={`/dashboard/${board.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className="w-4 h-4 rounded shrink-0 ring-1 ring-black/10"
                            style={{
                              backgroundColor: board.color ?? "#3b82f6",
                            }}
                          />
                          <Badge className="text-xs shrink-0" variant="secondary">
                            New
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0">
                        <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-blue-600 transition-colors">
                          {board.title}
                        </CardTitle>
                        <CardDescription className="text-sm mb-4 line-clamp-2">
                          {board.description ?? ""}
                        </CardDescription>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0 gap-2">
                          <span>
                            Created{" "}
                            {new Date(board.created_at).toLocaleDateString()}
                          </span>
                          <span>
                            Updated{" "}
                            {new Date(board.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}

              <Card
                className="mt-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer group"
                onClick={handleCreateBoard}
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                  <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-blue-600 font-medium">
                    Create new board
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Filter Boards</DialogTitle>
            <p className="text-sm text-gray-600">
              Filter boards by title or last activity date.
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filter-search">Search</Label>
              <Input
                id="filter-search"
                placeholder="Search board titles..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date range (by last update)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Start date</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.start ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">End date</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.end ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value || null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Task count</Label>
              <p className="text-xs text-muted-foreground">
                Per-board task counts are not loaded on this page yet; these
                fields are reserved for a future update.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Minimum</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Min tasks"
                    value={filters.taskCount.min ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        taskCount: {
                          ...prev.taskCount,
                          min: e.target.value ? Number(e.target.value) : null,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Maximum</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Max tasks"
                    value={filters.taskCount.max ?? ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        taskCount: {
                          ...prev.taskCount,
                          max: e.target.value ? Number(e.target.value) : null,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between pt-4 space-y-2 sm:space-y-0 sm:space-x-2">
              <Button variant="outline" type="button" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Upgrade to create more boards</DialogTitle>
            <p className="text-sm text-gray-600">
              Free users can only create one board. Upgrade to create unlimited
              boards.
            </p>
          </DialogHeader>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => router.push("/")}>
              View plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
