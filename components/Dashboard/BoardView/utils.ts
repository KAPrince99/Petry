import type { tasks } from "@/lib/supabase/models";
import { DEFAULT_BOARD_COLOR } from "./constants";
import type { BoardTaskFilters, TaskPriority } from "./types";

export function colorFromBoard(color: string | undefined | null): string {
  const c = color?.trim();
  if (!c) return DEFAULT_BOARD_COLOR;
  return c;
}

export function defaultTaskFilters(): BoardTaskFilters {
  return { priority: [], dueDate: null };
}

export function activeTaskFilterCount(f: BoardTaskFilters): number {
  const due = typeof f.dueDate === "string" && f.dueDate.trim() !== "" ? 1 : 0;
  return f.priority.length + due;
}

export function taskMatchesFilters(task: tasks, f: BoardTaskFilters): boolean {
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

export function priorityBadgeClasses(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-400";
    case "medium":
      return "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400";
    case "low":
    default:
      return "bg-muted text-muted-foreground dark:bg-muted/80";
  }
}
