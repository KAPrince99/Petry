import type {
  BoardColumnWithTasks,
  BoardViewBoard,
} from "@/components/Dashboard/BoardView/types";
import { createTask } from "@/tests/fixtures/tasks";

export function createColumn(
  overrides: Partial<BoardColumnWithTasks> = {},
): BoardColumnWithTasks {
  return {
    id: "col-1",
    board_id: "board-1",
    title: "To Do",
    sort_order: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    tasks: [createTask()],
    ...overrides,
  };
}

export function createBoard(overrides: Partial<BoardViewBoard> = {}): BoardViewBoard {
  return {
    id: "board-1",
    title: "My Board",
    description: "Board description",
    color: "#3b82f6",
    user_id: "user-1",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    columns: [createColumn()],
    ...overrides,
  };
}
