import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export const createClient = async () => {
  const cookieStore = await cookies();
  const { getToken } = await auth();
  const token = await getToken();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op
        },
      },

      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    },
  );
};
