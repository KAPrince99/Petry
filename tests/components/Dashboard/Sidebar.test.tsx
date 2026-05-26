import { Sidebar } from "@/components/Dashboard/Sidebar";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const usePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Sidebar", () => {
  it("shows dashboard link on the boards list", () => {
    usePathname.mockReturnValue("/dashboard");

    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.queryByRole("link", { name: /back to dashboard/i })).not.toBeInTheDocument();
  });

  it("shows back link on a board detail page", () => {
    usePathname.mockReturnValue("/dashboard/board-123");

    render(<Sidebar />);

    expect(
      screen.getByRole("link", { name: /back to dashboard/i }),
    ).toHaveAttribute("href", "/dashboard");
  });
});
