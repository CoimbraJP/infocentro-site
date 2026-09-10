// Controla quantas etiquetas cabem por página A4 impressa (o usuário
// reportou que o padrão do navegador dava 4 por página, e só forçando 96% de
// redimensionamento nas propriedades da impressora ele conseguia 6). Em vez
// de depender do usuário mexer no driver da impressora — frágil e
// inconsistente entre impressoras/navegadores — a gente calcula o tamanho
// exato de cada "slot" da grade em pixels (a 96dpi, que é o padrão do CSS)
// a partir da área útil real do A4 (210x297mm menos as margens de 6mm do
// @page em globals.css — bem enxutas, só o mínimo que a maioria das
// impressoras precisa, pra sobrar o máximo de espaço pras etiquetas), e o
// PrintFitStage encolhe/aumenta cada etiqueta pra caber perfeitamente nesse
// slot — sem depender de configuração alguma na hora de imprimir.

export type LabelsPerPage = 6 | 9;

const PER_PAGE_STORAGE_KEY = 'jp_etiquetas_per_page_v1';

/** 6 é o padrão pedido pelo usuário. */
export function getLabelsPerPage(): LabelsPerPage {
  if (typeof window === 'undefined') return 6;
  return window.localStorage.getItem(PER_PAGE_STORAGE_KEY) === '9' ? 9 : 6;
}

export function setLabelsPerPage(value: LabelsPerPage): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PER_PAGE_STORAGE_KEY, String(value));
}

// 96 CSS px por polegada (padrão da web), convertendo a área útil do A4
// (210x297mm - 2x6mm de margem = 198x285mm) pra pixels.
const MM_TO_PX = 96 / 25.4;
const PAGE_CONTENT_WIDTH_PX = 198 * MM_TO_PX; // ~748px
const PAGE_CONTENT_HEIGHT_PX = 285 * MM_TO_PX; // ~1077px
const GRID_GAP_PX = 16; // bate com o gap-4 usado na grade de impressão
const SAFETY_MARGIN = 0.985; // folga bem pequena (1.5%), só pra nunca estourar a página por arredondamento

const PRINT_LAYOUTS: Record<LabelsPerPage, { cols: number; rows: number; fontBoost: number }> = {
  // 2 colunas x 3 linhas — o que o usuário conseguia manualmente com 96% de zoom.
  6: { cols: 2, rows: 3, fontBoost: 1 },
  // 3 colunas x 3 linhas — mais denso, por isso a fonte é reforçada um pouco
  // pra continuar legível mesmo com o slot bem menor.
  9: { cols: 3, rows: 3, fontBoost: 1.15 },
};

export interface PrintCellSize {
  width: number;
  height: number;
  cols: number;
  fontBoost: number;
}

export function computePrintCellSize(perPage: LabelsPerPage): PrintCellSize {
  const { cols, rows, fontBoost } = PRINT_LAYOUTS[perPage];
  const width = ((PAGE_CONTENT_WIDTH_PX - GRID_GAP_PX * (cols - 1)) / cols) * SAFETY_MARGIN;
  const height = ((PAGE_CONTENT_HEIGHT_PX - GRID_GAP_PX * (rows - 1)) / rows) * SAFETY_MARGIN;
  return { width, height, cols, fontBoost };
}
