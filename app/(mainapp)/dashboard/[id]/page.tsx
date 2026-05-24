import { notFound } from "next/navigation";
import { getBoardWithColumns } from "../../actions/bothActions";
import { BoardView } from "@/components/Dashboard/BoardView";

type BoardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;
  const board = await getBoardWithColumns(id);

  if (!board) {
    notFound();
  }

  return (
    <div className="px-4 py-6 sm:px-6">
      <BoardView board={board} />
    </div>
  );
}
