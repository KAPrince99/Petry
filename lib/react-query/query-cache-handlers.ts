import { getErrorMessage } from "@/lib/errors/get-error-message";
import type { Query } from "@tanstack/react-query";
import { toast } from "sonner";

type AppQuery = Query<unknown, unknown, unknown, readonly unknown[]>;

/** Toast query failures only when there is nothing cached to show (initial load). */
export function shouldToastQueryError(query: AppQuery): boolean {
  if (query.meta?.skipErrorToast) return false;
  return query.state.data === undefined;
}

export function handleQueryError(error: unknown, query: AppQuery) {
  if (!shouldToastQueryError(query)) return;

  const fallback =
    typeof query.meta?.errorMessage === "string"
      ? query.meta.errorMessage
      : "Could not load data. Please try again.";

  const message = getErrorMessage(error, fallback);
  const id = `query-${String(query.queryHash)}`;
  toast.error(message, { id });
}
