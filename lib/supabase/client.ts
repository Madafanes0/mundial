import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/env-public";
import {
  readSupabaseAnonKey,
  readSupabaseProjectUrl,
} from "@/lib/supabase/project-env";

export function createBrowserSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado en el cliente");
  }
  const url = readSupabaseProjectUrl();
  const key = readSupabaseAnonKey();
  return createBrowserClient(url, key);
}
