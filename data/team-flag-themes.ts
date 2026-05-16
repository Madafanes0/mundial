/**
 * Gradientes suaves inspirados en los colores de cada bandera (aprox.).
 * Se usan como fondo de la “página” del equipo; el texto sigue siendo legible.
 */
const DEFAULT =
  "linear-gradient(155deg, rgba(228,228,231,0.65) 0%, #faf8f5 45%, rgba(212,212,216,0.5) 100%)";

const GRADIENTS: Record<string, string> = {
  ALG: "linear-gradient(145deg, rgba(0,98,51,0.32) 0%, #faf8f5 42%, rgba(206,17,38,0.22) 100%)",
  ARG: "linear-gradient(160deg, rgba(117,170,219,0.45) 0%, #faf8f5 50%, rgba(117,170,219,0.25) 100%)",
  AUS: "linear-gradient(145deg, rgba(0,33,105,0.35) 0%, #faf8f5 40%, rgba(200,16,46,0.2) 100%)",
  AUT: "linear-gradient(90deg, rgba(237,41,57,0.28) 0%, #faf8f5 50%, rgba(237,41,57,0.22) 100%)",
  BEL: "linear-gradient(120deg, rgba(0,0,0,0.2) 0%, rgba(253,208,0,0.35) 45%, rgba(239,51,64,0.28) 100%)",
  BIH: "linear-gradient(145deg, rgba(0,36,125,0.35) 0%, #faf8f5 48%, rgba(255,209,0,0.3) 100%)",
  BRA: "linear-gradient(135deg, rgba(0,156,59,0.3) 0%, rgba(255,223,0,0.28) 45%, rgba(0,39,118,0.28) 100%)",
  CAN: "linear-gradient(90deg, rgba(255,0,0,0.22) 0%, #faf8f5 50%, rgba(255,0,0,0.22) 100%)",
  COD: "linear-gradient(145deg, rgba(0,127,255,0.28) 0%, #faf8f5 45%, rgba(206,17,38,0.2) 100%)",
  COL: "linear-gradient(120deg, rgba(252,209,22,0.4) 0%, rgba(0,56,147,0.28) 50%, rgba(206,17,38,0.26) 100%)",
  CPV: "linear-gradient(145deg, rgba(0,61,165,0.3) 0%, #faf8f5 42%, rgba(206,17,38,0.18) 100%)",
  CRO: "linear-gradient(120deg, rgba(23,23,150,0.32) 0%, #faf8f5 48%, rgba(200,16,46,0.26) 100%)",
  CIV: "linear-gradient(120deg, rgba(247,127,0,0.32) 0%, #faf8f5 50%, rgba(0,135,90,0.26) 100%)",
  CZE: "linear-gradient(145deg, rgba(17,69,126,0.3) 0%, #faf8f5 45%, rgba(215,20,26,0.22) 100%)",
  CUW: "linear-gradient(120deg, rgba(0,94,184,0.32) 0%, #faf8f5 48%, rgba(250,224,66,0.25) 100%)",
  ECU: "linear-gradient(120deg, rgba(255,221,0,0.38) 0%, rgba(0,56,168,0.28) 50%, rgba(206,17,38,0.24) 100%)",
  EGY: "linear-gradient(180deg, rgba(206,17,38,0.22) 0%, #faf8f5 50%, rgba(0,0,0,0.15) 100%)",
  ENG: "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(206,17,38,0.18) 50%, rgba(255,255,255,0.85) 100%)",
  ESP: "linear-gradient(180deg, rgba(170,0,0,0.22) 0%, rgba(252,194,27,0.35) 50%, rgba(170,0,0,0.2) 100%)",
  FRA: "linear-gradient(120deg, rgba(0,35,149,0.28) 0%, #faf8f5 50%, rgba(206,17,38,0.22) 100%)",
  GER: "linear-gradient(120deg, rgba(0,0,0,0.18) 0%, rgba(221,0,0,0.2) 50%, rgba(255,206,0,0.35) 100%)",
  GHA: "linear-gradient(135deg, rgba(206,17,38,0.22) 0%, rgba(252,209,22,0.32) 45%, rgba(0,107,63,0.28) 100%)",
  HAI: "linear-gradient(180deg, rgba(0,56,168,0.28) 0%, #faf8f5 50%, rgba(206,17,38,0.22) 100%)",
  IRN: "linear-gradient(180deg, rgba(35,159,64,0.3) 0%, #faf8f5 50%, rgba(206,17,38,0.22) 100%)",
  IRQ: "linear-gradient(180deg, rgba(206,17,38,0.22) 0%, #faf8f5 50%, rgba(0,0,0,0.12) 100%)",
  JOR: "linear-gradient(120deg, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0.85) 40%, rgba(0,122,61,0.28) 100%)",
  JPN: "linear-gradient(160deg, #faf8f5 0%, rgba(188,0,45,0.2) 55%, #faf8f5 100%)",
  KOR: "linear-gradient(145deg, rgba(205,46,58,0.22) 0%, #faf8f5 40%, rgba(0,56,168,0.26) 100%)",
  MAR: "linear-gradient(145deg, rgba(193,39,45,0.28) 0%, #faf8f5 48%, rgba(0,98,51,0.3) 100%)",
  MEX: "linear-gradient(145deg, rgba(0,104,71,0.35) 0%, #faf8f5 40%, rgba(206,17,38,0.28) 100%)",
  NED: "linear-gradient(180deg, rgba(174,28,40,0.22) 0%, #faf8f5 50%, rgba(0,61,165,0.24) 100%)",
  NOR: "linear-gradient(135deg, rgba(186,12,47,0.22) 0%, #faf8f5 45%, rgba(0,32,91,0.28) 100%)",
  NZL: "linear-gradient(145deg, rgba(0,36,125,0.3) 0%, #faf8f5 48%, rgba(200,16,46,0.2) 100%)",
  PAN: "linear-gradient(180deg, rgba(0,56,168,0.22) 0%, #faf8f5 50%, rgba(206,17,38,0.2) 100%)",
  PAR: "linear-gradient(120deg, rgba(206,17,38,0.24) 0%, #faf8f5 50%, rgba(0,56,168,0.26) 100%)",
  POR: "linear-gradient(145deg, rgba(0,102,0,0.32) 0%, #faf8f5 48%, rgba(206,17,38,0.24) 100%)",
  QAT: "linear-gradient(160deg, rgba(142,22,56,0.35) 0%, #faf8f5 55%, rgba(255,255,255,0.6) 100%)",
  RSA: "linear-gradient(135deg, rgba(0,122,77,0.26) 0%, rgba(255,182,18,0.28) 35%, rgba(0,35,149,0.22) 70%, rgba(0,0,0,0.12) 100%)",
  KSA: "linear-gradient(145deg, rgba(0,106,78,0.35) 0%, #faf8f5 50%, rgba(255,255,255,0.5) 100%)",
  SCO: "linear-gradient(135deg, rgba(0,36,125,0.32) 0%, #faf8f5 50%, rgba(0,36,125,0.18) 100%)",
  SEN: "linear-gradient(120deg, rgba(0,133,63,0.3) 0%, rgba(252,209,22,0.32) 50%, rgba(206,17,38,0.22) 100%)",
  SUI: "linear-gradient(90deg, rgba(213,43,30,0.25) 0%, #faf8f5 50%, rgba(213,43,30,0.22) 100%)",
  SWE: "linear-gradient(135deg, rgba(0,106,167,0.3) 0%, #faf8f5 48%, rgba(254,204,0,0.35) 100%)",
  TUN: "linear-gradient(180deg, rgba(206,17,38,0.22) 0%, #faf8f5 50%, rgba(206,17,38,0.18) 100%)",
  TUR: "linear-gradient(180deg, rgba(227,10,23,0.26) 0%, #faf8f5 50%, rgba(227,10,23,0.22) 100%)",
  USA: "linear-gradient(120deg, rgba(178,34,52,0.22) 0%, #faf8f5 50%, rgba(60,59,110,0.26) 100%)",
  URU: "linear-gradient(160deg, rgba(0,56,168,0.32) 0%, #faf8f5 50%, rgba(255,255,255,0.7) 100%)",
  UZB: "linear-gradient(120deg, rgba(30,181,58,0.26) 0%, #faf8f5 45%, rgba(0,153,255,0.22) 85%, rgba(206,17,38,0.18) 100%)",
};

export function getTeamFlagPageBackground(teamCode: string): string {
  return GRADIENTS[teamCode] ?? DEFAULT;
}
