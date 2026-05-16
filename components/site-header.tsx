import Link from "next/link";
import { Suspense } from "react";
import { LogoutButton } from "@/components/logout-button";
import { isSupabaseConfigured } from "@/lib/env-public";
import {
  readSupabaseAnonKey,
  readSupabaseProjectUrl,
} from "@/lib/supabase/project-env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/45 backdrop-blur-md dark:border-white/10 dark:bg-black/35 dark:backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Álbum Mundial 2026
        </Link>

        {!isSupabaseConfigured() ? (
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Modo local: crea{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
              .env.local
            </code>{" "}
            con tus credenciales de Supabase.
          </p>
        ) : (
          <Suspense
            fallback={
              <div className="h-9 w-40 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700" />
            }
          >
            <AuthArea />
          </Suspense>
        )}
      </div>
    </header>
  );
}

async function AuthArea() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const credentials = {
    url: readSupabaseProjectUrl(),
    anonKey: readSupabaseAnonKey(),
  };

  if (!user) {
    return (
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/auth/login"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/auth/register"
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Crear cuenta
        </Link>
      </nav>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="max-w-[200px] truncate text-zinc-600 dark:text-zinc-300">
        {user.email}
      </span>
      <LogoutButton credentials={credentials} />
    </div>
  );
}
