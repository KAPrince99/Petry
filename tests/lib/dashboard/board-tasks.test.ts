import { flattenBoardTasks } from "@/lib/dashboard/board-tasks";
import { createBoard, createColumn } from "@/tests/fixtures/board";
import { createTask } from "@/tests/fixtures/tasks";
import { describe, expect, it } from "vitest";

describe("flattenBoardTasks", () => {
  it("returns all tasks from every column", () => {
    const board = createBoard({
      columns: [
        createColumn({
          id: "c1",
          tasks: [createTask({ id: "t1" }), createTask({ id: "t2" })],
        }),
        createColumn({
          id: "c2",
          tasks: [createTask({ id: "t3" })],
        }),
      ],
    });

    expect(flattenBoardTasks(board).map((t) => t.id)).toEqual(["t1", "t2", "t3"]);
  });

  it("returns an empty array when there are no tasks", () => {
    expect(flattenBoardTasks(createBoard({ columns: [createColumn({ tasks: [] })] }))).toEqual(
      [],
    );
  });
});
