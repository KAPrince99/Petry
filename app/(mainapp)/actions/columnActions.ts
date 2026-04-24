"use server";

import { createClient } from "@/lib/supabase/server";
import { columns } from "@/lib/supabase/models";
import { auth } from "@clerk/nextjs/server";

export async function createColumn(
  column: Omit<columns, "id" | "created_at">,
): Promise<columns> {
  try {
    const { userId } = await auth();

    console.log("[createColumn] userId:", userId);
    console.log("[createColumn] input column:", column);

    if (!userId) throw new Error("Unauthorized");

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("columns")
      .insert({
        title: column.title,
        sort_order: column.sort_order,
        board_id: column.board_id,
      })
      .select("*")
      .single();

    console.log("[createColumn] inserted data:", data);
    console.log("[createColumn] error:", error);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating column:", error);
    throw new Error("Failed to create column");
  }
}
