import { describe, expect, it } from "vitest";
import { DEFAULT_BOARD_COLOR } from "@/components/Dashboard/BoardView/constants";
import {
  activeTaskFilterCount,
  colorFromBoard,
  defaultTaskFilters,
  priorityBadgeClasses,
  taskMatchesFilters,
} from "@/components/Dashboard/BoardView/utils";
import { createTask } from "@/tests/fixtures/tasks";

describe("BoardView utils", () => {
  describe("colorFromBoard", () => {
    it("returns default when color is missing or blank", () => {
      expect(colorFromBoard(undefined)).toBe(DEFAULT_BOARD_COLOR);
      expect(colorFromBoard(null)).toBe(DEFAULT_BOARD_COLOR);
      expect(colorFromBoard("   ")).toBe(DEFAULT_BOARD_COLOR);
    });

    it("returns trimmed color when provided", () => {
      expect(colorFromBoard("  #22c55e  ")).toBe("#22c55e");
    });
  });

  describe("defaultTaskFilters", () => {
    it("starts with empty priority and no due date", () => {
      expect(defaultTaskFilters()).toEqual({
        priority: [],
        dueDate: null,
      });
    });
  });

  describe("activeTaskFilterCount", () => {
    it("counts priority selections and a non-empty due date", () => {
      expect(
        activeTaskFilterCount({
          priority: ["high", "low"],
          dueDate: "2026-05-26",
        }),
      ).toBe(3);
    });

    it("ignores blank due date strings", () => {
      expect(
        activeTaskFilterCount({
          priority: ["medium"],
          dueDate: "   ",
        }),
      ).toBe(1);
    });
  });

  describe("taskMatchesFilters", () => {
    const task = createTask({ priority: "high", due_date: "2026-05-26" });

    it("matches when no filters are active", () => {
      expect(taskMatchesFilters(task, defaultTaskFilters())).toBe(true);
    });

    it("filters by priority", () => {
      expect(
        taskMatchesFilters(task, { priority: ["low"], dueDate: null }),
      ).toBe(false);
      expect(
        taskMatchesFilters(task, { priority: ["high"], dueDate: null }),
      ).toBe(true);
    });

    it("filters by due date (YYYY-MM-DD)", () => {
      expect(
        taskMatchesFilters(task, { priority: [], dueDate: "2026-05-26" }),
      ).toBe(true);
      expect(
        taskMatchesFilters(task, { priority: [], dueDate: "2026-05-27" }),
      ).toBe(false);
    });

    it("excludes tasks without due_date when a due date filter is set", () => {
      const noDue = createTask({ due_date: null });
      expect(
        taskMatchesFilters(noDue, { priority: [], dueDate: "2026-05-26" }),
      ).toBe(false);
    });
  });

  describe("priorityBadgeClasses", () => {
    it("returns distinct classes per priority", () => {
      expect(priorityBadgeClasses("high")).toContain("red");
      expect(priorityBadgeClasses("medium")).toContain("amber");
      expect(priorityBadgeClasses("low")).toContain("muted");
    });
  });
});
