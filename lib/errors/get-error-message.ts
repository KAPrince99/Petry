const NETWORK_PATTERNS = [
  /failed to fetch/i,
  /network error/i,
  /networkrequestfailed/i,
  /load failed/i,
  /fetch failed/i,
];

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (error instanceof Error) {
    const message = error.message.trim();
    if (message) {
      if (NETWORK_PATTERNS.some((p) => p.test(message))) {
        return "Could not reach the server. Check your connection and try again.";
      }
      if (/not authenticated|unauthorized/i.test(message)) {
        return "Your session expired. Please sign in again.";
      }
      return message;
    }
  }

  return fallback;
}
