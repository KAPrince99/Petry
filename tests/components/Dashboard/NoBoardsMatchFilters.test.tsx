import { NoBoardsMatchFilters } from "@/components/Dashboard/NoBoardsMatchFilters";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

describe("NoBoardsMatchFilters", () => {
  beforeEach(() => {
    useDashboardUiStore.setState({ search: "demo" });
  });

  it("shows empty state and clears search on click", async () => {
    const user = userEvent.setup();

    render(<NoBoardsMatchFilters />);

    expect(
      screen.getByText(/no boards match your search/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /clear search/i }),
    );

    expect(useDashboardUiStore.getState().search).toBe("");
  });
});
