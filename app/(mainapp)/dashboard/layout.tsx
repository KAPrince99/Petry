import { DashboardQueryWarmup } from "@/components/Dashboard/DashboardQueryWarmup";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import type { ReactNode } from "react";

/** Clerk auth and Supabase reads use headers(); must not static-prerender at build. */
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <Sidebar />
        <DashboardQueryWarmup />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
