"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { memo, type FormEvent } from "react";
import { BOARD_COLOR_SWATCHES } from "./constants";

export type EditBoardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  color: string;
  submitError: string | null;
  isPending: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const EditBoardDialog = memo(function EditBoardDialog({
  open,
  onOpenChange,
  title,
  description,
  color,
  submitError,
  isPending,
  onTitleChange,
  onDescriptionChange,
  onColorChange,
  onSubmit,
}: EditBoardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="cursor-pointer">
          Edit board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit board</DialogTitle>
          <DialogDescription>
            Update this board&apos;s title, description, and color.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="boardTitle">Board title</Label>
            <Input
              id="boardTitle"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Board title"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="boardDescription">Description</Label>
            <Textarea
              id="boardDescription"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="min-h-[80px] resize-y"
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
                  className={`size-8 rounded-full ring-offset-2 ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    color === hex
                      ? "ring-2 ring-foreground"
                      : "ring-0 ring-muted-foreground/40 hover:ring-1"
                  }`}
                  style={{ backgroundColor: hex }}
                  onClick={() => onColorChange(hex)}
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
              onClick={() => onOpenChange(false)}
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
  );
});
