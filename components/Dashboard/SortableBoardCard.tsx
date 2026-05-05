"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBoardRoute } from "@/lib/dashboard/constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import type { BoardItem } from "./types";

type SortableBoardCardProps = {
  board: BoardItem;
  isHydrated: boolean;
  onDelete: (board: BoardItem) => void;
  deleting: boolean;
};

export function SortableBoardCard({ board, isHydrated, onDelete, deleting }: SortableBoardCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: board.id,
    disabled: !isHydrated,
  });
  const dndProps = isHydrated ? { ...attributes, ...listeners } : {};

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...dndProps}>
      <Link href={getBoardRoute(board.id)}>
        <Card className="group h-full rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div
                className="h-4 w-4 rounded ring-1 ring-black/10"
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
                  className="size-7 text-gray-500 hover:text-red-600"
                  disabled={deleting}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(board);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <CardTitle className="mb-2 text-base group-hover:text-blue-600">{board.title}</CardTitle>
            <CardDescription className="mb-4 line-clamp-2 text-sm">
              {board.description ?? "No description yet."}
            </CardDescription>
            <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:justify-between">
              <span>Created {new Date(board.created_at).toLocaleDateString()}</span>
              <span>Updated {new Date(board.updated_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
