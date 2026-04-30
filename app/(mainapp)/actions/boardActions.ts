"use server";

import { createClient } from "@/lib/supabase/server";
import { boards } from "@/lib/supabase/models";
import { auth } from "@clerk/nextjs/server";

// GET BOARDS
export async function getBoards(): Promise<boards[]> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("boards")
      .select("id, user_id, title, description, color, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    console.log("[getBoards] data:", data);
    console.log("[getBoards] error:", error);

    if (error) throw error;

    return data ?? [];
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw new Error("Failed to fetch boards");
  }
}

// GET SINGLE BOARD
export async function getBoardById(boardId: string): Promise<boards | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("boards")
      .select("id, user_id, title, description, color, created_at, updated_at")
      .eq("id", boardId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching board by id:", error);
    throw new Error("Failed to fetch board");
  }
}

// CREATE BOARD
export async function createBoard(
  board: Omit<boards, "id" | "created_at" | "updated_at" | "user_id">,
): Promise<boards> {
  try {
    const { userId } = await auth();

    console.log("[createBoard] userId:", userId);
    console.log("[createBoard] input board:", board);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("boards")
      .insert({
        ...board,
        user_id: userId,
      })
      .select()
      .single();

    console.log("[createBoard] inserted data:", data);
    console.log("[createBoard] error:", error);

    if (error) throw error;

    if (!data?.id) {
      throw new Error("Board created but no ID returned");
    }

    return data;
  } catch (error) {
    console.error("Error creating board:", error);
    throw new Error("Failed to create board");
  }
}
