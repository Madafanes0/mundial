/** Mensajes cuando Supabase devuelve HTML (URL mal configurada). */

export function parseSupabaseAuthError(err: unknown): string {
  const raw =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";

  if (
    raw.includes("Unexpected token") ||
    raw.includes("<!DOCTYPE") ||
    raw.includes("DOCTYPE html")
  ) {
    return (
      "La URL de Supabase no es válida: NEXT_PUBLIC_SUPABASE_URL debe ser exactamente la " +
      '"Project URL" de Supabase (https://TU_REF.supabase.co), no la URL de Vercel ni la del dashboard. ' +
      "Quita barras / al final y comillas. En Vercel, guarda las variables y haz Redeploy."
    );
  }

  return raw || "No se pudo completar la operación.";
}
