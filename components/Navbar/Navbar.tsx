"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { TreePalm } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex cursor-pointer items-center gap-2 text-foreground">
            <TreePalm className="h-6 w-6 sm:h-8 sm:w-8" />
            {/* <span className="text-xl sm:text-2xl font-bold text-gray-900">
              Petry
            </span> */}
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle variant="segmented" />
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <Button asChild variant="ghost" className="cursor-pointer">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="text-xs sm:text-sm cursor-pointer"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
