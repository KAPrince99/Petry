import { getErrorMessage } from "@/lib/errors/get-error-message";
import { describe, expect, it } from "vitest";

describe("getErrorMessage", () => {
  it("maps network errors to a friendly message", () => {
    expect(getErrorMessage(new Error("Failed to fetch"))).toMatch(
      /could not reach the server/i,
    );
  });

  it("maps auth errors", () => {
    expect(getErrorMessage(new Error("User not authenticated"))).toMatch(
      /session expired/i,
    );
  });

  it("returns the error message when present", () => {
    expect(getErrorMessage(new Error("Board not found"))).toBe("Board not found");
  });

  it("uses fallback for unknown errors", () => {
    expect(getErrorMessage(null, "Custom fallback")).toBe("Custom fallback");
  });
});
