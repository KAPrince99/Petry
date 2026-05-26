"use client";

import { boardsQueryOptions } from "@/lib/react-query/board-queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/** Keeps the boards list warm while viewing any `/dashboard/*` route. */
export function DashboardQueryWarmup() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery(boardsQueryOptions());
  }, [queryClient]);

  return null;
}
