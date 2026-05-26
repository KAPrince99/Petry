import { BoardTaskStats } from "@/components/Dashboard/BoardView/BoardTaskStats";
import { createBoard, createColumn } from "@/tests/fixtures/board";
import { createTask } from "@/tests/fixtures/tasks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("BoardTaskStats", () => {
  it("shows total tasks across all columns", () => {
    const board = createBoard({
      columns: [
        createColumn({
          id: "col-1",
          tasks: [createTask({ id: "t-1" }), createTask({ id: "t-2" })],
        }),
        createColumn({
          id: "col-2",
          title: "Done",
          tasks: [createTask({ id: "t-3" })],
        }),
      ],
    });

    render(<BoardTaskStats board={board} />);

    expect(screen.getByText(/total tasks:/i)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows zero when the board has no tasks", () => {
    const board = createBoard({
      columns: [createColumn({ tasks: [] })],
    });

    render(<BoardTaskStats board={board} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
