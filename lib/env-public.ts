import {
  isLikelyHostedSupabaseUrl,
  readSupabaseAnonKey,
  readSupabaseProjectUrl,
} from "@/lib/supabase/project-env";

/** Variables públicas necesarias para Supabase (auth + álbum en la nube). */
export function isSupabaseConfigured(): boolean {
  const url = readSupabaseProjectUrl();
  const key = readSupabaseAnonKey();
  return Boolean(
    url &&
      key &&
      key.length > 20 &&
      isLikelyHostedSupabaseUrl(url),
  );
}
