// Biblioteca de fotos por modelo (pra Vitrine Digital). Fica separada dos
// dados de cada etiqueta porque a mesma foto vale pra qualquer unidade do
// mesmo modelo (ex: 3 Lenovo G40-80 diferentes usam a mesma foto) — o
// usuário anexa a foto (já com fundo removido, feito por fora do sistema)
// uma vez por modelo, e ela é reaproveitada automaticamente.
//
// Comprimida em WebP no navegador antes de guardar: a foto original de uma
// busca na internet costuma vir com vários MB, o que não cabe nem no
// localStorage (limite de uns 5-10MB no total) nem num link compartilhável
// (ver vitrine-digital.ts). Redimensionar pra no máximo ~480px do lado maior
// já é mais que suficiente pra uma foto de produto exibida numa tela de
// celular/tablet, e derruba o tamanho pra a faixa de poucas dezenas de KB.

const FOTOS_MODELO_KEY = 'jp_etiquetas_fotos_modelo_v1';

function normalizeModelKey(marcaModelo: string): string {
  return marcaModelo.trim().toLowerCase().replace(/\s+/g, ' ');
}

function loadFotosModelo(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(FOTOS_MODELO_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function persistFotosModelo(map: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FOTOS_MODELO_KEY, JSON.stringify(map));
}

export function getFotoModelo(marcaModelo: string): string | null {
  if (!marcaModelo.trim()) return null;
  return loadFotosModelo()[normalizeModelKey(marcaModelo)] ?? null;
}

export function setFotoModelo(marcaModelo: string, dataUrl: string): void {
  if (!marcaModelo.trim()) return;
  const map = loadFotosModelo();
  map[normalizeModelKey(marcaModelo)] = dataUrl;
  persistFotosModelo(map);
}

export function removeFotoModelo(marcaModelo: string): void {
  const map = loadFotosModelo();
  delete map[normalizeModelKey(marcaModelo)];
  persistFotosModelo(map);
}

/**
 * Lê um arquivo de imagem escolhido pelo usuário, redimensiona pro tamanho
 * máximo informado (preservando proporção e transparência) e devolve como
 * data URL em WebP — pronta tanto pra guardar na biblioteca de fotos quanto
 * pra embutir num link de vitrine digital.
 */
export function compressImageFile(file: File, maxDimension = 480, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Não foi possível ler o arquivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo não é uma imagem válida.'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Este navegador não suporta processar imagens.'));
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
