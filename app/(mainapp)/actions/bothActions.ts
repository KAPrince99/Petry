"use server";

import { createClient } from "@/lib/supabase/server";
import { normalizeTaskRows } from "@/lib/supabase/normalize-task";
import { boards, columns, tasks } from "@/lib/supabase/models";
import { auth } from "@clerk/nextjs/server";
import { createBoard } from "./boardActions";
import { createColumn } from "./columnActions";

export type ColumnWithTasks = columns & {
  tasks: tasks[];
};

export type BoardWithColumnsAndTasks = boards & {
  columns: ColumnWithTasks[];
};

export async function createBoardColumns(
  board: Omit<boards, "id" | "created_at" | "updated_at" | "user_id">,
) {
  try {
    console.log("[createBoardColumns] input board:", board);

    const newBoard = await createBoard(board);

    console.log("[createBoardColumns] newBoard:", newBoard);
    console.log("[createBoardColumns] newBoard.id:", newBoard?.id);

    if (!newBoard?.id) {
      throw new Error("Board ID missing after creation");
    }

    const defaultColumns = [
      { title: "To Do", sort_order: 0 },
      { title: "In Progress", sort_order: 1 },
      { title: "Review", sort_order: 2 },
      { title: "Done", sort_order: 3 },
    ];

    console.log("[createBoardColumns] default columns:", defaultColumns);

    await Promise.all(
      defaultColumns.map((col) => {
        const payload = {
          ...col,
          board_id: newBoard.id,
        };

        console.log("[createBoardColumns] inserting column:", payload);

        return createColumn(payload);
      }),
    );

    console.log("[createBoardColumns] SUCCESS");

    return newBoard;
  } catch (error) {
    console.error("Error creating board columns:", error);
    throw new Error("Failed to create board columns");
  }
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    const chain: string[] = [];
    let e: unknown = error;
    for (let d = 0; d < 5 && e instanceof Error; d++, e = e.cause) {
      chain.push(e.message);
    }
    return chain.join(" ← ");
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  if (typeof error === "object" && error !== null) {
    const parts: string[] = [];
    for (const key of Object.getOwnPropertyNames(error)) {
      parts.push(`${key}=${String((error as Record<string, unknown>)[key])}`);
    }
    if (parts.length > 0) return parts.join(" ");
  }
  try {
    return JSON.stringify(error);
  } catch {
    return typeof error === "string" ? error : `[${typeof error}]`;
  }
}

function normalizeBoardNestedOrder(
  data: BoardWithColumnsAndTasks | null,
): BoardWithColumnsAndTasks | null {
  if (!data) return null;

  const cols = data.columns ?? [];
  const orderedColumns = [...cols].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return {
    ...data,
    columns: orderedColumns.map((col) => ({
      ...col,
      tasks: [...(col.tasks ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    })),
  };
}

/**
 * Board scoped to user, with ordered columns each including ordered tasks.
 * Three plain queries — no nested resource embed or `referencedTable` ordering (common PostgREST failure points).
 */
export async function getBoardWithColumns(
  boardId: string,
): Promise<BoardWithColumnsAndTasks | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const supabase = await createClient();

    const { data: boardFields, error: boardError } = await supabase
      .from("boards")
      .select(
        "id, user_id, title, description, color, created_at, updated_at",
      )
      .eq("id", boardId)
      .eq("user_id", userId)
      .maybeSingle();

    if (boardError) throw boardError;
    if (!boardFields) return null;

    const { data: columnRowsRaw, error: columnsError } = await supabase
      .from("columns")
      .select("id, board_id, title, sort_order, created_at")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (columnsError) throw columnsError;

    const columnList = columnRowsRaw ?? [];
    const columnIds = columnList.map((c) => c.id);

    const tasksByColumnId = new Map<string, tasks[]>();
    for (const id of columnIds) tasksByColumnId.set(id, []);

    if (columnIds.length > 0) {
      const { data: taskRows, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .in("column_id", columnIds);

      if (tasksError) {
        const why = describeError(tasksError);
        const schemaOrMissing =
          /could not find the table|relation .* does not exist|schema cache|404/i.test(
            why,
          );
        if (schemaOrMissing) {
          console.warn(
            "[getBoardWithColumns] tasks query skipped (schema/table):",
            why,
          );
        } else {
          throw tasksError;
        }
      } else {
        for (const row of normalizeTaskRows(taskRows ?? [])) {
          tasksByColumnId.get(row.column_id)?.push(row);
        }
        for (const arr of tasksByColumnId.values()) {
          arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        }
      }
    }

    const merged: BoardWithColumnsAndTasks = {
      ...boardFields,
      columns: columnList.map((col) => ({
        ...col,
        tasks: tasksByColumnId.get(col.id) ?? [],
      })),
    };

    return normalizeBoardNestedOrder(merged);
  } catch (error) {
    console.error(
      `[getBoardWithColumns] ${describeError(error)}\nRAW:`,
      error,
    );
    throw new Error("Failed to fetch board with columns");
  }
}
