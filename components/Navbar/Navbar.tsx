"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { TreePalm } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center gap-2 text-gray-900">
            <TreePalm className="h-6 w-6 sm:h-8 sm:w-8" />
            {/* <span className="text-xl sm:text-2xl font-bold text-gray-900">
              Petry
            </span> */}
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
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
