import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/env-public";
import {
  readSupabaseAnonKey,
  readSupabaseProjectUrl,
} from "@/lib/supabase/project-env";

export async function createServerSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / ANON_KEY no configuradas");
  }

  const cookieStore = await cookies();

  return createServerClient(
    readSupabaseProjectUrl(),
    readSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // RSC: cookies de solo lectura
          }
        },
      },
    },
  );
}
