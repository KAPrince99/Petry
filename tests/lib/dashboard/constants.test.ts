import { getBoardRoute } from "@/lib/dashboard/constants";
import { describe, expect, it } from "vitest";

describe("getBoardRoute", () => {
  it("builds the dashboard board path", () => {
    expect(getBoardRoute("abc-123")).toBe("/dashboard/abc-123");
  });
});
