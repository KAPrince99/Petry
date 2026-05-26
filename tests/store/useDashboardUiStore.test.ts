import { createBoardItem } from "@/tests/fixtures/board-item";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { beforeEach, describe, expect, it } from "vitest";

describe("useDashboardUiStore", () => {
  beforeEach(() => {
    useDashboardUiStore.setState({
      viewMode: "grid",
      search: "",
      upgradeDialogOpen: false,
      boardToDelete: null,
      deleteConfirmText: "",
    });
  });

  it("clears search", () => {
    useDashboardUiStore.getState().setSearch("demo");
    useDashboardUiStore.getState().clearSearch();
    expect(useDashboardUiStore.getState().search).toBe("");
  });

  it("opens delete flow and clears on close", () => {
    const board = createBoardItem({ title: "Roadmap" });
    useDashboardUiStore.getState().openDeleteBoard(board);
    useDashboardUiStore.getState().setDeleteConfirmText("partial");

    expect(useDashboardUiStore.getState().boardToDelete?.title).toBe("Roadmap");
    expect(useDashboardUiStore.getState().deleteConfirmText).toBe("partial");

    useDashboardUiStore.getState().handleDeleteDialogOpenChange(false);

    expect(useDashboardUiStore.getState().boardToDelete).toBeNull();
    expect(useDashboardUiStore.getState().deleteConfirmText).toBe("");
  });
});
