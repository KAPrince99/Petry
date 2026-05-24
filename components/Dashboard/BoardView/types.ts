import type { boards, columns, tasks } from "@/lib/supabase/models";

export type BoardColumnWithTasks = columns & { tasks: tasks[] };

export type BoardViewBoard = boards & { columns: BoardColumnWithTasks[] };

export type BoardViewProps = {
  board: BoardViewBoard;
};

export type TaskPriority = "low" | "medium" | "high";

export type BoardTaskFilters = {
  priority: TaskPriority[];
  dueDate: string | null;
};

export type FilteredBoardColumn = {
  column: BoardColumnWithTasks;
  tasks: tasks[];
  total: number;
};

export type DragData = {
  type?: "column" | "task" | "column-drop";
  columnId?: string;
  taskId?: string;
};
