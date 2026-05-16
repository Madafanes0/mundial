import {
  COCA_CARD_COUNT,
  formatCocaLabel,
  formatHistoryLabel,
  HISTORY_CARD_COUNT,
} from "@/data/special-sections";
import { CARDS_PER_TEAM, TEAMS, formatCardLabel } from "@/data/teams";
import type { AlbumPersisted } from "@/lib/album-storage";

export interface DuplicateEntry {
  label: string;
  extras: number;
  section: string;
}

export function listDuplicates(album: AlbumPersisted): DuplicateEntry[] {
  const out: DuplicateEntry[] = [];

  for (const t of TEAMS) {
    const row = album.countsByTeam[t.code] ?? [];
    for (let i = 0; i < CARDS_PER_TEAM; i++) {
      const c = row[i] ?? 0;
      if (c > 1) {
        out.push({
          label: formatCardLabel(t.code, i + 1),
          extras: c - 1,
          section: t.nameEs,
        });
      }
    }
  }

  for (let i = 0; i < COCA_CARD_COUNT; i++) {
    const c = album.cocaCounts[i] ?? 0;
    if (c > 1) {
      out.push({
        label: formatCocaLabel(i + 1),
        extras: c - 1,
        section: "Coca-Cola",
      });
    }
  }

  for (let i = 0; i < HISTORY_CARD_COUNT; i++) {
    const c = album.historyCounts[i] ?? 0;
    if (c > 1) {
      out.push({
        label: formatHistoryLabel(i + 1),
        extras: c - 1,
        section: "Historia del Mundial",
      });
    }
  }

  out.sort((a, b) => {
    const bySection = a.section.localeCompare(b.section, "es");
    if (bySection !== 0) return bySection;
    return a.label.localeCompare(b.label, "es", { numeric: true });
  });

  return out;
}

export function totalDuplicateStickers(entries: DuplicateEntry[]): number {
  return entries.reduce((s, e) => s + e.extras, 0);
}
