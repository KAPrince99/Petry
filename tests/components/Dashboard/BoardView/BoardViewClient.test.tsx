import { BoardViewClient } from "@/components/Dashboard/BoardView/BoardViewClient";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";
import { createBoard } from "@/tests/fixtures/board";
import { createTestQueryClient, renderWithProviders } from "@/tests/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/Dashboard/BoardView/BoardView", () => ({
  BoardView: ({ board }: { board: { title: string | null } }) => (
    <div data-testid="board-view">{board.title}</div>
  ),
}));

vi.mock("@/components/Dashboard/BoardView/BoardLoadingSkeleton", () => ({
  BoardLoadingSkeleton: () => <div data-testid="board-skeleton" />,
}));

describe("BoardViewClient", () => {
  it("shows skeleton while board data is loading", () => {
    renderWithProviders(<BoardViewClient boardId="board-1" />);

    expect(screen.getByTestId("board-skeleton")).toBeInTheDocument();
  });

  it("renders board view when data is available", () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(
      DASHBOARD_QUERY_KEYS.board("board-1"),
      createBoard({ id: "board-1", title: "Cached board" }),
    );

    renderWithProviders(<BoardViewClient boardId="board-1" />, { queryClient });

    expect(screen.getByTestId("board-view")).toHaveTextContent("Cached board");
  });
});
