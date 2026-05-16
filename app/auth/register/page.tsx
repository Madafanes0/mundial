import Link from "next/link";
import { AuthRegisterForm } from "@/components/auth-register-form";
import { isSupabaseConfigured } from "@/lib/env-public";

export default function RegisterPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Registro no disponible
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Configura las variables de Supabase en{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">.env.local</code>.
        </p>
        <Link href="/" className="mt-6 inline-block text-zinc-900 underline dark:text-zinc-100">
          Volver al álbum
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center bg-transparent px-4 py-12">
      <AuthRegisterForm />
    </div>
  );
}
