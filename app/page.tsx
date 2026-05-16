import { Suspense } from "react";
import { fetchMyAlbumForUser } from "@/app/actions/album";
import { AlbumBook } from "@/components/album-book";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env-public";

export default async function Home() {
  let cloudSnapshot: Awaited<ReturnType<typeof fetchMyAlbumForUser>> = null;
  let userEmail: string | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userEmail = user?.email ?? null;
      if (user) {
        cloudSnapshot = await fetchMyAlbumForUser();
      }
    } catch {
      cloudSnapshot = null;
      userEmail = null;
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-transparent">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center p-8 text-zinc-500">
            Cargando álbum…
          </div>
        }
      >
        <AlbumBook cloudSnapshot={cloudSnapshot} userEmail={userEmail} />
      </Suspense>
    </div>
  );
}
