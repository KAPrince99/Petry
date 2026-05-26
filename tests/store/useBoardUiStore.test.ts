import { useBoardUiStore } from "@/store/useBoardUiStore";
import { beforeEach, describe, expect, it } from "vitest";

describe("useBoardUiStore", () => {
  beforeEach(() => {
    useBoardUiStore.getState().resetBoardUi();
  });

  it("resets scoped state when board changes", () => {
    const store = useBoardUiStore.getState();
    store.setBoardScope("board-a");
    store.setFilter("priority", ["high"]);
    store.setEditTitle("Draft");

    store.setBoardScope("board-b");

    expect(useBoardUiStore.getState().boardId).toBe("board-b");
    expect(useBoardUiStore.getState().filters.priority).toEqual([]);
    expect(useBoardUiStore.getState().editTitle).toBe("");
  });

  it("opens edit board with normalized fields", () => {
    useBoardUiStore.getState().openEditBoard({
      title: "  Sprint  ",
      description: "  Notes  ",
      color: "  #22c55e  ",
    });

    const state = useBoardUiStore.getState();
    expect(state.editOpen).toBe(true);
    expect(state.editTitle).toBe("Sprint");
    expect(state.editDescription).toBe("Notes");
    expect(state.editColor).toBe("#22c55e");
  });

  it("clears filters", () => {
    const store = useBoardUiStore.getState();
    store.setFilter("priority", ["low"]);
    store.setFilter("dueDate", "2026-05-01");
    store.clearFilters();

    expect(useBoardUiStore.getState().filters).toEqual({
      priority: [],
      dueDate: null,
    });
  });
});
