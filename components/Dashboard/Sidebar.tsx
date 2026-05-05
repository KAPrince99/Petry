import Link from "next/link";
import { FolderKanban, Settings, UserCircle2 } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden border-r border-gray-200 bg-gray-50/80 lg:flex lg:w-64 lg:flex-col">
      <div className="border-b border-gray-200 px-5 py-5">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-gray-900">
          Petry
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-gray-200"
        >
          <FolderKanban className="size-4 text-gray-600" />
          Boards
        </Link>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all hover:bg-white hover:text-gray-900"
        >
          <Settings className="size-4" />
          Settings
        </button>
      </nav>
      <div className="border-t border-gray-200 px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-600 transition-all hover:bg-white hover:text-gray-900"
        >
          <UserCircle2 className="size-5" />
          Profile
        </button>
      </div>
    </aside>
  );
}
