import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-zinc-800 bg-[#0f1012] px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-2 text-zinc-100 transition-opacity hover:opacity-80"
          >
            <span className="text-3xl font-semibold tracking-tight">Petry</span>
          </Link>

          <div className="max-w-lg space-y-4">
            <p className="text-base font-medium text-zinc-400">Project management, simplified</p>
            <h1 className="text-5xl font-semibold tracking-tight text-white xl:text-6xl">
              Work clearly with Petry.
            </h1>
            <p className="text-lg text-zinc-400">
              Sign in to continue, or create an account to get started.
            </p>
          </div>

          <Link href="/" className="text-base text-zinc-400 hover:text-zinc-200">
            Back to home
          </Link>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-[#121316] p-5 shadow-2xl shadow-black/30 sm:p-7">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
