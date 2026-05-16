/** Lee y normaliza URL / anon key (espacios, comillas, barra final). */

function stripQuotes(s: string): string {
  const t = s.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1).trim();
  }
  return t;
}

export function readSupabaseProjectUrl(): string {
  const raw = stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (!raw) return "";
  try {
    const u = new URL(raw.replace(/\/+$/, ""));
    return u.origin;
  } catch {
    return "";
  }
}

export function readSupabaseAnonKey(): string {
  return stripQuotes(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
}

/** La URL debe ser el host de proyecto hospedado (.supabase.co). */
export function isLikelyHostedSupabaseUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}
