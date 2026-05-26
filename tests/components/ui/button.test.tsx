import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save board</Button>);

    const button = screen.getByRole("button", { name: /save board/i });
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can be disabled", () => {
    render(<Button disabled>Save board</Button>);
    expect(screen.getByRole("button", { name: /save board/i })).toBeDisabled();
  });

  it("exposes variant and size via data attributes", () => {
    render(
      <Button variant="outline" size="sm">
        Filter
      </Button>,
    );

    const button = screen.getByRole("button", { name: /filter/i });
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "sm");
  });
});
