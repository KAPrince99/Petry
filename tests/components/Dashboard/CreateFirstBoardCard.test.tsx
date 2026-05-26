import { CreateFirstBoardCard } from "@/components/Dashboard/CreateFirstBoardCard";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("CreateFirstBoardCard", () => {
  it("calls onCreateBoard when clicked", async () => {
    const user = userEvent.setup();
    const onCreateBoard = vi.fn();

    render(<CreateFirstBoardCard onCreateBoard={onCreateBoard} />);

    await user.click(screen.getByText(/create your first board/i));

    expect(onCreateBoard).toHaveBeenCalledOnce();
  });
});
