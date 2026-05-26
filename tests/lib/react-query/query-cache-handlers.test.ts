import { shouldToastQueryError } from "@/lib/react-query/query-cache-handlers";
import type { Query } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

function mockQuery(partial: {
  data: unknown;
  skipErrorToast?: boolean;
}): Query {
  return {
    state: { data: partial.data },
    meta: partial.skipErrorToast ? { skipErrorToast: true } : {},
  } as Query;
}

describe("shouldToastQueryError", () => {
  it("toasts when there is no cached data", () => {
    expect(shouldToastQueryError(mockQuery({ data: undefined }))).toBe(true);
  });

  it("does not toast when cached data exists (background refetch)", () => {
    expect(shouldToastQueryError(mockQuery({ data: [{ id: "1" }] }))).toBe(
      false,
    );
  });

  it("respects skipErrorToast meta", () => {
    expect(
      shouldToastQueryError(
        mockQuery({ data: undefined, skipErrorToast: true }),
      ),
    ).toBe(false);
  });
});
