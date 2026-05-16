import { Suspense } from "react";
import { AlbumBook } from "@/components/album-book";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-transparent">
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center p-8 text-zinc-500">
            Cargando álbum…
          </div>
        }
      >
        <AlbumBook />
      </Suspense>
    </div>
  );
}
