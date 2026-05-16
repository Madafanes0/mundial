/** Secciones especiales del álbum (fuera de los 48 equipos). */

export const COCA_CARD_COUNT = 14;
export const HISTORY_CARD_COUNT = 19;

export function formatCocaLabel(cardNumber: number): string {
  return `COCA ${cardNumber}`;
}

export function formatHistoryLabel(cardNumber: number): string {
  return `HIST ${cardNumber}`;
}
