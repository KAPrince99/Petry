import type { ReactNode } from "react";
import Link from "next/link";
import { TreePalm } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_55%,#f8fafc_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16">
          <Link
            href="/"
            className="flex w-fit items-center gap-3 text-slate-900 transition-opacity hover:opacity-80"
          >
            <TreePalm className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-semibold tracking-tight">Petry</span>
          </Link>

          <div className="max-w-xl space-y-8">
            <div className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-sm font-medium text-blue-700 shadow-sm backdrop-blur-sm">
              Pet care, organized end to end
            </div>

            <div className="space-y-4">
              <h1 className="max-w-lg text-5xl font-semibold tracking-tight text-slate-950">
                Keep every appointment, task, and pet detail in one place.
              </h1>
              <p className="max-w-md text-lg leading-8 text-slate-600">
                Sign in to manage your workflow or create an account to start
                building your pet care workspace.
              </p>
            </div>

            <div className="grid max-w-lg gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-blue-100/60 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-500">Scheduling</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  Fewer missed visits
                </p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-slate-950 p-5 shadow-lg shadow-slate-900/10">
                <p className="text-sm font-medium text-slate-400">
                  Collaboration
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  Shared pet records
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Built for teams that need a calm, reliable place to run daily pet
            care operations.
          </p>
        </section>

        <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/88 p-4 shadow-2xl shadow-blue-100/70 backdrop-blur-xl sm:p-6">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
