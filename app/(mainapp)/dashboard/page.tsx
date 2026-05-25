import { DashboardClient } from "@/components/Dashboard/DashboardClient";
import { boardsQueryOptions } from "@/lib/react-query/board-queries";
import { getQueryClient } from "@/lib/react-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(boardsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
}
