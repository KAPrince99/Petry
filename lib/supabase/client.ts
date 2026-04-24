"use client";

import { useSession } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (accessToken?: () => Promise<string | null>) => {
  return createBrowserClient(supabaseUrl!, supabaseKey!, {
    ...(accessToken ? { accessToken } : {}),
  });
};

export const useSupabaseClient = () => {
  const { session } = useSession();

  return createClient(async () => session?.getToken() ?? null);
};
