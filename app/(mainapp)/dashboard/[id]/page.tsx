import { BoardViewClient } from "@/components/Dashboard/BoardView/BoardViewClient";

type BoardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return (
    <div className="px-4 py-6 sm:px-6">
      <BoardViewClient boardId={id} />
    </div>
  );
}
