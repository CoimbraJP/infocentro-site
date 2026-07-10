// Tipos, constantes e utilitários do módulo Etiquetas de Vitrine. Ficam
// separados da UI para poder ser reaproveitados na próxima etapa (geração de
// PDF) sem duplicar regras de cálculo/expiração.

export interface NotebookLabel {
  id: string;
  marcaModelo: string;
  processador: string;
  memoriaRam: string;
  armazenamento: string;
  sistemaOperacional: string;
  tela: string;
  bateria: 'Boa' | 'Ruim' | '';
  /** Opcional — se vazia, não deve aparecer na etiqueta final. */
  placaVideo: string;
  /** Texto bruto digitado pelo usuário (facilita o input controlado). */
  valorAVista: string;
  /** Timestamp (ms) de criação — base para a expiração de 30 dias. */
  createdAt: number;
}

export const SISTEMA_OPERACIONAL_OPTIONS = [
  'Windows 11',
  'Windows 10',
  'Linux',
  'Sem Sistema Operacional',
] as const;

export const TELA_OPTIONS = ['11.6"', '13.3"', '14"', '15.6"', '17.3"'] as const;

export const BATERIA_OPTIONS = ['Boa', 'Ruim'] as const;

/** Etiquetas são removidas automaticamente após esse número de dias. */
export const EXPIRY_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export const JP_ETIQUETAS_STORAGE_KEY = 'jp_etiquetas_vitrine_v1';

/** Taxa aplicada ao total antes de dividir em 12x (ex: R$1.000 -> 12x de R$95,83). */
const INSTALLMENT_RATE = 0.15;
const INSTALLMENTS = 12;

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `nb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createEmptyNotebook(): NotebookLabel {
  return {
    id: generateId(),
    marcaModelo: '',
    processador: '',
    memoriaRam: '',
    armazenamento: '',
    sistemaOperacional: SISTEMA_OPERACIONAL_OPTIONS[0],
    tela: TELA_OPTIONS[2],
    bateria: '',
    placaVideo: '',
    valorAVista: '',
    createdAt: Date.now(),
  };
}

/** Converte texto digitado (com vírgula ou ponto) em número. */
export function parseCurrencyInput(raw: string): number {
  const normalized = raw.replace(/[^\d,.-]/g, '').replace(',', '.');
  const value = parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Valor de cada uma das 12 parcelas, já com a taxa de 15% aplicada sobre o total. */
export function calculateInstallmentValue(valorAVista: number): number {
  if (valorAVista <= 0) return 0;
  return (valorAVista * (1 + INSTALLMENT_RATE)) / INSTALLMENTS;
}

export function getExpiryTimestamp(createdAt: number): number {
  return createdAt + EXPIRY_DAYS * DAY_MS;
}

/** Dias restantes até a etiqueta expirar (nunca negativo). */
export function getDaysUntilExpiry(createdAt: number): number {
  return Math.max(0, Math.ceil((getExpiryTimestamp(createdAt) - Date.now()) / DAY_MS));
}

export function isExpired(createdAt: number): boolean {
  return Date.now() >= getExpiryTimestamp(createdAt);
}

/** Remove do array qualquer etiqueta com mais de 30 dias. */
export function pruneExpired(notebooks: NotebookLabel[]): NotebookLabel[] {
  return notebooks.filter((notebook) => !isExpired(notebook.createdAt));
}

// Persistência local: como o módulo ainda não tem backend, a "expiração em
// 30 dias" acontece ao carregar a página — pruneExpired() descarta qualquer
// etiqueta vencida antes de exibi-la ou salvá-la de volta.

export function loadStoredNotebooks(): NotebookLabel[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(JP_ETIQUETAS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as NotebookLabel[];
    if (!Array.isArray(parsed)) return [];
    return pruneExpired(parsed);
  } catch {
    return [];
  }
}

export function saveStoredNotebooks(notebooks: NotebookLabel[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(JP_ETIQUETAS_STORAGE_KEY, JSON.stringify(notebooks));
}
