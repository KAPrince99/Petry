import { TaskCard } from "@/components/Dashboard/BoardView/TaskCard";
import { createTask } from "@/tests/fixtures/tasks";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useSortable = vi.fn(() => ({
  attributes: { "data-testid": "dnd-attributes" },
  listeners: { onPointerDown: vi.fn() },
  setNodeRef: vi.fn(),
  transform: null,
  transition: undefined,
  isDragging: false,
}));

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: (...args: unknown[]) => useSortable(...args),
}));

describe("TaskCard", () => {
  beforeEach(() => {
    useSortable.mockClear();
  });

  it("renders title, priority, description, due date, and assignee", () => {
    const task = createTask({
      title: "Ship feature",
      priority: "high",
      description: "  Release notes  ",
      due_date: "2026-05-26T12:00:00.000Z",
      assignee: "Alex",
    });

    render(<TaskCard task={task} columnId="col-1" isHydrated />);

    expect(screen.getByRole("listitem")).toBeInTheDocument();
    expect(screen.getByText("Ship feature")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("Release notes")).toBeInTheDocument();
    expect(screen.getByText(/due 2026-05-26/i)).toBeInTheDocument();
    expect(screen.getByText("Alex")).toBeInTheDocument();
  });

  it("omits optional fields when empty", () => {
    const task = createTask({
      description: "   ",
      due_date: null,
      assignee: null,
    });

    render(<TaskCard task={task} columnId="col-1" />);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.queryByText(/due /i)).not.toBeInTheDocument();
  });

  it("registers sortable with column and task ids", () => {
    const task = createTask({ id: "task-99" });

    render(<TaskCard task={task} columnId="col-2" sortableDisabled />);

    expect(useSortable).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "task-task-99",
        data: { type: "task", taskId: "task-99", columnId: "col-2" },
        disabled: true,
      }),
    );
  });

  it("does not attach drag listeners until hydrated", () => {
    const task = createTask();

    const { rerender } = render(
      <TaskCard task={task} columnId="col-1" isHydrated={false} />,
    );

    const listItem = screen.getByRole("listitem");
    expect(listItem).not.toHaveAttribute("data-testid", "dnd-attributes");

    rerender(<TaskCard task={task} columnId="col-1" isHydrated />);

    expect(screen.getByRole("listitem")).toHaveAttribute(
      "data-testid",
      "dnd-attributes",
    );
  });
});
