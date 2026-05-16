/** Lee y normaliza URL / anon key (espacios, comillas, barra final). */

/**
 * Usa `process.env["NEXT_PUBLIC_*"]` (corchetes) para que Next no deje el valor
 * “quemado” vacío del primer build en Vercel: se lee en tiempo de ejecución.
 */
function envUrlRaw(): string {
  return process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "";
}

function envAnonRaw(): string {
  return process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "";
}

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
  const raw = stripQuotes(envUrlRaw());
  if (!raw) return "";
  try {
    const u = new URL(raw.replace(/\/+$/, ""));
    return u.origin;
  } catch {
    return "";
  }
}

export function readSupabaseAnonKey(): string {
  return stripQuotes(envAnonRaw());
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
