export const DASHBOARD_QUERY_KEYS = {
  boards: ["boards"] as const,
  board: (boardId: string) => ["board", boardId] as const,
};

export function getBoardRoute(boardId: string) {
  return `/dashboard/${boardId}`;
}
