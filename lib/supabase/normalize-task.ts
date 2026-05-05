import type { tasks } from "@/lib/supabase/models";

/** Maps arbitrary `tasks` table rows (different column names) onto app `tasks` shape. */
export function normalizeTaskRow(
  row: Record<string, unknown>,
): tasks | null {
  const id = row.id != null ? String(row.id) : "";
  const columnRaw = row.column_id ?? row.columnId;
  const column_id =
    typeof columnRaw === "string"
      ? columnRaw
      : columnRaw != null
        ? String(columnRaw)
        : "";
  if (!id || !column_id) return null;

  const rawTitle =
    row.title ??
    row.name ??
    row.task_title ??
    row.label ??
    row.summary ??
    row.text;
  const title =
    typeof rawTitle === "string" && rawTitle.trim().length > 0
      ? rawTitle.trim()
      : "Untitled";

  const rawDesc =
    row.description ??
    row.body ??
    row.content ??
    row.notes ??
    row.details;
  const description =
    rawDesc == null ? null : typeof rawDesc === "string" ? rawDesc : String(rawDesc);

  const rawAssign =
    row.assignee ?? row.owner ?? row.assigned_to ?? row.assignee_name;
  const assignee =
    rawAssign == null ? null : typeof rawAssign === "string" ? rawAssign : String(rawAssign);

  const rawDue = row.due_date ?? row.due_at ?? row.deadline;
  const due_date =
    rawDue == null ? null : typeof rawDue === "string" ? rawDue : String(rawDue);

  const pri = row.priority;
  const priority: tasks["priority"] =
    pri === "low" || pri === "medium" || pri === "high" ? pri : "medium";

  const sortRaw = row.sort_order ?? row.sortOrder ?? row.position;
  const sort_order =
    typeof sortRaw === "number"
      ? sortRaw
      : typeof sortRaw === "string"
        ? Number.parseInt(sortRaw, 10) || 0
        : 0;

  const created_at =
    typeof row.created_at === "string"
      ? row.created_at
      : row.created_at != null
        ? String(row.created_at)
        : "";
  const updated_at =
    typeof row.updated_at === "string"
      ? row.updated_at
      : row.updated_at != null
        ? String(row.updated_at)
        : created_at;

  return {
    id,
    column_id,
    title,
    description,
    assignee,
    due_date,
    priority,
    sort_order,
    created_at,
    updated_at,
  };
}

export function normalizeTaskRows(rows: unknown[] | null | undefined): tasks[] {
  if (!rows?.length) return [];
  const out: tasks[] = [];
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const t = normalizeTaskRow(r as Record<string, unknown>);
    if (t) out.push(t);
  }
  return out;
}
