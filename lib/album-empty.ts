import { COCA_CARD_COUNT, HISTORY_CARD_COUNT } from "@/data/special-sections";
import { CARDS_PER_TEAM, TEAMS } from "@/data/teams";
import type { AlbumPersisted } from "@/lib/album-storage";

export function isAlbumVirtuallyEmpty(album: AlbumPersisted): boolean {
  for (const t of TEAMS) {
    const row = album.countsByTeam[t.code] ?? [];
    for (let i = 0; i < CARDS_PER_TEAM; i++) {
      if ((row[i] ?? 0) >= 1) return false;
    }
  }
  for (let i = 0; i < COCA_CARD_COUNT; i++) {
    if ((album.cocaCounts[i] ?? 0) >= 1) return false;
  }
  for (let i = 0; i < HISTORY_CARD_COUNT; i++) {
    if ((album.historyCounts[i] ?? 0) >= 1) return false;
  }
  return true;
}
