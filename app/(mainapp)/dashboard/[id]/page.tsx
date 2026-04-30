import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoardWithColumns } from "../../actions/bothActions";

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
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
      <div className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {board.title ?? "Untitled Board"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {board.description?.trim() || "No description yet."}
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {board.columns.length === 0 ? (
          <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
            No columns found for this board.
          </div>
        ) : (
          board.columns.map((column) => (
            <section key={column.id} className="rounded-lg border bg-white p-4">
              <h2 className="font-semibold text-gray-900">
                {column.title ?? "Untitled Column"}
              </h2>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
