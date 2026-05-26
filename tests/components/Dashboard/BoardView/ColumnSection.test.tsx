import { ColumnSection } from "@/components/Dashboard/BoardView/ColumnSection";
import { createColumn } from "@/tests/fixtures/board";
import { createTask } from "@/tests/fixtures/tasks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
}));

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  verticalListSortingStrategy: {},
}));

vi.mock("@/components/Dashboard/BoardView/TaskCard", () => ({
  TaskCard: ({ task }: { task: { title: string } }) => (
    <div data-testid="task-card">{task.title}</div>
  ),
}));

describe("ColumnSection", () => {
  const column = createColumn({ title: "In Progress" });

  it("renders column title and task count", () => {
    render(
      <ColumnSection
        column={column}
        visibleTasks={[createTask({ title: "Task A" })]}
        total={2}
        activeFilterCount={1}
      />,
    );

    expect(screen.getByRole("region", { name: /in progress column/i })).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByTestId("task-card")).toHaveTextContent("Task A");
  });

  it("shows empty and filtered empty messages", () => {
    const { rerender } = render(
      <ColumnSection
        column={column}
        visibleTasks={[]}
        total={0}
        activeFilterCount={0}
      />,
    );

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();

    rerender(
      <ColumnSection
        column={column}
        visibleTasks={[]}
        total={3}
        activeFilterCount={1}
      />,
    );

    expect(screen.getByText(/no tasks match these filters/i)).toBeInTheDocument();
  });
});
