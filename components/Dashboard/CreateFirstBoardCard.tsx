import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { memo } from "react";

export type CreateFirstBoardCardProps = {
  onCreateBoard: () => void;
};

export const CreateFirstBoardCard = memo(function CreateFirstBoardCard({
  onCreateBoard,
}: CreateFirstBoardCardProps) {
  return (
    <Card
      className="cursor-pointer border-2 border-dashed border-muted-foreground/35 hover:border-primary/60"
      onClick={onCreateBoard}
    >
      <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2">
        <Plus className="size-7 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Create your first board</p>
      </CardContent>
    </Card>
  );
});
