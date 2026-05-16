/** 48 selecciones del Mundial 2026 (códigos FIFA de 3 letras). */

export interface TeamEntry {
  code: string;
  nameEs: string;
}

export const CARDS_PER_TEAM = 20;

export const TEAMS: TeamEntry[] = [
  { code: "ALG", nameEs: "Argelia" },
  { code: "ARG", nameEs: "Argentina" },
  { code: "AUS", nameEs: "Australia" },
  { code: "AUT", nameEs: "Austria" },
  { code: "BEL", nameEs: "Bélgica" },
  { code: "BIH", nameEs: "Bosnia y Herzegovina" },
  { code: "BRA", nameEs: "Brasil" },
  { code: "CAN", nameEs: "Canadá" },
  { code: "COD", nameEs: "RD Congo" },
  { code: "COL", nameEs: "Colombia" },
  { code: "CPV", nameEs: "Cabo Verde" },
  { code: "CRO", nameEs: "Croacia" },
  { code: "CIV", nameEs: "Costa de Marfil" },
  { code: "CZE", nameEs: "República Checa" },
  { code: "CUW", nameEs: "Curazao" },
  { code: "ECU", nameEs: "Ecuador" },
  { code: "EGY", nameEs: "Egipto" },
  { code: "ENG", nameEs: "Inglaterra" },
  { code: "ESP", nameEs: "España" },
  { code: "FRA", nameEs: "Francia" },
  { code: "GER", nameEs: "Alemania" },
  { code: "GHA", nameEs: "Ghana" },
  { code: "HAI", nameEs: "Haití" },
  { code: "IRN", nameEs: "Irán" },
  { code: "IRQ", nameEs: "Irak" },
  { code: "JOR", nameEs: "Jordania" },
  { code: "JPN", nameEs: "Japón" },
  { code: "KOR", nameEs: "Corea del Sur" },
  { code: "MAR", nameEs: "Marruecos" },
  { code: "MEX", nameEs: "México" },
  { code: "NED", nameEs: "Países Bajos" },
  { code: "NOR", nameEs: "Noruega" },
  { code: "NZL", nameEs: "Nueva Zelanda" },
  { code: "PAN", nameEs: "Panamá" },
  { code: "PAR", nameEs: "Paraguay" },
  { code: "POR", nameEs: "Portugal" },
  { code: "QAT", nameEs: "Catar" },
  { code: "RSA", nameEs: "Sudáfrica" },
  { code: "KSA", nameEs: "Arabia Saudita" },
  { code: "SCO", nameEs: "Escocia" },
  { code: "SEN", nameEs: "Senegal" },
  { code: "SUI", nameEs: "Suiza" },
  { code: "SWE", nameEs: "Suecia" },
  { code: "TUN", nameEs: "Túnez" },
  { code: "TUR", nameEs: "Turquía" },
  { code: "USA", nameEs: "Estados Unidos" },
  { code: "URU", nameEs: "Uruguay" },
  { code: "UZB", nameEs: "Uzbekistán" },
];

export function formatCardLabel(teamCode: string, cardNumber: number): string {
  return `${teamCode} ${cardNumber}`;
}
