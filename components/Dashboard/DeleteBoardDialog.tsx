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
import type { BoardItem } from "./types";

type DeleteBoardDialogProps = {
  boardToDelete: BoardItem | null;
  deleteConfirmText: string;
  onDeleteConfirmTextChange: (value: string) => void;
  isDeletingBoard: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirmDelete: () => void;
};

export function DeleteBoardDialog({
  boardToDelete,
  deleteConfirmText,
  onDeleteConfirmTextChange,
  isDeletingBoard,
  onOpenChange,
  onCancel,
  onConfirmDelete,
}: DeleteBoardDialogProps) {
  return (
    <Dialog open={Boolean(boardToDelete)} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete board</DialogTitle>
          <DialogDescription>
            This action cannot be undone. To confirm, type{" "}
            <span className="font-semibold text-gray-900">{boardToDelete?.title ?? "this board"}</span> below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-board-confirm">Board name</Label>
            <Input
              id="delete-board-confirm"
              value={deleteConfirmText}
              onChange={(e) => onDeleteConfirmTextChange(e.target.value)}
              placeholder={boardToDelete?.title ?? "Type board name"}
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={isDeletingBoard || deleteConfirmText !== (boardToDelete?.title ?? "")}
            >
              {isDeletingBoard ? "Deleting..." : "Delete board"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
