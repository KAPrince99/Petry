import { DashboardStatCard } from "@/components/Dashboard/DashboardStatCard";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("DashboardStatCard", () => {
  it("renders numeric stats", () => {
    render(<DashboardStatCard label="Boards" value={4} />);

    expect(screen.getByText("Boards")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("renders active status styling", () => {
    render(<DashboardStatCard label="Status" value="active" />);

    expect(screen.getByText("active")).toHaveClass("text-emerald-700");
  });

  it("respects explicit active override for status", () => {
    render(<DashboardStatCard label="Status" value="offline" active={false} />);

    expect(screen.getByText("offline")).toHaveClass("text-muted-foreground");
  });
});
