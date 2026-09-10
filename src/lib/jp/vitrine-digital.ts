// Vitrine Digital: etiqueta em formato de tela de celular, com foto do
// notebook, pra exibir num tablet/celular fixado do lado do produto na loja
// — um aparelho diferente do que o usuário usa pra cadastrar no painel.
//
// Como o sistema inteiro é local (sem servidor/banco de dados), não dá pra
// simplesmente salvar no localStorage e esperar outro aparelho enxergar. A
// solução é embutir os dados inteiros (specs, preço e a foto já comprimida)
// direto no link, depois do "#" — o "#" nunca é enviado a nenhum servidor,
// então isso funciona só no navegador, sem precisar de backend. Basta abrir
// o mesmo link no aparelho de exibição (colando, ou compartilhando por
// WhatsApp/e-mail) que ele mostra exatamente a mesma etiqueta.

export interface VitrineDigitalPayload {
  marcaModelo: string;
  processador: string;
  memoriaRam: string;
  armazenamento: string;
  sistemaOperacional: string;
  bateria: string;
  placaVideo: string;
  valorAVista: string;
  /** Data URL (WebP) já comprimida — ver compressImageFile em fotos-modelo.ts. */
  foto: string | null;
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

export function encodeVitrinePayload(payload: VitrineDigitalPayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeVitrinePayload(encoded: string): VitrineDigitalPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (!parsed || typeof parsed !== 'object' || typeof parsed.marcaModelo !== 'string') return null;
    return parsed as VitrineDigitalPayload;
  } catch {
    return null;
  }
}

/** Monta a URL completa (com origin do navegador atual) pronta pra copiar/compartilhar. */
export function buildVitrineDigitalUrl(payload: VitrineDigitalPayload): string {
  const encoded = encodeVitrinePayload(payload);
  return `${window.location.origin}/jp/vitrine-digital#${encoded}`;
}
