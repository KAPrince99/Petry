import { BoardDetailsCard } from "@/components/Dashboard/BoardView/BoardDetailsCard";
import { DEFAULT_BOARD_COLOR } from "@/components/Dashboard/BoardView/constants";
import { useBoardUiStore } from "@/store/useBoardUiStore";
import { createBoard } from "@/tests/fixtures/board";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("BoardDetailsCard", () => {
  const onUpdateBoard = vi.fn();
  const onCreateTask = vi.fn();

  beforeEach(() => {
    useBoardUiStore.getState().resetBoardUi();
    onUpdateBoard.mockClear();
    onCreateTask.mockClear();
  });

  function renderCard(
    board = createBoard(),
    overrides: Partial<{
      submitError: string | null;
      isPending: boolean;
      taskSubmitError: string | null;
      isTaskPending: boolean;
    }> = {},
  ) {
    return render(
      <BoardDetailsCard
        board={board}
        submitError={null}
        isPending={false}
        onUpdateBoard={onUpdateBoard}
        taskSubmitError={null}
        isTaskPending={false}
        onCreateTask={onCreateTask}
        {...overrides}
      />,
    );
  }

  it("renders board title and description", () => {
    renderCard(createBoard({ title: "Sprint board", description: "Q2 work" }));

    expect(
      screen.getByRole("heading", { name: /sprint board/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Q2 work")).toBeInTheDocument();
  });

  it("uses fallbacks for missing title and description", () => {
    renderCard(
      createBoard({ title: undefined, description: "   ", color: null }),
    );

    expect(
      screen.getByRole("heading", { name: /untitled board/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/no description yet/i)).toBeInTheDocument();

    const colorBar = document.querySelector("[aria-hidden]");
    expect(colorBar).toHaveStyle({ backgroundColor: DEFAULT_BOARD_COLOR });
  });

  it("exposes filter, edit, and create task actions", () => {
    renderCard();

    expect(
      screen.getByRole("button", { name: /filter tasks/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /edit board/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i }),
    ).toBeInTheDocument();
  });
});
