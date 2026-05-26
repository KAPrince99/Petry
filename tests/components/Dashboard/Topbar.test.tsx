import { Topbar } from "@/components/Dashboard/Topbar";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Topbar", () => {
  beforeEach(() => {
    useDashboardUiStore.setState({ viewMode: "grid", search: "" });
  });

  it("updates search and view mode", async () => {
    const user = userEvent.setup();

    render(<Topbar onCreateBoard={vi.fn()} creating={false} />);

    await user.type(screen.getByPlaceholderText(/search boards/i), "alpha");
    expect(useDashboardUiStore.getState().search).toBe("alpha");

    await user.click(screen.getByRole("button", { name: /list view/i }));
    expect(useDashboardUiStore.getState().viewMode).toBe("list");
  });

  it("calls onCreateBoard and shows loading state", async () => {
    const user = userEvent.setup();
    const onCreateBoard = vi.fn();

    const { rerender } = render(
      <Topbar onCreateBoard={onCreateBoard} creating={false} />,
    );

    await user.click(screen.getByRole("button", { name: /create board/i }));
    expect(onCreateBoard).toHaveBeenCalledOnce();

    rerender(<Topbar onCreateBoard={onCreateBoard} creating />);
    expect(screen.getByRole("button", { name: /create board/i })).toBeDisabled();
  });
});
