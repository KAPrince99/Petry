import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardWithColumns } from "../../actions/bothActions";
import { BoardView } from "./board-view";

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
    <main className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>

      <BoardView board={board} />
    </main>
  );
}
