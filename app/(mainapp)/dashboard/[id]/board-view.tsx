"use client";

import type { boards, columns, tasks } from "@/lib/supabase/models";
import {
  closestCorners,
  pointerWithin,
  rectIntersection,
  DndContext,
  DragOverlay,
  type DragOverEvent,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Ellipsis, Filter, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { updateBoard } from "../../actions/boardActions";
import { createTaskForBoard } from "../../actions/taskActions";

export type BoardColumnWithTasks = columns & { tasks: tasks[] };

export type BoardViewBoard = boards & { columns: BoardColumnWithTasks[] };

type BoardViewProps = {
  board: BoardViewBoard;
};

const DEFAULT_BOARD_COLOR = "#3b82f6";

const BOARD_COLOR_SWATCHES: string[] = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#6366f1",
  "#6b7280",
  "#f97316",
  "#14b8a6",
  "#06b6d4",
  "#10b981",
];

function colorFromBoard(color: string | undefined | null): string {
  const c = color?.trim();
  if (!c) return DEFAULT_BOARD_COLOR;
  return c;
}

type TaskPriority = "low" | "medium" | "high";

type BoardTaskFilters = {
  priority: TaskPriority[];
  dueDate: string | null;
};

const PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

function defaultTaskFilters(): BoardTaskFilters {
  return { priority: [], dueDate: null };
}

function activeTaskFilterCount(f: BoardTaskFilters): number {
  const due = typeof f.dueDate === "string" && f.dueDate.trim() !== "" ? 1 : 0;
  return f.priority.length + due;
}

function taskMatchesFilters(task: tasks, f: BoardTaskFilters): boolean {
  if (f.priority.length > 0 && !f.priority.includes(task.priority)) {
    return false;
  }
  const day = typeof f.dueDate === "string" ? f.dueDate.trim() : "";
  if (day !== "") {
    if (!task.due_date) return false;
    if (task.due_date.slice(0, 10) !== day) return false;
  }
  return true;
}

function priorityBadgeClasses(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-amber-100 text-amber-900";
    case "low":
    default:
      return "bg-slate-100 text-slate-700";
  }
}

type TaskCardProps = {
  task: tasks;
  columnId: string;
  sortableDisabled?: boolean;
  isHydrated?: boolean;
};

const TaskCard = memo(function TaskCard({
  task,
  columnId,
  sortableDisabled = false,
  isHydrated = false,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
    data: { type: "task", taskId: task.id, columnId },
    disabled: sortableDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const enableDnD = isHydrated && !sortableDisabled;
  const dndProps = enableDnD ? { ...attributes, ...listeners } : {};

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-border bg-muted/50 p-3 text-sm shadow-sm ${
        sortableDisabled
          ? ""
          : "cursor-grab active:cursor-grabbing touch-none select-none"
      } ${isDragging ? "border-dashed border-blue-300 bg-blue-50/40 opacity-40" : ""}`}
      {...dndProps}
      role="listitem"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-foreground">{task.title}</p>
        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${priorityBadgeClasses(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description?.trim() ? (
        <p className="mt-1 line-clamp-2 text-muted-foreground">{task.description}</p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {task.due_date ? <span>Due {task.due_date.slice(0, 10)}</span> : null}
        {task.assignee?.trim() ? <span>{task.assignee}</span> : null}
      </div>
    </article>
  );
});

type ColumnSectionProps = {
  column: BoardColumnWithTasks;
  visibleTasks: tasks[];
  total: number;
  activeFilterCount: number;
  isHydrated?: boolean;
};

const ColumnSection = memo(function ColumnSection({
  column,
  visibleTasks,
  total,
  activeFilterCount,
  isHydrated = false,
}: ColumnSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${column.id}`,
    data: { type: "column", columnId: column.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
    id: `column-drop-${column.id}`,
    data: { type: "column-drop", columnId: column.id },
  });

  const taskIds = visibleTasks.map((task) => `task-${task.id}`);
  const columnDndProps = isHydrated ? { ...attributes, ...listeners } : {};

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`flex max-h-[min(70vh,720px)] flex-col rounded-lg border border-border bg-card ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
      role="region"
      aria-label={`${column.title ?? "Untitled Column"} column`}
    >
      <div className="shrink-0 border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate font-semibold text-foreground">
              {column.title ?? "Untitled Column"}
            </h2>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {activeFilterCount > 0
                ? `${visibleTasks.length}/${total}`
                : total}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            aria-label={`Open options for ${column.title ?? "this column"}`}
            {...columnDndProps}
          >
            <Ellipsis className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setDropNodeRef}
          className={`min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3 ${
            isOver
              ? "rounded-b-lg bg-blue-50/40 ring-1 ring-inset ring-blue-200"
              : ""
          }`}
          role="list"
          aria-label={`Tasks in ${column.title ?? "column"}`}
        >
          {total === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet.</p>
          ) : visibleTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks match these filters.
            </p>
          ) : (
            visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={column.id}
                sortableDisabled={activeFilterCount > 0}
                isHydrated={isHydrated}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
});

export function BoardView({ board }: BoardViewProps) {
  const router = useRouter();
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
  const [boardColumns, setBoardColumns] = useState<BoardColumnWithTasks[]>(
    board.columns,
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(DEFAULT_BOARD_COLOR);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [taskSubmitError, setTaskSubmitError] = useState<string | null>(null);
  const [isTaskPending, setIsTaskPending] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<BoardTaskFilters>(defaultTaskFilters);

  useEffect(() => {
    setBoardColumns(board.columns);
  }, [board.columns]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleFilterChange = useCallback(
    <K extends keyof BoardTaskFilters>(key: K, value: BoardTaskFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultTaskFilters());
  }, []);

  const activeFilterCount = useMemo(
    () => activeTaskFilterCount(filters),
    [filters],
  );

  const filteredColumns = useMemo(() => {
    return boardColumns.map((column) => ({
      column,
      tasks: column.tasks.filter((task) => taskMatchesFilters(task, filters)),
      total: column.tasks.length,
    }));
  }, [boardColumns, filters]);

  const resetFormFromBoard = useCallback(() => {
    setTitle(board.title?.trim() || "");
    setDescription(board.description?.trim() || "");
    setColor(colorFromBoard(board.color));
    setSubmitError(null);
  }, [board.title, board.description, board.color]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setEditOpen(open);
      if (open) {
        resetFormFromBoard();
      }
    },
    [resetFormFromBoard],
  );

  const closeFilterDialog = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as
      | {
          type?: "column" | "task";
          columnId?: string;
          taskId?: string;
        }
      | undefined;

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
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as
      | {
          type?: "column" | "task" | "column-drop";
          columnId?: string;
          taskId?: string;
        }
      | undefined;
    const overData = over.data.current as
      | {
          type?: "column" | "task" | "column-drop";
          columnId?: string;
          taskId?: string;
        }
      | undefined;

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
      const movingIndex = sourceColumn.tasks.findIndex(
        (t) => t.id === activeId,
      );
      if (movingIndex < 0) return prev;

      const overIndex = destinationColumn.tasks.findIndex(
        (t) => t.id === overId,
      );

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
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTaskId(null);
    setActiveColumnId(null);

    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as
      | {
          type?: "column" | "task" | "column-drop";
          columnId?: string;
          taskId?: string;
        }
      | undefined;
    const overData = over.data.current as
      | {
          type?: "column" | "task" | "column-drop";
          columnId?: string;
          taskId?: string;
        }
      | undefined;

    if (activeData?.type === "column" && overData?.type === "column") {
      if (active.id === over.id) return;
      setBoardColumns((prev) => {
        const oldIndex = prev.findIndex(
          (col) => `column-${col.id}` === active.id,
        );
        const newIndex = prev.findIndex(
          (col) => `column-${col.id}` === over.id,
        );
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
      const destinationIndex = destinationTasks.findIndex(
        (t) => t.id === overId,
      );

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
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveTaskId(null);
    setActiveColumnId(null);
  }, []);

  useEffect(() => {
    setActiveTaskId(null);
    setActiveColumnId(null);
  }, [boardColumns]);

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

  async function handleUpdateBoard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setIsPending(true);
    try {
      await updateBoard(board.id, {
        title: title.trim() || "Untitled Board",
        description: description.trim() ? description.trim() : null,
        color,
      });
      setEditOpen(false);
      router.refresh();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save changes.",
      );
    } finally {
      setIsPending(false);
    }
  }

  const handleCreateTask = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setTaskSubmitError(null);
      setIsTaskPending(true);
      try {
        const form = e.currentTarget;
        const fd = new FormData(form);
        const title = String(fd.get("title") ?? "");
        const description = String(fd.get("description") ?? "");
        const assignee = String(fd.get("assignee") ?? "");
        const dueDate = String(fd.get("dueDate") ?? "");
        const priority = String(fd.get("priority") ?? "medium");

        await createTaskForBoard(board.id, {
          title,
          description: description || null,
          assignee: assignee || null,
          dueDate: dueDate || null,
          priority:
            priority === "low" || priority === "high" || priority === "medium"
              ? priority
              : "medium",
        });

        form.reset();
        setIsCreateTaskOpen(false);
        router.refresh();
      } catch (err) {
        setTaskSubmitError(
          err instanceof Error ? err.message : "Could not create task.",
        );
      } finally {
        setIsTaskPending(false);
      }
    },
    [board.id, router],
  );

  return (
    <>
      <div className="flex-1 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div
          className="mb-4 h-2 w-full max-w-xs rounded-full"
          style={{
            backgroundColor: board.color?.trim() || DEFAULT_BOARD_COLOR,
          }}
          aria-hidden
        />
        <h1 className="text-2xl font-bold text-foreground">
          {board.title ?? "Untitled Board"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {board.description?.trim() || "No description yet."}
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {/* Filter Tasks Dialog */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                aria-label={
                  activeFilterCount > 0
                    ? `Filter tasks, ${activeFilterCount} active`
                    : "Filter tasks"
                }
              >
                <Filter className="mr-2 size-4 shrink-0" aria-hidden />
                <span>Filter tasks</span>
                {activeFilterCount > 0 ? (
                  <Badge
                    variant="secondary"
                    className="ml-2 min-w-5 justify-center px-1.5 tabular-nums"
                  >
                    {activeFilterCount}
                  </Badge>
                ) : null}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Filter tasks
                  {activeFilterCount > 0 ? (
                    <Badge
                      variant="secondary"
                      className="tabular-nums font-normal"
                    >
                      {activeFilterCount} active
                    </Badge>
                  ) : null}
                </DialogTitle>
                <DialogDescription>
                  Filter tasks by priority or due date.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITIES.map((priority) => (
                      <Button
                        type="button"
                        onClick={() => {
                          const newPriorities = filters.priority.includes(
                            priority,
                          )
                            ? filters.priority.filter((p) => p !== priority)
                            : [...filters.priority, priority];

                          handleFilterChange("priority", newPriorities);
                        }}
                        key={priority}
                        variant={
                          filters.priority.includes(priority)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={filters.dueDate || ""}
                    onChange={(e) =>
                      handleFilterChange("dueDate", e.target.value || null)
                    }
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                  <Button type="button" onClick={closeFilterDialog}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Board Dialog */}
          <Dialog open={editOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
              >
                Edit board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit board</DialogTitle>
                <DialogDescription>
                  Update this board&apos;s title, description, and color.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleUpdateBoard}>
                <div className="space-y-2">
                  <Label htmlFor="boardTitle">Board title</Label>
                  <Input
                    id="boardTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Board title"
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boardDescription">Description</Label>
                  <Textarea
                    id="boardDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                    className="resize-y min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Board color</Label>
                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-6">
                    {BOARD_COLOR_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        title={hex}
                        className={`size-8 rounded-full ring-offset-2 ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          color === hex
                            ? "ring-2 ring-foreground"
                            : "ring-0 hover:ring-1 ring-muted-foreground/40"
                        }`}
                        style={{ backgroundColor: hex }}
                        onClick={() => setColor(hex)}
                        aria-pressed={color === hex}
                      />
                    ))}
                  </div>
                </div>

                {submitError ? (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Create Task Dialog */}
          <Dialog
            open={isCreateTaskOpen}
            onOpenChange={(open) => {
              setIsCreateTaskOpen(open);
              if (open) setTaskSubmitError(null);
            }}
          >
            <DialogTrigger asChild>
              <Button type="button" className="cursor-pointer">
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a task to the board. It will be placed in the first
                  column.
                </DialogDescription>
              </DialogHeader>

              <form className="space-y-4" onSubmit={handleCreateTask}>
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                    required
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input
                    id="assignee"
                    name="assignee"
                    placeholder="Who should do this?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["low", "medium", "high"].map((priority, key) => (
                        <SelectItem key={key} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  {taskSubmitError ? (
                    <p className="w-full text-sm text-red-600" role="alert">
                      {taskSubmitError}
                    </p>
                  ) : null}
                  <Button type="submit" disabled={isTaskPending}>
                    {isTaskPending ? "Creating..." : "Create Task"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="my-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Total Tasks: </span>
            {board.columns.reduce((sum, col) => sum + col.tasks.length, 0)}
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        autoScroll
      >
        <SortableContext
          items={sortableColumnIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {board.columns.length === 0 ? (
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
          {activeTask ? (
            <article className="w-[280px] scale-[1.02] rounded-md border border-border bg-card p-3 text-sm shadow-2xl">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-foreground">{activeTask.title}</p>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${priorityBadgeClasses(activeTask.priority)}`}
                >
                  {activeTask.priority}
                </span>
              </div>
            </article>
          ) : activeColumn ? (
            <section className="w-[280px] scale-[1.01] rounded-lg border border-border bg-card p-3 shadow-2xl">
              <h2 className="truncate font-semibold text-foreground">
                {activeColumn.title ?? "Untitled Column"}
              </h2>
            </section>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
