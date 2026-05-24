"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardUiStore } from "@/store/useDashboardUiStore";
import { useRouter } from "next/navigation";
import { memo } from "react";

export const UpgradeDialog = memo(function UpgradeDialog() {
  const router = useRouter();
  const open = useDashboardUiStore((s) => s.upgradeDialogOpen);
  const setUpgradeDialogOpen = useDashboardUiStore((s) => s.setUpgradeDialogOpen);

  return (
    <Dialog open={open} onOpenChange={setUpgradeDialogOpen}>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to create more boards</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Free users can only create one board. Upgrade to create unlimited boards.
          </p>
        </DialogHeader>
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => router.push("/")}>View plans</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
