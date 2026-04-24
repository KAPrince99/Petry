"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createBoardColumns } from "../actions/bothActions";

export default function DashBoard() {
  const { user } = useUser();

  const dummy = {
    title: "Untitled Board",
    description: "",
    color: "#3b82f6",
  };

  // React Query mutation for creating a board with default columns
  const {
    mutate: createBoard,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async () => createBoardColumns(dummy),
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your boards today.
          </p>

          {/* Create Board Button */}
          <Button
            className="my-4 cursor-pointer hover:bg-blue-600 text-white"
            onClick={() => createBoard()}
            disabled={isPending}
          >
            {isPending ? (
              "Creating..."
            ) : (
              <>
                <Plus className="mr-2" /> Create Board
              </>
            )}
          </Button>

          {/* Optional: Show error or success messages */}
          {isError && (
            <div className="text-red-600 mt-2 text-sm">
              {error instanceof Error ? error.message : "Error creating board."}
            </div>
          )}
          {isSuccess && (
            <div className="text-green-600 mt-2 text-sm">
              Board created successfully!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
