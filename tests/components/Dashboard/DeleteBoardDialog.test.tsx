import { DeleteBoardDialog } from "@/components/Dashboard/DeleteBoardDialog";
import { createBoardItem } from "@/tests/fixtures/board-item";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("DeleteBoardDialog", () => {
  beforeEach(() => {
    useDashboardUiStore.setState({
      boardToDelete: null,
      deleteConfirmText: "",
    });
  });

  it("enables delete only when the board name matches", async () => {
    const user = userEvent.setup();
    const onConfirmDelete = vi.fn();

    useDashboardUiStore
      .getState()
      .openDeleteBoard(createBoardItem({ title: "Roadmap" }));

    render(<DeleteBoardDialog isDeletingBoard={false} onConfirmDelete={onConfirmDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete board/i });
    expect(deleteButton).toBeDisabled();

    await user.type(screen.getByLabelText(/board name/i), "Roadmap");
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);
    expect(onConfirmDelete).toHaveBeenCalledOnce();
  });
});
