import { BoardLoadingSkeleton } from "@/components/Dashboard/BoardView/BoardLoadingSkeleton";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("BoardLoadingSkeleton", () => {
  it("renders details, stats, and kanban placeholders", () => {
    const { container } = render(<BoardLoadingSkeleton />);

    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(
      72,
    );
  });
});
