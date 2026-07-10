import type { ComponentType } from 'react';
import { formatCurrency, calculateInstallmentValue, parseCurrencyInput } from './etiquetas';
import type { NotebookLabel } from './etiquetas';

// Dados fixos usados por TODOS os modelos do showroom (/jp/etiquetas/modelos).
// A ideia é isolar completamente a variável "dado" da variável "design": todo
// modelo recebe exatamente as mesmas informações, então qualquer diferença
// visual entre eles vem só do layout, não do conteúdo.
export interface LabelSampleData {
  marcaModelo: string;
  processador: string;
  memoriaRam: string;
  armazenamento: string;
  sistemaOperacional: string;
  bateria: string;
  /** Opcional — vazio quando o notebook não tem placa de vídeo dedicada. */
  placaVideo: string;
  /** Já formatado (ex: "R$ 1.000,00") para não repetir a chamada em cada template. */
  valorFormatado: string;
  /** Já formatado (ex: "R$ 95,83") — 12x com a taxa de 15% aplicada ao total. */
  parcelaFormatado: string;
}

const VALOR_EXEMPLO = 1000;

export const LABEL_SAMPLE_DATA: LabelSampleData = {
  marcaModelo: 'Lenovo G40-80',
  processador: 'Intel Core i5',
  memoriaRam: '8GB RAM',
  armazenamento: '500GB HD',
  sistemaOperacional: 'Windows 10',
  bateria: 'Bateria Boa',
  placaVideo: 'NVIDIA GeForce GTX 1660',
  valorFormatado: formatCurrency(VALOR_EXEMPLO),
  parcelaFormatado: formatCurrency(calculateInstallmentValue(VALOR_EXEMPLO)),
};

export interface LabelTemplateProps {
  data: LabelSampleData;
}

export const LABEL_TEMPLATE_CATEGORIES = [
  'Modelos do Usuário',
  'Editorial & Minimalista',
  'Varejo & Promoção',
  'Corporativo & Marca',
  'Premium & Sofisticado',
  'Tech & Formatos',
] as const;

export type LabelTemplateCategory = (typeof LABEL_TEMPLATE_CATEGORIES)[number];

export interface LabelTemplateDefinition {
  id: string;
  name: string;
  /** Curta descrição do estilo, mostrada abaixo do nome no catálogo. */
  description: string;
  /** Agrupamento usado para organizar o showroom em seções, como um catálogo de verdade. */
  category: LabelTemplateCategory;
  Component: ComponentType<LabelTemplateProps>;
}

// Qual modelo o usuário escolheu em /jp/etiquetas/modelos. Fica salvo no
// localStorage (não tem backend) pra o gerador (/jp/etiquetas) aplicar esse
// mesmo layout tanto na prévia em tela quanto no "Gerar PDF" — sem isso, o
// botão "Selecionar Modelo" não tinha efeito nenhum fora da própria página
// do showroom, que era exatamente o bug reportado.
const SELECTED_TEMPLATE_STORAGE_KEY = 'jp_etiquetas_template_id_v1';

export function getSelectedTemplateId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(SELECTED_TEMPLATE_STORAGE_KEY);
}

export function setSelectedTemplateId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    window.localStorage.setItem(SELECTED_TEMPLATE_STORAGE_KEY, id);
  } else {
    window.localStorage.removeItem(SELECTED_TEMPLATE_STORAGE_KEY);
  }
}

/** Converte uma etiqueta real do gerador no formato que os 20 templates esperam. */
export function notebookToLabelSampleData(notebook: NotebookLabel): LabelSampleData {
  const valor = parseCurrencyInput(notebook.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  return {
    marcaModelo: notebook.marcaModelo || 'Marca / Modelo não informado',
    processador: notebook.processador || '—',
    memoriaRam: notebook.memoriaRam || '—',
    armazenamento: notebook.armazenamento || '—',
    sistemaOperacional: notebook.sistemaOperacional || '—',
    bateria: notebook.bateria ? `Bateria ${notebook.bateria}` : '—',
    placaVideo: notebook.placaVideo || '',
    valorFormatado: valor > 0 ? formatCurrency(valor) : 'R$ --',
    parcelaFormatado: valor > 0 ? formatCurrency(parcela) : '—',
  };
}
