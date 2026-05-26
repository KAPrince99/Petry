import { DashboardLoadingSkeleton } from "@/components/Dashboard/DashboardLoadingSkeleton";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("DashboardLoadingSkeleton", () => {
  it("renders stat and board placeholders", () => {
    const { container } = render(<DashboardLoadingSkeleton />);

    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(10);
  });
});
