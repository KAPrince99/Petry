import { BoardTaskFilterDialog } from "@/components/Dashboard/BoardView/BoardTaskFilterDialog";
import { useBoardUiStore } from "@/store/useBoardUiStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

describe("BoardTaskFilterDialog", () => {
  beforeEach(() => {
    useBoardUiStore.getState().resetBoardUi();
  });

  it("toggles priority filters and clears them", async () => {
    const user = userEvent.setup();
    useBoardUiStore.setState({ filterOpen: true });

    render(<BoardTaskFilterDialog />);

    await user.click(screen.getByRole("button", { name: /^high$/i }));

    expect(useBoardUiStore.getState().filters.priority).toEqual(["high"]);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(useBoardUiStore.getState().filters.priority).toEqual([]);
  });
});
