import Navbar from "@/components/Navbar/Navbar";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import React, { ReactNode } from "react";

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </div>
  );
}
