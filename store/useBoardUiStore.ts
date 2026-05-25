import {
  activeTaskFilterCount,
  colorFromBoard,
  defaultTaskFilters,
} from "@/components/Dashboard/BoardView/utils";
import type { BoardTaskFilters } from "@/components/Dashboard/BoardView/types";
import { create } from "zustand";

type EditBoardSource = {
  title?: string | null;
  description?: string | null;
  color?: string | null;
};

type BoardUiState = {
  boardId: string | null;

  filterOpen: boolean;
  filters: BoardTaskFilters;

  editOpen: boolean;
  editTitle: string;
  editDescription: string;
  editColor: string;

  createTaskOpen: boolean;

  setBoardScope: (boardId: string) => void;
  resetBoardUi: () => void;

  setFilterOpen: (open: boolean) => void;
  closeFilter: () => void;
  setFilter: <K extends keyof BoardTaskFilters>(
    key: K,
    value: BoardTaskFilters[K],
  ) => void;
  clearFilters: () => void;

  openEditBoard: (board: EditBoardSource) => void;
  closeEdit: () => void;
  setEditOpen: (open: boolean) => void;
  handleEditOpenChange: (open: boolean, board?: EditBoardSource) => void;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  setEditColor: (value: string) => void;

  openCreateTask: () => void;
  closeCreateTask: () => void;
  setCreateTaskOpen: (open: boolean) => void;
};

const initialUiState = {
  boardId: null as string | null,
  filterOpen: false,
  filters: defaultTaskFilters(),
  editOpen: false,
  editTitle: "",
  editDescription: "",
  editColor: colorFromBoard(null),
  createTaskOpen: false,
};

export const selectActiveFilterCount = (state: BoardUiState) =>
  activeTaskFilterCount(state.filters);

export const useBoardUiStore = create<BoardUiState>((set, get) => ({
  ...initialUiState,

  setBoardScope: (boardId) => {
    if (get().boardId === boardId) return;
    set({ ...initialUiState, boardId });
  },

  resetBoardUi: () => set(initialUiState),

  setFilterOpen: (filterOpen) => set({ filterOpen }),
  closeFilter: () => set({ filterOpen: false }),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: defaultTaskFilters() }),

  openEditBoard: (board) =>
    set({
      editOpen: true,
      editTitle: board.title?.trim() || "",
      editDescription: board.description?.trim() || "",
      editColor: colorFromBoard(board.color),
    }),

  closeEdit: () => set({ editOpen: false }),
  setEditOpen: (editOpen) => set({ editOpen }),
  handleEditOpenChange: (open, board) => {
    if (open) {
      if (board) {
        get().openEditBoard(board);
      } else {
        set({ editOpen: true });
      }
      return;
    }
    set({ editOpen: false });
  },

  setEditTitle: (editTitle) => set({ editTitle }),
  setEditDescription: (editDescription) => set({ editDescription }),
  setEditColor: (editColor) => set({ editColor }),

  openCreateTask: () => set({ createTaskOpen: true }),
  closeCreateTask: () => set({ createTaskOpen: false }),
  setCreateTaskOpen: (createTaskOpen) => set({ createTaskOpen }),
}));
