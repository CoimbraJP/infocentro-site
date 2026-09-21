// Módulo Etiquetas PC Gamer — completamente separado do módulo de notebooks
// (lib/jp/etiquetas.ts). Mesma mecânica, campos diferentes: um PC gamer não
// tem bateria nem tela, e em compensação separa SSD de HD e trata placa de
// vídeo como item principal (não opcional). A barra larga com o ícone de
// controle nos moldes é o campo "jogos" — o que a máquina roda, que é o que
// o cliente gamer realmente quer saber.
//
// A fórmula de parcelamento e a formatação de moeda são importadas do módulo
// de notebooks de propósito: é a mesma regra comercial da loja e não pode
// divergir entre os dois. Nada lá é alterado — só reaproveitado.
import {
  formatCurrency,
  parseCurrencyInput,
  calculateInstallmentValue,
} from './etiquetas';
import type { LabelsPerPage } from './print-layout';

export { formatCurrency, parseCurrencyInput, calculateInstallmentValue };

export interface PcGamerLabel {
  id: string;
  /** Nome/identificação da máquina. Ex: "PC Gamer Ryzen 5 + RTX 3060". */
  nome: string;
  processador: string;
  memoriaRam: string;
  ssd: string;
  hd: string;
  placaVideo: string;
  /** Jogos que a máquina roda — vai na barra larga com ícone de controle. */
  jogos: string;
  /** Texto bruto digitado pelo usuário (facilita o input controlado). */
  valorAVista: string;
  /** Timestamp (ms) de criação — base para a expiração de 30 dias. */
  createdAt: number;
}

/** Etiquetas do rascunho de trabalho somem sozinhas depois desse prazo. */
export const PC_GAMER_EXPIRY_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Rascunho de trabalho do gerador (/jp/pc-gamer) — expira em 30 dias. */
export const JP_PC_GAMER_STORAGE_KEY = 'jp_pcgamer_vitrine_v1';
/** Biblioteca permanente (/jp/pc-gamer/salvas) — só some se o usuário apagar. */
export const JP_PC_GAMER_BIBLIOTECA_KEY = 'jp_pcgamer_biblioteca_v1';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `pc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createEmptyPcGamer(): PcGamerLabel {
  return {
    id: generateId(),
    nome: '',
    processador: '',
    memoriaRam: '',
    ssd: '',
    hd: '',
    placaVideo: '',
    jogos: '',
    valorAVista: '',
    createdAt: Date.now(),
  };
}

export function getPcGamerExpiryTimestamp(createdAt: number): number {
  return createdAt + PC_GAMER_EXPIRY_DAYS * DAY_MS;
}

/** Dias restantes até a etiqueta do rascunho expirar (nunca negativo). */
export function getPcGamerDaysUntilExpiry(createdAt: number): number {
  return Math.max(0, Math.ceil((getPcGamerExpiryTimestamp(createdAt) - Date.now()) / DAY_MS));
}

export function isPcGamerExpired(createdAt: number): boolean {
  return Date.now() >= getPcGamerExpiryTimestamp(createdAt);
}

export function prunePcGamerExpired(pcs: PcGamerLabel[]): PcGamerLabel[] {
  return pcs.filter((pc) => !isPcGamerExpired(pc.createdAt));
}

// --- Rascunho de trabalho (expira em 30 dias) ---

export function loadStoredPcGamers(): PcGamerLabel[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JP_PC_GAMER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PcGamerLabel[];
    if (!Array.isArray(parsed)) return [];
    return prunePcGamerExpired(parsed);
  } catch {
    return [];
  }
}

export function saveStoredPcGamers(pcs: PcGamerLabel[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(JP_PC_GAMER_STORAGE_KEY, JSON.stringify(pcs));
}

// --- Biblioteca permanente (não expira) ---

export function loadSavedPcGamers(): PcGamerLabel[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JP_PC_GAMER_BIBLIOTECA_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PcGamerLabel[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedPcGamers(pcs: PcGamerLabel[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(JP_PC_GAMER_BIBLIOTECA_KEY, JSON.stringify(pcs));
}

/**
 * Copia os PCs informados pra biblioteca permanente (cada um com id novo e
 * createdAt do momento do salvamento, pra não colidir com o item de origem no
 * rascunho nem herdar a contagem de expiração dele).
 */
export function addPcGamersToLibrary(pcs: PcGamerLabel[]): PcGamerLabel[] {
  const now = Date.now();
  const copies = pcs.map((pc) => ({ ...pc, id: generateId(), createdAt: now }));
  const updated = [...loadSavedPcGamers(), ...copies];
  saveSavedPcGamers(updated);
  return updated;
}

export function removeSavedPcGamer(id: string): PcGamerLabel[] {
  const updated = loadSavedPcGamers().filter((pc) => pc.id !== id);
  saveSavedPcGamers(updated);
  return updated;
}

// --- Densidade de impressão ---------------------------------------------
// Chave própria de propósito: mudar de 6 pra 9 etiquetas por página aqui não
// pode mexer na escolha feita no módulo de notebooks. O cálculo do tamanho do
// slot (computePrintCellSize) é genérico e continua vindo de print-layout.ts.

const PC_GAMER_PER_PAGE_KEY = 'jp_pcgamer_per_page_v1';

export function getPcGamerLabelsPerPage(): LabelsPerPage {
  if (typeof window === 'undefined') return 6;
  return window.localStorage.getItem(PC_GAMER_PER_PAGE_KEY) === '9' ? 9 : 6;
}

export function setPcGamerLabelsPerPage(value: LabelsPerPage): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PC_GAMER_PER_PAGE_KEY, String(value));
}
