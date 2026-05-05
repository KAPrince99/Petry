import type { boards } from "@/lib/supabase/models";

export type ViewMode = "grid" | "list";

export type BoardItem = boards;

export type BoardFilters = {
  search: string;
  dateRange: { start: string | null; end: string | null };
};
