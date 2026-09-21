import type { ComponentType } from 'react';
import { formatCurrency, calculateInstallmentValue, parseCurrencyInput } from './etiquetas';
import type { PcGamerLabel } from './pc-gamer';

// Espelha lib/jp/label-templates.ts, mas pro módulo PC Gamer: os dados de
// exemplo do showroom, o contrato que todo modelo recebe e onde fica salva a
// escolha do modelo padrão. Chave de localStorage própria — escolher um
// modelo aqui não mexe no modelo escolhido pras etiquetas de notebook.

export interface PcGamerSampleData {
  nome: string;
  processador: string;
  memoriaRam: string;
  ssd: string;
  hd: string;
  placaVideo: string;
  /** Barra larga com ícone de controle — o que a máquina roda. */
  jogos: string;
  /** Já formatado (ex: "R$ 4.500,00"). */
  valorFormatado: string;
  /** Já formatado (ex: "R$ 431,25") — 12x com a taxa de 15% aplicada ao total. */
  parcelaFormatado: string;
}

const VALOR_EXEMPLO = 4500;

export const PC_GAMER_SAMPLE_DATA: PcGamerSampleData = {
  nome: 'PC Gamer Ryzen 5 5600',
  processador: 'AMD Ryzen 5 5600',
  memoriaRam: '16GB DDR4 3200MHz',
  ssd: 'SSD NVMe 512GB',
  hd: 'HD 1TB',
  placaVideo: 'RTX 3060 12GB',
  jogos: 'Fortnite · GTA V · Valorant · CS2 · FIFA',
  valorFormatado: formatCurrency(VALOR_EXEMPLO),
  parcelaFormatado: formatCurrency(calculateInstallmentValue(VALOR_EXEMPLO)),
};

export interface PcGamerTemplateProps {
  data: PcGamerSampleData;
}

export const PC_GAMER_TEMPLATE_CATEGORIES = [
  'Gamer Pesado',
  'Gamer Clean',
] as const;

export type PcGamerTemplateCategory = (typeof PC_GAMER_TEMPLATE_CATEGORIES)[number];

export interface PcGamerTemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: PcGamerTemplateCategory;
  Component: ComponentType<PcGamerTemplateProps>;
}

const SELECTED_PC_GAMER_TEMPLATE_KEY = 'jp_pcgamer_template_id_v1';

export function getSelectedPcGamerTemplateId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SELECTED_PC_GAMER_TEMPLATE_KEY);
}

export function setSelectedPcGamerTemplateId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    window.localStorage.setItem(SELECTED_PC_GAMER_TEMPLATE_KEY, id);
  } else {
    window.localStorage.removeItem(SELECTED_PC_GAMER_TEMPLATE_KEY);
  }
}

/** Converte um PC real do gerador no formato que os modelos esperam. */
export function pcGamerToSampleData(pc: PcGamerLabel): PcGamerSampleData {
  const valor = parseCurrencyInput(pc.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  return {
    nome: pc.nome || 'PC Gamer',
    processador: pc.processador || '—',
    memoriaRam: pc.memoriaRam || '—',
    ssd: pc.ssd || '—',
    hd: pc.hd || '—',
    placaVideo: pc.placaVideo || '—',
    jogos: pc.jogos || '',
    valorFormatado: valor > 0 ? formatCurrency(valor) : 'R$ --',
    parcelaFormatado: valor > 0 ? formatCurrency(parcela) : '—',
  };
}
