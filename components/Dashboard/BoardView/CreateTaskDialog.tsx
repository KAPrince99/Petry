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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { memo, type FormEvent } from "react";
import { PRIORITIES } from "./constants";

export type CreateTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskSubmitError: string | null;
  isTaskPending: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export const CreateTaskDialog = memo(function CreateTaskDialog({
  open,
  onOpenChange,
  taskSubmitError,
  isTaskPending,
  onSubmit,
}: CreateTaskDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" className="cursor-pointer">
          <Plus />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a task to the board. It will be placed in the first column.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Input id="assignee" name="assignee" placeholder="Who should do this?" />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" id="dueDate" name="dueDate" />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            {taskSubmitError ? (
              <p className="w-full text-sm text-red-600" role="alert">
                {taskSubmitError}
              </p>
            ) : null}
            <Button type="submit" disabled={isTaskPending}>
              {isTaskPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});
