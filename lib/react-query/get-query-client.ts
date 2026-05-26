import { getErrorMessage } from "@/lib/errors/get-error-message";
import { handleQueryError } from "@/lib/react-query/query-cache-handlers";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";
import { toast } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => handleQueryError(error, query),
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.skipErrorToast) return;
        const fallback =
          typeof mutation.meta?.errorMessage === "string"
            ? mutation.meta.errorMessage
            : "Something went wrong. Please try again.";
        const message = getErrorMessage(error, fallback);
        const id =
          typeof mutation.meta?.toastId === "string"
            ? mutation.meta.toastId
            : message;
        toast.error(message, { id });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
