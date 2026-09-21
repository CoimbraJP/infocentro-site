import type { PcGamerTemplateDefinition } from '@/lib/jp/pc-gamer-templates';
import {
  TemplateGamerPincelada,
  TemplateGamerPlaca,
  TemplateGamerCoroa,
  TemplateGamerControle,
  TemplateGamerCoroaCheia,
  TemplateGamerPreco,
} from './gamer';

// Catálogo dos modelos de etiqueta impressa do módulo PC Gamer. Criar um
// modelo novo é só escrever o componente em gamer.tsx (ou num arquivo novo)
// e adicionar uma entrada aqui — o showroom não precisa mudar.
export const PC_GAMER_TEMPLATES: PcGamerTemplateDefinition[] = [
  {
    id: 'gamer-pincelada',
    name: 'Pincelada',
    description: 'Assinatura riscada a pincel, specs em grade e barra de jogos pintada.',
    category: 'Gamer Pesado',
    Component: TemplateGamerPincelada,
  },
  {
    id: 'gamer-coroa',
    name: 'Coroa',
    description: 'Coroa sobre a assinatura em tinta — a mais chamativa da vitrine.',
    category: 'Gamer Pesado',
    Component: TemplateGamerCoroa,
  },
  {
    id: 'gamer-coroa-cheia',
    name: 'Coroa Cheia',
    description: 'Mesma coroa com a assinatura invertida, toda em amarelo.',
    category: 'Gamer Pesado',
    Component: TemplateGamerCoroaCheia,
  },
  {
    id: 'gamer-preco',
    name: 'Preço Grande',
    description: 'Preço em bloco amarelo sólido, specs compactas — pra ler de longe.',
    category: 'Gamer Pesado',
    Component: TemplateGamerPreco,
  },
  {
    id: 'gamer-placa',
    name: 'Placa',
    description: 'Assinatura emoldurada, tudo reto e alinhado, com selos no rodapé.',
    category: 'Gamer Clean',
    Component: TemplateGamerPlaca,
  },
  {
    id: 'gamer-controle',
    name: 'Controle',
    description: 'Ícone de controle e sublinhado reto, leitura mais calma.',
    category: 'Gamer Clean',
    Component: TemplateGamerControle,
  },
];

export const DEFAULT_PC_GAMER_TEMPLATE_ID = 'gamer-pincelada';
