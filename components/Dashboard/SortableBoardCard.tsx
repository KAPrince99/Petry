"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBoardRoute } from "@/lib/dashboard/constants";
import { boardQueryOptions } from "@/lib/react-query/board-queries";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { memo, useCallback } from "react";
import type { BoardItem } from "./types";

export type SortableBoardCardProps = {
  board: BoardItem;
  isHydrated: boolean;
  deleting: boolean;
};

export const SortableBoardCard = memo(function SortableBoardCard({
  board,
  isHydrated,
  deleting,
}: SortableBoardCardProps) {
  const queryClient = useQueryClient();
  const openDeleteBoard = useDashboardUiStore((s) => s.openDeleteBoard);
  const prefetchBoard = useCallback(
    (boardId: string) => {
      void queryClient.prefetchQuery(boardQueryOptions(boardId));
    },
    [queryClient],
  );
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: board.id,
    disabled: !isHydrated,
  });
  const dndProps = isHydrated ? { ...attributes, ...listeners } : {};

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...dndProps}>
      <Link
        href={getBoardRoute(board.id)}
        onMouseEnter={() => prefetchBoard(board.id)}
        onFocus={() => prefetchBoard(board.id)}
      >
        <Card className="group h-full rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div
                className="h-4 w-4 rounded ring-1 ring-border"
                style={{ backgroundColor: board.color ?? "#3b82f6" }}
              />
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  Board
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  disabled={deleting}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openDeleteBoard(board);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <CardTitle className="mb-2 text-base group-hover:text-primary">{board.title}</CardTitle>
            <CardDescription className="mb-4 line-clamp-2 text-sm">
              {board.description ?? "No description yet."}
            </CardDescription>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
              <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
              <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
});
