import type { tasks } from "@/lib/supabase/models";

/** Matches the board tree from `getBoardWithColumns` (columns each include `tasks`). */
type BoardWithColumnTasks = {
  columns: Array<{ tasks: tasks[] }>;
};

/** Flat task list from an already-fetched board (no server round trip). */
export function flattenBoardTasks(board: BoardWithColumnTasks): tasks[] {
  return board.columns.flatMap((col) => col.tasks);
}
