/**
 * Banderas SVG (lipis/flag-icons) vía jsDelivr — suele ser más fiable que hotlink directo.
 * Fallback: emoji regional en `TeamFlag` si la imagen falla.
 * @see https://github.com/lipis/flag-icons
 */

const FLAG_SVG_BASE =
  "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3";

/** Slug de archivo en flag-icons (sin .svg). */
const FIFA_TO_FLAG_SLUG: Record<string, string> = {
  ALG: "dz",
  ARG: "ar",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  BIH: "ba",
  BRA: "br",
  CAN: "ca",
  COD: "cd",
  COL: "co",
  CPV: "cv",
  CRO: "hr",
  CIV: "ci",
  CZE: "cz",
  CUW: "cw",
  ECU: "ec",
  EGY: "eg",
  ENG: "gb-eng",
  ESP: "es",
  FRA: "fr",
  GER: "de",
  GHA: "gh",
  HAI: "ht",
  IRN: "ir",
  IRQ: "iq",
  JOR: "jo",
  JPN: "jp",
  KOR: "kr",
  MAR: "ma",
  MEX: "mx",
  NED: "nl",
  NOR: "no",
  NZL: "nz",
  PAN: "pa",
  PAR: "py",
  POR: "pt",
  QAT: "qa",
  RSA: "za",
  KSA: "sa",
  SCO: "gb-sct",
  SEN: "sn",
  SUI: "ch",
  SWE: "se",
  TUN: "tn",
  TUR: "tr",
  USA: "us",
  URU: "uy",
  UZB: "uz",
};

/** Emoji por si el SVG no carga (misma cobertura que equipos). */
const FIFA_FLAG_EMOJI: Record<string, string> = {
  ALG: "🇩🇿",
  ARG: "🇦🇷",
  AUS: "🇦🇺",
  AUT: "🇦🇹",
  BEL: "🇧🇪",
  BIH: "🇧🇦",
  BRA: "🇧🇷",
  CAN: "🇨🇦",
  COD: "🇨🇩",
  COL: "🇨🇴",
  CPV: "🇨🇻",
  CRO: "🇭🇷",
  CIV: "🇨🇮",
  CZE: "🇨🇿",
  CUW: "🇨🇼",
  ECU: "🇪🇨",
  EGY: "🇪🇬",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ESP: "🇪🇸",
  FRA: "🇫🇷",
  GER: "🇩🇪",
  GHA: "🇬🇭",
  HAI: "🇭🇹",
  IRN: "🇮🇷",
  IRQ: "🇮🇶",
  JOR: "🇯🇴",
  JPN: "🇯🇵",
  KOR: "🇰🇷",
  MAR: "🇲🇦",
  MEX: "🇲🇽",
  NED: "🇳🇱",
  NOR: "🇳🇴",
  NZL: "🇳🇿",
  PAN: "🇵🇦",
  PAR: "🇵🇾",
  POR: "🇵🇹",
  QAT: "🇶🇦",
  RSA: "🇿🇦",
  KSA: "🇸🇦",
  SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  SEN: "🇸🇳",
  SUI: "🇨🇭",
  SWE: "🇸🇪",
  TUN: "🇹🇳",
  TUR: "🇹🇷",
  USA: "🇺🇸",
  URU: "🇺🇾",
  UZB: "🇺🇿",
};

export function getFlagImageUrl(fifaCode: string): string {
  const slug =
    FIFA_TO_FLAG_SLUG[fifaCode] ?? fifaCode.toLowerCase().slice(0, 2);
  return `${FLAG_SVG_BASE}/${slug}.svg`;
}

export function getFlagEmojiFallback(fifaCode: string): string {
  return FIFA_FLAG_EMOJI[fifaCode] ?? "🏳️";
}
