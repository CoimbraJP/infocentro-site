import { createEmptyPcGamer, type PcGamerLabel } from './pc-gamer';

// Exemplos de montagem pra o botão "Carregar Exemplos" do gerador de PC
// Gamer — servem pra testar o layout das etiquetas e como ponto de partida
// pras montagens reais da loja. São três faixas típicas (entrada, custo x
// benefício e alto desempenho), com preços de referência que o usuário
// ajusta na hora. Assim como no módulo de notebooks, o parcelado nunca é
// digitado: sempre sai do valor à vista.
type PresetPcGamer = Partial<
  Pick<
    PcGamerLabel,
    'nome' | 'processador' | 'memoriaRam' | 'ssd' | 'hd' | 'placaVideo' | 'jogos' | 'valorAVista'
  >
>;

const PRESET_PC_GAMER: PresetPcGamer[] = [
  {
    nome: 'PC Gamer Entrada',
    processador: 'Intel Core i3 10100F',
    memoriaRam: '8GB DDR4 2666MHz',
    ssd: 'SSD NVMe 256GB',
    hd: 'HD 500GB',
    placaVideo: 'GTX 1650 4GB',
    jogos: 'Fortnite · Valorant · CS2 · League of Legends',
    valorAVista: '2499,00',
  },
  {
    nome: 'PC Gamer Custo x Benefício',
    processador: 'AMD Ryzen 5 5600',
    memoriaRam: '16GB DDR4 3200MHz',
    ssd: 'SSD NVMe 512GB',
    hd: 'HD 1TB',
    placaVideo: 'RTX 3060 12GB',
    jogos: 'GTA V · Fortnite · Valorant · CS2 · FIFA · Forza',
    valorAVista: '4499,00',
  },
  {
    nome: 'PC Gamer Alto Desempenho',
    processador: 'Intel Core i7 12700F',
    memoriaRam: '32GB DDR4 3600MHz',
    ssd: 'SSD NVMe 1TB',
    hd: 'HD 2TB',
    placaVideo: 'RTX 4070 12GB',
    jogos: 'Cyberpunk 2077 · GTA V · Call of Duty · Elden Ring',
    valorAVista: '8999,00',
  },
];

/** Gera a lista de PCs já preenchidos (cada um com id/expiração novos). */
export function createPresetPcGamers(): PcGamerLabel[] {
  return PRESET_PC_GAMER.map((preset) => ({
    ...createEmptyPcGamer(),
    ...preset,
  }));
}
