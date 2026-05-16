import Link from "next/link";
import { AuthLoginForm } from "@/components/auth-login-form";
import { isSupabaseConfigured } from "@/lib/env-public";
import {
  readSupabaseAnonKey,
  readSupabaseProjectUrl,
} from "@/lib/supabase/project-env";

export default function LoginPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Inicio de sesión no disponible
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          En tu PC crea{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            .env.local
          </code>{" "}
          con{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          (https://….supabase.co) y{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          .
        </p>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          En Vercel: mismas variables para Production y, si desarrollas en local con{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">vercel dev</code>, marca también{" "}
          <strong>Development</strong>. Después haz{" "}
          <strong>Redeploy</strong> (o “Redeploy sin caché”).
        </p>
        <Link href="/" className="mt-6 inline-block text-zinc-900 underline dark:text-zinc-100">
          Volver al álbum
        </Link>
      </div>
    );
  }

  const credentials = {
    url: readSupabaseProjectUrl(),
    anonKey: readSupabaseAnonKey(),
  };

  return (
    <div className="flex flex-1 flex-col justify-center bg-transparent px-4 py-12">
      <AuthLoginForm credentials={credentials} />
    </div>
  );
}
