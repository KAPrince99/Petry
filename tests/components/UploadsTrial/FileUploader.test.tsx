import FileUploader from "@/components/UploadsTrial/FileUploader";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

describe("FileUploader", () => {
  it("shows selected file details and uploads", async () => {
    const user = userEvent.setup();
    vi.mocked(axios.post).mockResolvedValue({ data: {} });

    render(<FileUploader />);

    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(input, file);

    expect(screen.getByText(/notes\.txt/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
