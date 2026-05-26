import { UpgradeDialog } from "@/components/Dashboard/UpgradeDialog";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("UpgradeDialog", () => {
  beforeEach(() => {
    push.mockClear();
    useDashboardUiStore.setState({ upgradeDialogOpen: true });
  });

  it("closes on cancel", async () => {
    const user = userEvent.setup();

    render(<UpgradeDialog />);

    expect(
      screen.getByText(/upgrade to create more boards/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(useDashboardUiStore.getState().upgradeDialogOpen).toBe(false);
  });

  it("navigates to plans when upgrade is clicked", async () => {
    const user = userEvent.setup();

    render(<UpgradeDialog />);

    await user.click(screen.getByRole("button", { name: /view plans/i }));
    expect(push).toHaveBeenCalledWith("/");
  });
});
