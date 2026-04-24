export interface boards {
  id: string;
  title?: string;
  description?: string;
  color?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface columns {
  id: string;
  board_id: string;
  title?: string;
  sort_order: number;
  created_at: string;
}

export interface tasks {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  sort_order: number;
  created_at: string;
  updated_at: string;
}
