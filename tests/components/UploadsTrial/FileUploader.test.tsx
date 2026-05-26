import FileUploader from "@/components/UploadsTrial/FileUploader";
import { toastError, toastSuccess } from "@/lib/toast";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

vi.mock("@/lib/toast", () => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

describe("FileUploader", () => {
  it("shows selected file details and toasts on upload success", async () => {
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
      expect(toastSuccess).toHaveBeenCalledWith(
        "File uploaded successfully",
        "file-upload-success",
      );
    });
  });

  it("toasts on upload failure", async () => {
    const user = userEvent.setup();
    vi.mocked(axios.post).mockRejectedValue(new Error("Network Error"));

    render(<FileUploader />);

    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalled();
    });
  });
});
