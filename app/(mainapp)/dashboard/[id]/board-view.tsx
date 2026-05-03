"use client";

import type { boards, columns } from "@/lib/supabase/models";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";
import { updateBoard } from "../../actions/boardActions";

export type BoardViewBoard = boards & { columns: columns[] };

type BoardViewProps = {
  board: BoardViewBoard;
};

const DEFAULT_BOARD_COLOR = "#3b82f6";

const BOARD_COLOR_SWATCHES: string[] = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#6366f1",
  "#6b7280",
  "#f97316",
  "#14b8a6",
  "#06b6d4",
  "#10b981",
];

function colorFromBoard(color: string | undefined | null): string {
  const c = color?.trim();
  if (!c) return DEFAULT_BOARD_COLOR;
  return c;
}

export function BoardView({ board }: BoardViewProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(DEFAULT_BOARD_COLOR);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const resetFormFromBoard = useCallback(() => {
    setTitle(board.title?.trim() || "");
    setDescription(board.description?.trim() || "");
    setColor(colorFromBoard(board.color));
    setSubmitError(null);
  }, [board.title, board.description, board.color]);

  const handleOpenChange = (open: boolean) => {
    setEditOpen(open);
    if (open) {
      resetFormFromBoard();
    }
  };

  async function handleUpdateBoard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    setIsPending(true);
    try {
      await updateBoard(board.id, {
        title: title.trim() || "Untitled Board",
        description: description.trim() ? description.trim() : null,
        color,
      });
      setEditOpen(false);
      router.refresh();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save changes.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-white p-6 flex-1">
        <div
          className="mb-4 h-2 w-full max-w-xs rounded-full"
          style={{
            backgroundColor: board.color?.trim() || DEFAULT_BOARD_COLOR,
          }}
          aria-hidden
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {board.title ?? "Untitled Board"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {board.description?.trim() || "No description yet."}
        </p>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleOpenChange(true)}
          >
            Edit board
          </Button>
        </div>

        <Dialog open={editOpen} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit board</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateBoard}>
              <div className="space-y-2">
                <Label htmlFor="boardTitle">Board title</Label>
                <Input
                  id="boardTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Board title"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boardDescription">Description</Label>
                <Textarea
                  id="boardDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  className="resize-y min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Board color</Label>
                <div className="grid grid-cols-6 gap-2 sm:grid-cols-6">
                  {BOARD_COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={hex}
                      className={`size-8 rounded-full ring-offset-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                        color === hex
                          ? "ring-2 ring-gray-900"
                          : "ring-0 hover:ring-1 ring-gray-400"
                      }`}
                      style={{ backgroundColor: hex }}
                      onClick={() => setColor(hex)}
                      aria-pressed={color === hex}
                    />
                  ))}
                </div>
              </div>

              {submitError ? (
                <p className="text-sm text-red-600" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {board.columns.length === 0 ? (
          <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
            No columns found for this board.
          </div>
        ) : (
          board.columns.map((column) => (
            <section key={column.id} className="rounded-lg border bg-white p-4">
              <h2 className="font-semibold text-gray-900">
                {column.title ?? "Untitled Column"}
              </h2>
            </section>
          ))
        )}
      </div>
    </>
  );
}
