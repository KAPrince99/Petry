import Navbar from "@/components/Navbar/Navbar";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
  useUser: vi.fn(() => ({ isSignedIn: false })),
  UserButton: () => <div data-testid="user-button" />,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
  }),
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

describe("Navbar", () => {
  it("shows sign-in links when signed out", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/sign-in",
    );
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/sign-up",
    );
  });
});
