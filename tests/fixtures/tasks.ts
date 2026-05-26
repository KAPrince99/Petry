import type { tasks } from "@/lib/supabase/models";

export function createTask(overrides: Partial<tasks> = {}): tasks {
  return {
    id: "task-1",
    column_id: "col-1",
    title: "Test task",
    description: null,
    assignee: null,
    due_date: null,
    priority: "medium",
    sort_order: 0,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
