export const DASHBOARD_QUERY_KEYS = {
  boards: ["boards"] as const,
};

export function getBoardRoute(boardId: string) {
  return `/dashboard/${boardId}`;
}
