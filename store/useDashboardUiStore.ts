import { create } from "zustand";
import type { BoardItem, ViewMode } from "@/components/Dashboard/types";

type DashboardUiState = {
  viewMode: ViewMode;
  search: string;
  upgradeDialogOpen: boolean;
  boardToDelete: BoardItem | null;
  deleteConfirmText: string;

  setViewMode: (mode: ViewMode) => void;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  openUpgradeDialog: () => void;
  closeUpgradeDialog: () => void;
  setUpgradeDialogOpen: (open: boolean) => void;
  openDeleteBoard: (board: BoardItem) => void;
  closeDeleteBoard: () => void;
  setDeleteConfirmText: (text: string) => void;
  handleDeleteDialogOpenChange: (open: boolean) => void;
};

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
  viewMode: "grid",
  search: "",
  upgradeDialogOpen: false,
  boardToDelete: null,
  deleteConfirmText: "",

  setViewMode: (viewMode) => set({ viewMode }),
  setSearch: (search) => set({ search }),
  clearSearch: () => set({ search: "" }),
  openUpgradeDialog: () => set({ upgradeDialogOpen: true }),
  closeUpgradeDialog: () => set({ upgradeDialogOpen: false }),
  setUpgradeDialogOpen: (upgradeDialogOpen) => set({ upgradeDialogOpen }),
  openDeleteBoard: (board) => set({ boardToDelete: board, deleteConfirmText: "" }),
  closeDeleteBoard: () => set({ boardToDelete: null, deleteConfirmText: "" }),
  setDeleteConfirmText: (deleteConfirmText) => set({ deleteConfirmText }),
  handleDeleteDialogOpenChange: (open) => {
    if (!open) {
      set({ boardToDelete: null, deleteConfirmText: "" });
    }
  },
}));
