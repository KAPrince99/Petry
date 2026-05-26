import { ThemeToggle } from "@/components/theme-toggle";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const setTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme,
    resolvedTheme: "light",
  }),
}));

describe("ThemeToggle", () => {
  it("switches theme from the cycle button", async () => {
    setTheme.mockClear();
    const user = userEvent.setup();

    render(<ThemeToggle />);

    const button = await waitFor(() =>
      screen.getByRole("button", { name: /switch to dark mode/i }),
    );

    await user.click(button);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("sets light and dark in segmented mode", async () => {
    setTheme.mockClear();
    const user = userEvent.setup();

    render(<ThemeToggle variant="segmented" />);

    await waitFor(() => expect(screen.getByRole("group", { name: /theme/i })).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /dark/i }));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
