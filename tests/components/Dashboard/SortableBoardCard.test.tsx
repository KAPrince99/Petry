import { SortableBoardCard } from "@/components/Dashboard/SortableBoardCard";
import { createBoardItem } from "@/tests/fixtures/board-item";
import { renderWithProviders } from "@/tests/test-utils";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
  }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("SortableBoardCard", () => {
  beforeEach(() => {
    useDashboardUiStore.setState({ boardToDelete: null, deleteConfirmText: "" });
  });

  it("links to the board and opens delete flow", async () => {
    const user = userEvent.setup();
    const board = createBoardItem({ id: "b-42", title: "Launch" });

    renderWithProviders(
      <SortableBoardCard board={board} isHydrated deleting={false} />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/dashboard/b-42");
    expect(screen.getByText("Launch")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button");
    await user.click(deleteButtons[deleteButtons.length - 1]!);

    expect(useDashboardUiStore.getState().boardToDelete?.id).toBe("b-42");
  });
});
