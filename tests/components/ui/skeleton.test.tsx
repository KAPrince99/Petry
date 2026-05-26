import { Skeleton } from "@/components/ui/skeleton";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Skeleton", () => {
  it("renders with theme-aware pulse styling", () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);

    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveClass("animate-pulse", "bg-muted", "dark:bg-muted/80");
  });
});
