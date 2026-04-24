"use server";

import { boards } from "@/lib/supabase/models";
import { createBoard } from "./boardActions";
import { createColumn } from "./columnActions";

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
