"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SupabasePublicCredentials } from "@/lib/supabase/client";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface LogoutButtonProps {
  credentials: SupabasePublicCredentials;
}

export function LogoutButton({ credentials }: LogoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient(credentials);
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={pending}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
    >
      {pending ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
