"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SupabasePublicCredentials } from "@/lib/supabase/client";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { parseSupabaseAuthError } from "@/lib/supabase/auth-errors";

interface AuthRegisterFormProps {
  credentials: SupabasePublicCredentials;
}

export function AuthRegisterForm({ credentials }: AuthRegisterFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient(credentials);
      const origin = window.location.origin;
      const { error: signError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      setInfo(
        "Si tu proyecto exige confirmar el correo, revisa la bandeja de entrada. " +
          "Puedes desactivar la confirmación en Supabase (Authentication → Providers → Email) para pruebas.",
      );
      router.refresh();
    } catch (err) {
      setError(parseSupabaseAuthError(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="mx-auto flex max-w-sm flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <div>
        <h1 className="font-serif text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Crear cuenta
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Cada usuario tiene su propio álbum en la base de datos.
        </p>
      </div>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Correo
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </label>

      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Contraseña (mín. 6 caracteres)
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </label>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="text-sm text-emerald-800 dark:text-emerald-300" role="status">
          {info}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? "Creando…" : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="font-medium text-zinc-900 underline dark:text-zinc-100">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
