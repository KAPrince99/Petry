import { BoardView } from "@/components/Dashboard/BoardView";
import type { BoardViewBoard } from "@/components/Dashboard/BoardView/types";
import { DASHBOARD_QUERY_KEYS } from "@/lib/dashboard/constants";
import { boardQueryOptions } from "@/lib/react-query/board-queries";
import { getQueryClient } from "@/lib/react-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

type BoardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(boardQueryOptions(id));
  } catch {
    notFound();
  }

  const board = queryClient.getQueryData<BoardViewBoard>(
    DASHBOARD_QUERY_KEYS.board(id),
  );
  if (!board) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 py-6 sm:px-6">
        <BoardView board={board} />
      </div>
    </HydrationBoundary>
  );
}
