import type { BoardItem } from "@/components/Dashboard/types";

export function createBoardItem(overrides: Partial<BoardItem> = {}): BoardItem {
  return {
    id: "board-1",
    title: "My Board",
    description: "A test board",
    color: "#3b82f6",
    user_id: "user-1",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}
