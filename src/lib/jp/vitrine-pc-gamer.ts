// Link de exibição da Vitrine Digital PC Gamer. Mesma técnica do módulo de
// notebooks: os dados inteiros (specs, jogos, preço e a foto já comprimida)
// vão embutidos depois do "#" da URL. O "#" nunca é enviado a servidor
// nenhum, então funciona só no navegador, sem backend — basta abrir o mesmo
// link no aparelho de exibição pra ele mostrar exatamente a mesma etiqueta.
//
// A entrega principal do módulo continua sendo a IMAGEM (PNG) pra baixar e
// mandar pro cliente; o link é o extra, pra quem quiser deixar rodando ao
// vivo num tablet ao lado da máquina exposta.

export interface VitrinePcGamerPayload {
  nome: string;
  processador: string;
  memoriaRam: string;
  ssd: string;
  hd: string;
  placaVideo: string;
  jogos: string;
  valorAVista: string;
  /** Data URL (WebP) já comprimida — ver compressImageFile em fotos-modelo.ts. */
  foto: string | null;
  /** Id do modelo visual escolhido (ver VitrinePcGamerCard). */
  modeloId?: string;
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeVitrinePcGamerPayload(payload: VitrinePcGamerPayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeVitrinePcGamerPayload(encoded: string): VitrinePcGamerPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (!parsed || typeof parsed !== 'object' || typeof parsed.nome !== 'string') return null;
    return parsed as VitrinePcGamerPayload;
  } catch {
    return null;
  }
}

/** Monta a URL completa (com origin do navegador atual) pronta pra copiar/compartilhar. */
export function buildVitrinePcGamerUrl(payload: VitrinePcGamerPayload): string {
  const encoded = encodeVitrinePcGamerPayload(payload);
  return `${window.location.origin}/jp/vitrine-pc-gamer#${encoded}`;
}

// Qual dos 6 modelos de cartão o usuário escolheu pra Vitrine Digital. Vale
// pra todas as máquinas de uma vez (é a identidade da vitrine da loja, não
// uma escolha por produto) e é o que o "Gerar Todos" usa no lote inteiro.
const VITRINE_PC_GAMER_MODELO_KEY = 'jp_pcgamer_vitrine_modelo_v1';

export function getVitrinePcGamerModelo(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(VITRINE_PC_GAMER_MODELO_KEY);
}

export function setVitrinePcGamerModelo(id: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VITRINE_PC_GAMER_MODELO_KEY, id);
}
