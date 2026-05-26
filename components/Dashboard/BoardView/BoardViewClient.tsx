"use client";

import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";
import type { BoardViewBoard } from "@/components/Dashboard/BoardView/types";
import { boardQueryOptions } from "@/lib/react-query/board-queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { BoardLoadingSkeleton } from "./BoardLoadingSkeleton";
import { BoardView } from "./BoardView";

export type BoardViewClientProps = {
  boardId: string;
};

export function BoardViewClient({ boardId }: BoardViewClientProps) {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    ...boardQueryOptions(boardId),
    placeholderData: () =>
      queryClient.getQueryData<BoardViewBoard>(
        DASHBOARD_QUERY_KEYS.board(boardId),
      ),
  });

  if (isPending && !data) {
    return <BoardLoadingSkeleton />;
  }

  if (isError || !data) {
    notFound();
  }

  return <BoardView board={data} />;
}
