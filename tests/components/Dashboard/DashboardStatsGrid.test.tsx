import { DashboardStatsGrid } from "@/components/Dashboard/DashboardStatsGrid";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("DashboardStatsGrid", () => {
  it("renders a card per stat", () => {
    render(
      <DashboardStatsGrid
        stats={[
          { label: "Boards", value: 2 },
          { label: "Tasks", value: 10 },
        ]}
      />,
    );

    expect(screen.getByText("Boards")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
