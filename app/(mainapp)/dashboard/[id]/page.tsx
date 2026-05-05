import Link from "next/link";
import { ArrowLeft, FolderKanban, Settings, UserCircle2 } from "lucide-react";
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden border-r border-border bg-muted/40 lg:flex lg:w-64 lg:flex-col dark:bg-muted/20">
          <div className="border-b border-border px-5 py-5">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Petry
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-border"
            >
              <FolderKanban className="size-4 text-muted-foreground" />
              Boards
            </Link>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-background hover:text-foreground"
            >
              <Settings className="size-4" />
              Settings
            </button>
          </nav>
          <div className="border-t border-border px-4 py-4">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-all hover:bg-background hover:text-foreground"
            >
              <UserCircle2 className="size-5" />
              Profile
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground hover:shadow"
                >
                  <ArrowLeft className="size-4" />
                  Back to dashboard
                </Link>
              </div>
            </div>
          </header>
          <div className="px-4 py-6 sm:px-6">
            <BoardView board={board} />
          </div>
        </div>
      </div>
    </main>
  );
}
