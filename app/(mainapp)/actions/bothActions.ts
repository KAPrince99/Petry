"use server";

import { createClient } from "@/lib/supabase/server";
import { boards, columns } from "@/lib/supabase/models";
import { auth } from "@clerk/nextjs/server";
import { createBoard } from "./boardActions";
import { createColumn } from "./columnActions";

type BoardWithColumns = boards & {
  columns: columns[];
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

export async function getBoardWithColumns(
  boardId: string,
): Promise<BoardWithColumns | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("boards")
      .select(
        "id, user_id, title, description, color, created_at, updated_at, columns(id, board_id, title, sort_order, created_at)",
      )
      .eq("id", boardId)
      .eq("user_id", userId)
      .order("sort_order", { referencedTable: "columns", ascending: true })
      .maybeSingle();

    if (error) throw error;
    return data as BoardWithColumns | null;
  } catch (error) {
    console.error("Error fetching board with columns:", error);
    throw new Error("Failed to fetch board with columns");
  }
}
