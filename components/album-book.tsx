"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TeamFlag } from "@/components/team-flag";
import {
  CARDS_PER_TEAM,
  TEAMS,
  formatCardLabel,
  type TeamEntry,
} from "@/data/teams";
import {
  COCA_CARD_COUNT,
  formatCocaLabel,
  formatHistoryLabel,
  HISTORY_CARD_COUNT,
} from "@/data/special-sections";
import { getTeamFlagPageBackground } from "@/data/team-flag-themes";
import {
  type AlbumPersisted,
  createEmptyAlbum,
  loadAlbumFromStorage,
  saveAlbumToStorage,
  setCountForSpecial,
} from "@/lib/album-storage";
import { listDuplicates, totalDuplicateStickers } from "@/lib/duplicates";

const COCA_PAGE_INDEX = 1 + TEAMS.length;
const HISTORY_PAGE_INDEX = 2 + TEAMS.length;
const REPEATED_PAGE_INDEX = 3 + TEAMS.length;
const TOTAL_PAGES = 1 + TEAMS.length + 3;

const SURFACE_COVER =
  "linear-gradient(165deg, rgba(250,248,245,1) 0%, rgba(228,228,231,0.35) 100%)";
const SURFACE_COCA =
  "linear-gradient(155deg, rgba(153,27,27,0.55) 0%, #fff1f2 38%, rgba(127,29,29,0.45) 100%)";
const SURFACE_HISTORY =
  "linear-gradient(155deg, rgba(30,58,138,0.5) 0%, #eff6ff 40%, rgba(29,78,216,0.4) 100%)";
const SURFACE_REPEATED =
  "linear-gradient(155deg, rgba(180,83,9,0.35) 0%, #fffbeb 42%, rgba(234,88,12,0.32) 100%)";

function cardIndexFromNumber(cardNumber: number): number {
  return cardNumber - 1;
}

function setCountForCard(
  album: AlbumPersisted,
  teamCode: string,
  cardNumber: number,
  next: number,
): AlbumPersisted {
  const idx = cardIndexFromNumber(cardNumber);
  const row = [...(album.countsByTeam[teamCode] ?? [])];
  while (row.length < CARDS_PER_TEAM) row.push(0);
  row[idx] = Math.max(0, Math.min(99, next));
  return {
    ...album,
    countsByTeam: { ...album.countsByTeam, [teamCode]: row },
  };
}

/** Marca las 20 cartas del equipo con cantidad 1 cada una. */
function setTeamAllToOnes(album: AlbumPersisted, teamCode: string): AlbumPersisted {
  const row = Array.from({ length: CARDS_PER_TEAM }, () => 1);
  return {
    ...album,
    countsByTeam: { ...album.countsByTeam, [teamCode]: row },
  };
}

function teamProgress(teamCode: string, album: AlbumPersisted): string {
  const row = album.countsByTeam[teamCode] ?? [];
  let withAtLeastOne = 0;
  for (let i = 0; i < CARDS_PER_TEAM; i++) {
    if ((row[i] ?? 0) >= 1) withAtLeastOne++;
  }
  return `${withAtLeastOne}/${CARDS_PER_TEAM}`;
}

function rowProgress(row: number[] | undefined, len: number): string {
  const r = row ?? [];
  let withAtLeastOne = 0;
  for (let i = 0; i < len; i++) {
    if ((r[i] ?? 0) >= 1) withAtLeastOne++;
  }
  return `${withAtLeastOne}/${len}`;
}

function totalAlbumProgress(album: AlbumPersisted): { filled: number; slots: number } {
  let filled = 0;
  let slots = 0;
  for (const t of TEAMS) {
    slots += CARDS_PER_TEAM;
    const row = album.countsByTeam[t.code] ?? [];
    for (let i = 0; i < CARDS_PER_TEAM; i++) {
      if ((row[i] ?? 0) >= 1) filled++;
    }
  }
  slots += COCA_CARD_COUNT + HISTORY_CARD_COUNT;
  for (let i = 0; i < COCA_CARD_COUNT; i++) {
    if ((album.cocaCounts[i] ?? 0) >= 1) filled++;
  }
  for (let i = 0; i < HISTORY_CARD_COUNT; i++) {
    if ((album.historyCounts[i] ?? 0) >= 1) filled++;
  }
  return { filled, slots };
}

function innerSurfaceBackground(page: number): string {
  if (page === 0) return SURFACE_COVER;
  if (page >= 1 && page <= TEAMS.length)
    return getTeamFlagPageBackground(TEAMS[page - 1]!.code);
  if (page === COCA_PAGE_INDEX) return SURFACE_COCA;
  if (page === HISTORY_PAGE_INDEX) return SURFACE_HISTORY;
  if (page === REPEATED_PAGE_INDEX) return SURFACE_REPEATED;
  return SURFACE_COVER;
}

function dotLabel(pageIndex: number): string {
  if (pageIndex === 0) return "Portada";
  if (pageIndex <= TEAMS.length) return TEAMS[pageIndex - 1]!.code;
  if (pageIndex === COCA_PAGE_INDEX) return "Coca";
  if (pageIndex === HISTORY_PAGE_INDEX) return "Hist";
  return "Rep";
}

export function AlbumBook() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(0);
  const [album, setAlbum] = useState<AlbumPersisted>(() => createEmptyAlbum());

  useEffect(() => {
    setAlbum(loadAlbumFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveAlbumToStorage(album);
  }, [album, ready]);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(TOTAL_PAGES - 1, p + 1));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const teamForPage: TeamEntry | null =
    page >= 1 && page <= TEAMS.length ? TEAMS[page - 1] ?? null : null;

  const progress = useMemo(() => totalAlbumProgress(album), [album]);
  const pageBg = useMemo(() => innerSurfaceBackground(page), [page]);
  const dupes = useMemo(() => listDuplicates(album), [album]);
  const dupTotal = useMemo(() => totalDuplicateStickers(dupes), [dupes]);

  function bump(teamCode: string, cardNumber: number, delta: number) {
    setAlbum((a) => {
      const idx = cardIndexFromNumber(cardNumber);
      const cur = a.countsByTeam[teamCode]?.[idx] ?? 0;
      return setCountForCard(a, teamCode, cardNumber, cur + delta);
    });
  }

  function bumpSpecial(section: "coca" | "history", cardNumber: number, delta: number) {
    setAlbum((a) => {
      const idx = cardIndexFromNumber(cardNumber);
      const key = section === "coca" ? "cocaCounts" : "historyCounts";
      const cur = a[key][idx] ?? 0;
      return setCountForSpecial(a, section, cardNumber, cur + delta);
    });
  }

  function fillTeamAllOnes(teamCode: string) {
    setAlbum((a) => setTeamAllToOnes(a, teamCode));
  }

  const saveHint = "Se guarda en este navegador (local).";

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg bg-black/15 p-12 text-zinc-200 backdrop-blur-sm dark:bg-black/25 dark:text-zinc-300">
        Cargando álbum…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
      <header className="mb-4 shrink-0 rounded-lg border border-black/10 bg-white/40 px-3 py-3 pb-4 backdrop-blur-sm dark:border-white/10 dark:bg-black/25 dark:backdrop-blur-sm sm:px-4">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Álbum interactivo
        </p>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Mundial 2026
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Progreso: {progress.filled} de {progress.slots} cromos distintos · {saveHint}
        </p>
      </header>

      <div
        className="relative flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-lg border border-black/15 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-sm dark:border-white/15 dark:bg-black/25 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:backdrop-blur-sm sm:min-h-[480px]"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.2), 0 12px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div className="absolute left-0 top-0 h-full w-3 rounded-l-lg bg-linear-to-r from-black/10 to-transparent dark:from-black/30" />

        <div
          className="flex flex-1 flex-col pl-5 pr-4 pt-5 pb-4 sm:pl-8 sm:pr-6 sm:pt-8"
          style={{ background: pageBg }}
        >
          {page === 0 ? (
            <CoverPage dupTotal={dupTotal} />
          ) : teamForPage ? (
            <TeamPage
              team={teamForPage}
              album={album}
              onBump={bump}
              onFillTeamAllOnes={fillTeamAllOnes}
              pageLabel={`${page} / ${TEAMS.length}`}
            />
          ) : page === COCA_PAGE_INDEX ? (
            <SpecialStickerPage
              title="Coca-Cola"
              subtitle="Edición especial · 14 cromos"
              accentClass="flex flex-col rounded-md border border-red-800/35 bg-red-600/10 p-2 shadow-sm text-red-950 dark:border-red-400/35 dark:bg-red-950/45 dark:text-red-50"
              headerClass="border-red-900/20 text-red-950 dark:border-red-400/25 dark:text-red-50"
              cardCount={COCA_CARD_COUNT}
              formatLabel={formatCocaLabel}
              row={album.cocaCounts}
              onBump={(n, d) => bumpSpecial("coca", n, d)}
              pageLabel="Sección especial"
            />
          ) : page === HISTORY_PAGE_INDEX ? (
            <SpecialStickerPage
              title="Historia del Mundial"
              subtitle="FIFA World Cup History · 19 cromos"
              accentClass="flex flex-col rounded-md border border-blue-900/40 bg-blue-700/12 p-2 shadow-sm text-blue-950 dark:border-blue-300/35 dark:bg-blue-950/50 dark:text-blue-50"
              headerClass="border-blue-900/25 text-blue-950 dark:border-blue-300/25 dark:text-blue-50"
              cardCount={HISTORY_CARD_COUNT}
              formatLabel={formatHistoryLabel}
              row={album.historyCounts}
              onBump={(n, d) => bumpSpecial("history", n, d)}
              pageLabel="Sección especial"
            />
          ) : (
            <RepeatedPage dupes={dupes} dupTotal={dupTotal} />
          )}
        </div>

        <nav className="mt-auto flex shrink-0 items-center justify-between gap-3 border-t border-black/10 bg-white/50 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-black/35 dark:backdrop-blur-sm sm:px-6">
          <button
            type="button"
            onClick={goPrev}
            disabled={page <= 0}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            ← Anterior
          </button>
          <span className="text-center text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
            Página {page + 1} de {TOTAL_PAGES}
            <span className="hidden sm:inline"> · flechas ← →</span>
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={page >= TOTAL_PAGES - 1}
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Siguiente →
          </button>
        </nav>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <PageDots current={page} total={TOTAL_PAGES} onPick={setPage} />
      </div>
    </div>
  );
}

function CoverPage({ dupTotal }: { dupTotal: number }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="mb-2 font-serif text-4xl text-zinc-800 dark:text-zinc-100">
        Mi álbum
      </p>
      <p className="max-w-sm text-lg text-zinc-600 dark:text-zinc-400">
        48 equipos · Coca-Cola (14) · Historia FIFA (19) · Repetidos
      </p>
      <p className="mt-4 text-sm font-medium text-amber-900 dark:text-amber-200">
        Repetidos registrados: {dupTotal} cromos de más (para canje)
      </p>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-500">
        Cada país muestra su bandera y colores. Tus datos no salen de este
        dispositivo salvo que exportes o cambies de navegador.
      </p>
    </div>
  );
}

interface TeamPageProps {
  team: TeamEntry;
  album: AlbumPersisted;
  onBump: (teamCode: string, cardNumber: number, delta: number) => void;
  onFillTeamAllOnes: (teamCode: string) => void;
  pageLabel: string;
}

function TeamPage({
  team,
  album,
  onBump,
  onFillTeamAllOnes,
  pageLabel,
}: TeamPageProps) {
  const row = album.countsByTeam[team.code] ?? [];
  const prog = teamProgress(team.code, album);
  const allTwentyOnes = row.every((c) => (c ?? 0) === 1);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-3 dark:border-white/10">
        <div className="flex min-w-0 flex-1 gap-4">
          <TeamFlag fifaCode={team.code} countryName={team.nameEs} size={88} />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-zinc-700/90 dark:text-zinc-200/80">
              País
            </p>
            <h2 className="font-serif text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {team.nameEs}
            </h2>
            <p className="mt-0.5 font-mono text-sm text-zinc-700 dark:text-zinc-300">
              {team.code} · Selección nacional
            </p>
            <button
              type="button"
              onClick={() => onFillTeamAllOnes(team.code)}
              disabled={allTwentyOnes}
              className="mt-3 w-full max-w-xs rounded-md border border-emerald-700/40 bg-emerald-600/90 px-3 py-2 text-left text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-center dark:border-emerald-400/30 dark:bg-emerald-800/90 dark:hover:bg-emerald-700"
            >
              Tengo las 20 cartas (×1 cada una)
            </button>
            {allTwentyOnes ? (
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                Equipo marcado completo al ×1.
              </p>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 text-right text-sm text-zinc-800 dark:text-zinc-200">
          <span className="font-mono">{pageLabel}</span>
          <p className="mt-0.5">
            Cromos distintos: <strong>{prog}</strong>
          </p>
        </div>
      </div>

      <ul className="grid min-h-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {Array.from({ length: CARDS_PER_TEAM }, (_, i) => {
          const n = i + 1;
          const count = row[i] ?? 0;
          const label = formatCardLabel(team.code, n);
          return (
            <StickerCell
              key={n}
              label={label}
              count={count}
              onDec={() => onBump(team.code, n, -1)}
              onInc={() => onBump(team.code, n, 1)}
            />
          );
        })}
      </ul>
    </div>
  );
}

interface RepeatedPageProps {
  dupes: ReturnType<typeof listDuplicates>;
  dupTotal: number;
}

function RepeatedPage({ dupes, dupTotal }: RepeatedPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-4 border-b border-amber-900/20 pb-3 text-amber-950 dark:border-amber-400/25 dark:text-amber-50">
        <p className="text-xs uppercase tracking-wider opacity-90">Sección</p>
        <h2 className="font-serif text-2xl font-semibold">Repetidos</h2>
        <p className="mt-1 text-sm opacity-95">
          Se calculan cuando marcas más de 1 en un cromo. Total de cromos de más
          (para canje): <strong>{dupTotal}</strong>
        </p>
      </div>

      {dupes.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-center text-sm text-zinc-600 dark:text-zinc-400">
          Aún no tienes repetidos registrados (cantidad &gt; 1 en algún cromo).
        </p>
      ) : (
        <ul className="max-h-[min(52vh,28rem)] space-y-2 overflow-y-auto pr-1">
          {dupes.map((d) => (
            <li
              key={`${d.label}-${d.section}`}
              className="flex items-center justify-between gap-3 rounded-md border border-amber-900/15 bg-white/85 px-3 py-2 text-sm shadow-sm backdrop-blur-sm dark:border-amber-400/20 dark:bg-zinc-900/80"
            >
              <div className="min-w-0">
                <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">
                  {d.label}
                </p>
                <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                  {d.section}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-200 px-2.5 py-1 text-xs font-bold text-amber-950 dark:bg-amber-900/60 dark:text-amber-100">
                +{d.extras} rep.
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface SpecialStickerPageProps {
  title: string;
  subtitle: string;
  accentClass: string;
  headerClass: string;
  cardCount: number;
  formatLabel: (n: number) => string;
  row: number[];
  onBump: (cardNumber: number, delta: number) => void;
  pageLabel: string;
}

function SpecialStickerPage({
  title,
  subtitle,
  accentClass,
  headerClass,
  cardCount,
  formatLabel,
  row,
  onBump,
  pageLabel,
}: SpecialStickerPageProps) {
  const prog = rowProgress(row, cardCount);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className={`mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b pb-3 ${headerClass}`}
      >
        <div>
          <p className="text-xs uppercase tracking-wider opacity-90">{pageLabel}</p>
          <h2 className="font-serif text-2xl font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm opacity-90">{subtitle}</p>
        </div>
        <div className="text-right text-sm opacity-95">
          <p>
            Cromos distintos: <strong>{prog}</strong>
          </p>
        </div>
      </div>

      <ul className="grid min-h-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {Array.from({ length: cardCount }, (_, i) => {
          const n = i + 1;
          const count = row[i] ?? 0;
          const label = formatLabel(n);
          return (
            <li key={n} className={accentClass}>
              <StickerCellInner
                label={label}
                count={count}
                onDec={() => onBump(n, -1)}
                onInc={() => onBump(n, 1)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface StickerCellProps {
  label: string;
  count: number;
  onDec: () => void;
  onInc: () => void;
}

function StickerCell({ label, count, onDec, onInc }: StickerCellProps) {
  return (
    <li className="flex flex-col rounded-md border border-black/15 bg-white/92 p-2 shadow-sm backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/88">
      <StickerCellInner label={label} count={count} onDec={onDec} onInc={onInc} />
    </li>
  );
}

function StickerCellInner({ label, count, onDec, onInc }: StickerCellProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-1">
        <span className="font-mono text-xs font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-sm">
          {label}
        </span>
        {count > 1 ? (
          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
            ×{count}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        <button
          type="button"
          aria-label={`Quitar una ${label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 text-lg leading-none text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-700"
          onClick={onDec}
          disabled={count <= 0}
        >
          −
        </button>
        <span
          className="min-w-6 text-center font-mono text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50"
          title="Cantidad en tu poder"
        >
          {count}
        </span>
        <button
          type="button"
          aria-label={`Añadir una ${label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 text-lg leading-none text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-700"
          onClick={onInc}
        >
          +
        </button>
      </div>
    </>
  );
}

interface PageDotsProps {
  current: number;
  total: number;
  onPick: (index: number) => void;
}

function PageDots({ current, total, onPick }: PageDotsProps) {
  return (
    <div className="flex max-h-28 w-full flex-wrap content-start gap-1 overflow-y-auto rounded-md border border-black/10 bg-white/45 p-2 backdrop-blur-sm dark:border-white/10 dark:bg-black/30 dark:backdrop-blur-sm">
      {Array.from({ length: total }, (_, i) => {
        const active = i === current;
        const label = dotLabel(i);
        const short =
          label === "Portada"
            ? "★"
            : label === "Coca"
              ? "Coca"
              : label === "Hist"
                ? "Hist"
                : label === "Rep"
                  ? "Rep"
                  : label;
        return (
          <button
            key={i}
            type="button"
            title={label}
            onClick={() => onPick(i)}
            className={`rounded px-1.5 py-1 font-mono text-[10px] sm:text-xs ${
              active
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
}
