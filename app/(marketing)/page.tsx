"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GripVertical,
  MoveRight,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FADE_UP = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

type PreviewTask = {
  id: string;
  title: string;
  tag: string;
};

const PREVIEW_COLUMNS: { title: string; tasks: PreviewTask[] }[] = [
  {
    title: "Tasks",
    tasks: [
      { id: "t1", title: "Write launch copy", tag: "High" },
      { id: "t2", title: "Prepare onboarding flow", tag: "Medium" },
    ],
  },
  {
    title: "In Progress",
    tasks: [{ id: "t3", title: "Design pricing page", tag: "Medium" }],
  },
  {
    title: "Review",
    tasks: [{ id: "t4", title: "Validate mobile spacing", tag: "Low" }],
  },
  {
    title: "Done",
    tasks: [{ id: "t5", title: "Set up board defaults", tag: "Done" }],
  },
];

const FEATURES = [
  {
    title: "Drag & Drop Tasks",
    description: "Move work between stages in seconds with fluid interactions.",
  },
  {
    title: "Clean Workflow",
    description: "A focused layout that keeps projects readable and predictable.",
  },
  {
    title: "Focused Boards",
    description: "Each board is structured for clarity, not complexity.",
  },
  {
    title: "Fast & Responsive",
    description: "Built for speed across desktop and mobile without clutter.",
  },
];

const STEPS = [
  "Create a board for your project.",
  "Add tasks with clear priorities.",
  "Move tasks forward as work progresses.",
];

const BENEFITS = [
  "Stay organized across every project.",
  "Move faster with less context switching.",
  "Reduce mental clutter and keep momentum.",
];

function BoardPreview() {
  return (
    <motion.div
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border bg-white p-3 shadow-sm sm:p-4"
      aria-label="Petry board preview"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PREVIEW_COLUMNS.map((column, idx) => (
          <motion.section
            key={column.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
            className="rounded-xl border bg-zinc-50/70 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">{column.title}</h3>
              <span className="rounded bg-white px-2 py-0.5 text-xs text-zinc-500 ring-1 ring-zinc-200">
                {column.tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {column.tasks.map((task) => (
                <motion.article
                  whileHover={{ y: -2 }}
                  key={task.id}
                  className="rounded-lg border bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-zinc-800">{task.title}</p>
                    <GripVertical className="size-3.5 text-zinc-300" />
                  </div>
                  <span className="inline-flex rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600">
                    {task.tag}
                  </span>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

function HeroWorkspacePreview() {
  return (
    <motion.div
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      aria-label="Petry dashboard and board preview"
    >
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="border-b bg-zinc-50/70 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900">Your Boards</p>
            <span className="text-xs text-zinc-500">4</span>
          </div>
          <button
            type="button"
            className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-sm"
          >
            <Plus className="size-3.5" />
            Create Board
          </button>
          <div className="mb-3 rounded-md border bg-white px-2.5 py-2">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Search className="size-3.5" />
              Search boards...
            </div>
          </div>
          <div className="space-y-1.5">
            {["Website Redesign", "Marketing Launch", "Mobile App", "Bug Triage"].map(
              (board, idx) => (
                <div
                  key={board}
                  className={`rounded-md px-2.5 py-2 text-xs ${
                    idx === 0
                      ? "border bg-white font-medium text-zinc-900"
                      : "text-zinc-600"
                  }`}
                >
                  {board}
                </div>
              ),
            )}
          </div>
        </aside>

        <div className="p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">Website Redesign</p>
              <p className="text-xs text-zinc-500">Move tasks as work progresses</p>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              Add Task
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PREVIEW_COLUMNS.map((column, idx) => (
              <motion.section
                key={column.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.3 }}
                className="rounded-xl border bg-zinc-50/70 p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">{column.title}</h3>
                  <span className="rounded bg-white px-2 py-0.5 text-xs text-zinc-500 ring-1 ring-zinc-200">
                    {column.tasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {column.tasks.map((task) => (
                    <motion.article
                      whileHover={{ y: -2 }}
                      key={task.id}
                      className="rounded-lg border bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-zinc-800">{task.title}</p>
                        <GripVertical className="size-3.5 text-zinc-300" />
                      </div>
                      <span className="inline-flex rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600">
                        {task.tag}
                      </span>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Petry
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up" className="inline-flex items-center gap-2">
              Get Started <MoveRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="py-12 sm:py-16">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 text-sm font-medium text-zinc-500">
              A minimal Kanban workspace
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Manage your work. Without the clutter.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
              Petry gives teams a clean, focused way to plan, track, and ship.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/sign-up" className="inline-flex items-center gap-2">
                  Try Petry <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </motion.div>
          <div className="mt-10">
            <HeroWorkspacePreview />
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Product Preview
            </h2>
            <p className="mt-2 text-zinc-600">
              A board experience built for fast drag-and-drop and clear focus.
            </p>
          </div>
          <BoardPreview />
        </section>

        <section className="py-12 sm:py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Features
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature, idx) => (
              <motion.article
                key={feature.title}
                variants={FADE_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 py-12 sm:grid-cols-2 sm:py-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it Works
            </h2>
            <ol className="mt-5 space-y-3">
              {STEPS.map((step, idx) => (
                <li key={step} className="flex items-start gap-3 text-zinc-700">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why teams choose Petry
            </h2>
            <ul className="mt-5 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-zinc-700">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-zinc-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border bg-zinc-50 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to simplify project management?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-600">
            Start with a clean board and keep momentum from planning to done.
          </p>
          <div className="mt-6 flex justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up" className="inline-flex items-center gap-2">
                Get Started <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Petry</p>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-zinc-800">
              Sign in
            </Link>
            <Link href="/dashboard" className="hover:text-zinc-800">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
