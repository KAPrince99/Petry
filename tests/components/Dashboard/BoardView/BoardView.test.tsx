import { BoardView } from "@/components/Dashboard/BoardView/BoardView";
import { createBoard } from "@/tests/fixtures/board";
import { renderWithProviders } from "@/tests/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(mainapp)/actions/boardActions", () => ({
  updateBoard: vi.fn(),
}));

vi.mock("@/app/(mainapp)/actions/taskActions", () => ({
  createTaskForBoard: vi.fn(),
}));

vi.mock("@/components/Dashboard/BoardView/BoardKanban", () => ({
  BoardKanban: () => <div data-testid="board-kanban" />,
}));

describe("BoardView", () => {
  it("renders board details, stats, and kanban", () => {
    const board = createBoard({
      title: "Product roadmap",
      columns: [],
    });

    renderWithProviders(<BoardView board={board} />);

    expect(
      screen.getByRole("heading", { name: /product roadmap/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/total tasks:/i)).toBeInTheDocument();
    expect(screen.getByTestId("board-kanban")).toBeInTheDocument();
  });
});
