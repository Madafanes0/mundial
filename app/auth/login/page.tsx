import Link from "next/link";
import { AuthLoginForm } from "@/components/auth-login-form";
import { isSupabaseConfigured } from "@/lib/env-public";

export default function LoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Inicio de sesión no disponible
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Añade{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          y{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          en <code className="rounded bg-zinc-100 px-1">.env.local</code>.
        </p>
        <Link href="/" className="mt-6 inline-block text-zinc-900 underline dark:text-zinc-100">
          Volver al álbum
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center bg-transparent px-4 py-12">
      <AuthLoginForm />
    </div>
  );
}
