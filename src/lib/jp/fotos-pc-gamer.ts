// Biblioteca de fotos dos PCs Gamer (pra Vitrine Digital do módulo). Mesma
// ideia da biblioteca de fotos de notebook, mas com chave própria de
// localStorage — anexar foto aqui não mexe nas fotos do outro módulo, e
// vice-versa.
//
// A compressão em si (compressImageFile) é reaproveitada do módulo de
// notebooks: é uma função genérica de imagem, sem nada específico de
// notebook, e duplicá-la só criaria duas versões pra manter.
import { compressImageFile } from './fotos-modelo';

export { compressImageFile };

const FOTOS_PC_GAMER_KEY = 'jp_pcgamer_fotos_v1';

function normalizeKey(nome: string): string {
  return nome.trim().toLowerCase().replace(/\s+/g, ' ');
}

function loadFotos(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(FOTOS_PC_GAMER_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function persistFotos(map: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FOTOS_PC_GAMER_KEY, JSON.stringify(map));
}

export function getFotoPcGamer(nome: string): string | null {
  if (!nome.trim()) return null;
  return loadFotos()[normalizeKey(nome)] ?? null;
}

export function setFotoPcGamer(nome: string, dataUrl: string): void {
  if (!nome.trim()) return;
  const map = loadFotos();
  map[normalizeKey(nome)] = dataUrl;
  persistFotos(map);
}

export function removeFotoPcGamer(nome: string): void {
  const map = loadFotos();
  delete map[normalizeKey(nome)];
  persistFotos(map);
}
