import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewPlans: () => void;
};

export function UpgradeDialog({ open, onOpenChange, onViewPlans }: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto w-[95vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to create more boards</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Free users can only create one board. Upgrade to create unlimited boards.
          </p>
        </DialogHeader>
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onViewPlans}>View plans</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
