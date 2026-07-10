// Configuração central de URLs/ferramentas externas usadas pelo painel /jp.
// Manter aqui evita "magic strings" espalhadas pelos componentes e facilita
// trocar o destino de cada ferramenta no futuro (ex: variar por ambiente).

/** URL do sistema de PDV (Ponto de Venda) da loja. */
export const JP_PDV_URL =
  process.env.NEXT_PUBLIC_JP_PDV_URL ?? 'https://info-pdv.vercel.app/';
