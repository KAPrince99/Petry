import {
  normalizeTaskRow,
  normalizeTaskRows,
} from "@/lib/supabase/normalize-task";
import { describe, expect, it } from "vitest";

describe("normalizeTaskRow", () => {
  it("maps common alternate field names", () => {
    const task = normalizeTaskRow({
      id: 1,
      columnId: "col-9",
      name: "  Fix bug  ",
      body: "Details",
      owner: "Sam",
      due_at: "2026-06-01",
      priority: "high",
      position: "2",
      created_at: "2026-01-01",
      updated_at: "2026-01-02",
    });

    expect(task).toMatchObject({
      id: "1",
      column_id: "col-9",
      title: "Fix bug",
      description: "Details",
      assignee: "Sam",
      due_date: "2026-06-01",
      priority: "high",
      sort_order: 2,
    });
  });

  it("returns null when id or column is missing", () => {
    expect(normalizeTaskRow({ title: "Orphan" })).toBeNull();
  });

  it("defaults title and priority when absent", () => {
    const task = normalizeTaskRow({
      id: "t1",
      column_id: "c1",
      priority: "urgent",
    });

    expect(task?.title).toBe("Untitled");
    expect(task?.priority).toBe("medium");
  });
});

describe("normalizeTaskRows", () => {
  it("skips invalid rows", () => {
    expect(
      normalizeTaskRows([
        { id: "a", column_id: "c1", title: "One" },
        null,
        "bad",
        { title: "no id" },
      ]),
    ).toHaveLength(1);
  });
});
