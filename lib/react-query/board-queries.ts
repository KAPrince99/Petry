import { getBoards } from "@/app/(mainapp)/actions/boardActions";
import { getBoardWithColumns } from "@/app/(mainapp)/actions/bothActions";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";

export function boardsQueryOptions() {
  return {
    queryKey: DASHBOARD_QUERY_KEYS.boards,
    queryFn: getBoards,
    staleTime: 60_000,
  };
}

export function boardQueryOptions(boardId: string) {
  return {
    queryKey: DASHBOARD_QUERY_KEYS.board(boardId),
    staleTime: 60_000,
    queryFn: async () => {
      const board = await getBoardWithColumns(boardId);
      if (!board) {
        throw new Error("Board not found");
      }
      return board;
    },
  };
}
