"use server";

import {
  createEmptyAlbum,
  normalizeAlbumPayload,
  type AlbumPersisted,
} from "@/lib/album-storage";
import { isSupabaseConfigured } from "@/lib/env-public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function saveMyAlbum(
  album: AlbumPersisted,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase no configurado" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "No autenticado" };

    const payload = normalizeAlbumPayload(album);
    const { error } = await supabase.from("albums").upsert(
      {
        user_id: user.id,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return { ok: false, error: msg };
  }
}

export async function fetchMyAlbumForUser(): Promise<AlbumPersisted | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("albums")
      .select("payload")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data?.payload) return createEmptyAlbum();
    return normalizeAlbumPayload(data.payload);
  } catch {
    return createEmptyAlbum();
  }
}
