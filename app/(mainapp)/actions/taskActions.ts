"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeTaskRows } from "@/lib/supabase/normalize-task";
import type { tasks } from "@/lib/supabase/models";
import { auth } from "@clerk/nextjs/server";

/**
 * Loads only tasks for a board — does **not** call `getBoardWithColumns`.
 *
 * - **Board page / full UI**: use `getBoardWithColumns` once (nested columns + tasks).
 * - **Tasks-only workflows** (exports, aggregates, APIs): use this helper.
 * - **Already have board data**: use `flattenBoardTasks` from `@/lib/dashboard/board-tasks`.
 */
export async function getTasksByBoard(boardId: string): Promise<tasks[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = await createClient();

  const { data: owned, error: boardError } = await supabase
    .from("boards")
    .select("id")
    .eq("id", boardId)
    .eq("user_id", userId)
    .maybeSingle();

  if (boardError) throw boardError;
  if (!owned) return [];

  const { data: columnRows, error: columnsError } = await supabase
    .from("columns")
    .select("id, sort_order")
    .eq("board_id", boardId)
    .order("sort_order", { ascending: true });

  if (columnsError) throw columnsError;

  const columnIds = columnRows?.map((c) => c.id) ?? [];
  if (columnIds.length === 0) return [];

  const { data: taskRows, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .in("column_id", columnIds);

  if (tasksError) throw tasksError;

  const orderByColumn = new Map(
    (columnRows ?? []).map((c, i) => [c.id, i] as const),
  );

  const list = normalizeTaskRows(taskRows ?? []);

  list.sort((a, b) => {
    const colA = orderByColumn.get(a.column_id) ?? 0;
    const colB = orderByColumn.get(b.column_id) ?? 0;
    if (colA !== colB) return colA - colB;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return list;
}

type CreateTaskInput = {
  title: string;
  description?: string | null;
  assignee?: string | null;
  dueDate?: string | null;
  priority?: tasks["priority"];
};

const DESC_KEYS = ["description", "body", "notes", "content", "details"] as const;
const ASSIGNEE_KEYS = ["assignee", "owner", "assigned_to"] as const;
const DUE_KEYS = ["due_date", "due_at", "deadline"] as const;

function pgrstMissingColumn(message: string): string | null {
  const m = message.match(/Could not find the '(\w+)' column/i);
  return m?.[1] ?? null;
}

function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "";
}

/** Next column name in chain that has not been written yet (for schema variants). */
function setNextAlternate(
  row: Record<string, unknown>,
  value: string,
  chain: readonly string[],
  used: Set<string>,
): boolean {
  for (const key of chain) {
    if (used.has(key)) continue;
    used.add(key);
    row[key] = value;
    return true;
  }
  return false;
}

export async function createTaskForBoard(
  boardId: string,
  input: CreateTaskInput,
): Promise<tasks | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const supabase = await createClient();

  const { data: owned, error: boardError } = await supabase
    .from("boards")
    .select("id")
    .eq("id", boardId)
    .eq("user_id", userId)
    .maybeSingle();

  if (boardError) throw boardError;
  if (!owned) throw new Error("Board not found");

  const { data: columns, error: columnsError } = await supabase
    .from("columns")
    .select("id, sort_order")
    .eq("board_id", boardId)
    .order("sort_order", { ascending: true })
    .limit(1);

  if (columnsError) throw columnsError;
  const targetColumn = columns?.[0];
  if (!targetColumn) {
    throw new Error("Create at least one column before adding tasks.");
  }

  const { data: sortRows, error: sortError } = await supabase
    .from("tasks")
    .select("sort_order")
    .eq("column_id", targetColumn.id)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (sortError) throw sortError;
  const nextSortOrder = (sortRows?.[0]?.sort_order ?? -1) + 1;

  const cleanTitle = input.title.trim();
  if (!cleanTitle) throw new Error("Task title is required.");

  const description = input.description?.trim() || null;
  const assignee = input.assignee?.trim() || null;
  const dueDate = input.dueDate?.trim() || null;
  const priority = input.priority ?? "medium";

  const descUsed = new Set<string>();
  const assigneeUsed = new Set<string>();
  const dueUsed = new Set<string>();

  const insertBody: Record<string, unknown> = {
    column_id: targetColumn.id,
    sort_order: nextSortOrder,
    title: cleanTitle,
    priority,
  };

  if (description) {
    setNextAlternate(insertBody, description, DESC_KEYS, descUsed);
  }
  if (assignee) {
    setNextAlternate(insertBody, assignee, ASSIGNEE_KEYS, assigneeUsed);
  }
  if (dueDate) {
    setNextAlternate(insertBody, dueDate, DUE_KEYS, dueUsed);
  }

  for (let attempt = 0; attempt < 40; attempt++) {
    const { data, error } = await supabase
      .from("tasks")
      .insert(insertBody)
      .select("*")
      .maybeSingle();

    if (
      !error &&
      data &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      const parsed = normalizeTaskRows([data]);
      return parsed[0] ?? null;
    }

    const msg = errorMessage(error);
    const missing = pgrstMissingColumn(msg);
    if (!missing) {
      throw error;
    }

    if (missing === "title" && "title" in insertBody) {
      delete insertBody.title;
      insertBody.name = cleanTitle;
      continue;
    }

    if (missing in insertBody) {
      delete insertBody[missing];
      if (DESC_KEYS.includes(missing as (typeof DESC_KEYS)[number])) {
        if (description) {
          setNextAlternate(insertBody, description, DESC_KEYS, descUsed);
        }
        continue;
      }
      if (ASSIGNEE_KEYS.includes(missing as (typeof ASSIGNEE_KEYS)[number])) {
        if (assignee) {
          setNextAlternate(insertBody, assignee, ASSIGNEE_KEYS, assigneeUsed);
        }
        continue;
      }
      if (DUE_KEYS.includes(missing as (typeof DUE_KEYS)[number])) {
        if (dueDate) {
          setNextAlternate(insertBody, dueDate, DUE_KEYS, dueUsed);
        }
        continue;
      }
      continue;
    }

    throw error;
  }

  throw new Error("Could not insert task: too many schema retries.");
}
