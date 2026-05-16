import { createBrowserClient } from "@supabase/ssr";
import {
  isLikelyHostedSupabaseUrl,
  readSupabaseAnonKey,
  readSupabaseProjectUrl,
} from "@/lib/supabase/project-env";

export interface SupabasePublicCredentials {
  url: string;
  anonKey: string;
}

export function createBrowserSupabaseClient(
  credentials?: SupabasePublicCredentials | null,
): ReturnType<typeof createBrowserClient> {
  const url = credentials?.url ?? readSupabaseProjectUrl();
  const anonKey = credentials?.anonKey ?? readSupabaseAnonKey();

  if (
    !url ||
    !anonKey ||
    anonKey.length < 20 ||
    !isLikelyHostedSupabaseUrl(url)
  ) {
    throw new Error("Supabase no está configurado en el cliente");
  }

  return createBrowserClient(url, anonKey);
}
