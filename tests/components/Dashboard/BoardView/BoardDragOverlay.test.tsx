import { BoardDragOverlay } from "@/components/Dashboard/BoardView/BoardDragOverlay";
import { createColumn } from "@/tests/fixtures/board";
import { createTask } from "@/tests/fixtures/tasks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("BoardDragOverlay", () => {
  it("renders active task preview", () => {
    render(
      <BoardDragOverlay
        activeTask={createTask({ title: "Dragging task", priority: "high" })}
        activeColumn={null}
      />,
    );

    expect(screen.getByText("Dragging task")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
  });

  it("renders active column preview", () => {
    render(
      <BoardDragOverlay
        activeTask={null}
        activeColumn={createColumn({ title: "Review" })}
      />,
    );

    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("renders nothing when idle", () => {
    const { container } = render(
      <BoardDragOverlay activeTask={null} activeColumn={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
