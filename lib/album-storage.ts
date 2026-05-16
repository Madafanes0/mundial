import {
  COCA_CARD_COUNT,
  HISTORY_CARD_COUNT,
} from "@/data/special-sections";
import { CARDS_PER_TEAM, TEAMS } from "@/data/teams";

export const ALBUM_STORAGE_KEY = "mundial-album-v1";

export interface AlbumPersisted {
  version: 2;
  /** Por equipo: índice i = cantidad de la carta (i + 1), longitud 20 */
  countsByTeam: Record<string, number[]>;
  /** Edición Coca-Cola: 14 cromos */
  cocaCounts: number[];
  /** FIFA World Cup History: 19 cromos */
  historyCounts: number[];
}

function emptyTeamCounts(): number[] {
  return Array.from({ length: CARDS_PER_TEAM }, () => 0);
}

function emptyCocaCounts(): number[] {
  return Array.from({ length: COCA_CARD_COUNT }, () => 0);
}

function emptyHistoryCounts(): number[] {
  return Array.from({ length: HISTORY_CARD_COUNT }, () => 0);
}

export function createEmptyAlbum(): AlbumPersisted {
  const countsByTeam: Record<string, number[]> = {};
  for (const t of TEAMS) countsByTeam[t.code] = emptyTeamCounts();
  return {
    version: 2,
    countsByTeam,
    cocaCounts: emptyCocaCounts(),
    historyCounts: emptyHistoryCounts(),
  };
}

function normalizeCountArray(
  arr: unknown,
  length: number,
): number[] {
  const out = Array.from({ length }, () => 0);
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i < length; i++) {
    const n = Number(arr[i]);
    out[i] = Number.isFinite(n) && n >= 0 ? Math.min(99, Math.floor(n)) : 0;
  }
  return out;
}

function normalizeLoaded(raw: unknown): AlbumPersisted {
  const empty = createEmptyAlbum();
  if (!raw || typeof raw !== "object") return empty;
  const o = raw as Record<string, unknown>;

  const merged = createEmptyAlbum();

  const loadedTeams =
    o.countsByTeam && typeof o.countsByTeam === "object"
      ? (o.countsByTeam as Record<string, unknown>)
      : null;

  if (loadedTeams) {
    for (const t of TEAMS) {
      const arr = loadedTeams[t.code];
      if (!Array.isArray(arr)) continue;
      for (let i = 0; i < CARDS_PER_TEAM; i++) {
        const n = Number(arr[i]);
        merged.countsByTeam[t.code][i] =
          Number.isFinite(n) && n >= 0 ? Math.min(99, Math.floor(n)) : 0;
      }
    }
  }

  const fileVersion = o.version;
  if (fileVersion === 2) {
    merged.cocaCounts = normalizeCountArray(o.cocaCounts, COCA_CARD_COUNT);
    merged.historyCounts = normalizeCountArray(
      o.historyCounts,
      HISTORY_CARD_COUNT,
    );
  }

  return merged;
}

/** Misma normalización para JSON guardado en Supabase o localStorage. */
export const normalizeAlbumPayload = normalizeLoaded;

export function loadAlbumFromStorage(): AlbumPersisted {
  if (typeof window === "undefined") return createEmptyAlbum();
  try {
    const raw = window.localStorage.getItem(ALBUM_STORAGE_KEY);
    if (!raw) return createEmptyAlbum();
    return normalizeLoaded(JSON.parse(raw) as unknown);
  } catch {
    return createEmptyAlbum();
  }
}

export function saveAlbumToStorage(data: AlbumPersisted): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode
  }
}

export function setCountForSpecial(
  album: AlbumPersisted,
  section: "coca" | "history",
  cardNumber: number,
  next: number,
): AlbumPersisted {
  const key = section === "coca" ? "cocaCounts" : "historyCounts";
  const len = section === "coca" ? COCA_CARD_COUNT : HISTORY_CARD_COUNT;
  const idx = cardNumber - 1;
  const row = [...album[key]];
  while (row.length < len) row.push(0);
  row[idx] = Math.max(0, Math.min(99, next));
  return { ...album, [key]: row };
}
