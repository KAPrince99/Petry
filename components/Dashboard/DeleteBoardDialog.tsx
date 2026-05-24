"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { memo } from "react";

export type DeleteBoardDialogProps = {
  isDeletingBoard: boolean;
  onConfirmDelete: () => void;
};

export const DeleteBoardDialog = memo(function DeleteBoardDialog({
  isDeletingBoard,
  onConfirmDelete,
}: DeleteBoardDialogProps) {
  const boardToDelete = useDashboardUiStore((s) => s.boardToDelete);
  const deleteConfirmText = useDashboardUiStore((s) => s.deleteConfirmText);
  const setDeleteConfirmText = useDashboardUiStore((s) => s.setDeleteConfirmText);
  const handleDeleteDialogOpenChange = useDashboardUiStore(
    (s) => s.handleDeleteDialogOpenChange,
  );
  const closeDeleteBoard = useDashboardUiStore((s) => s.closeDeleteBoard);

  return (
    <Dialog open={Boolean(boardToDelete)} onOpenChange={handleDeleteDialogOpenChange}>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete board</DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm, type{" "}
            <span className="font-semibold text-foreground">
              {boardToDelete?.title ?? "this board"}
            </span>{" "}
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-board-confirm">Board name</Label>
            <Input
              id="delete-board-confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={boardToDelete?.title ?? "Type board name"}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDeleteBoard}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={
                isDeletingBoard || deleteConfirmText !== (boardToDelete?.title ?? "")
              }
            >
              {isDeletingBoard ? "Deleting..." : "Delete board"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
