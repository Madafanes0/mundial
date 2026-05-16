import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/45 backdrop-blur-md dark:border-white/10 dark:bg-black/35 dark:backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Álbum Mundial 2026
        </Link>
      </div>
    </header>
  );
}
