import type { LabelTemplateDefinition } from '@/lib/jp/label-templates';
import {
  TemplateUsuarioClassico,
  TemplateUsuarioEscuro,
  TemplateUsuarioContorno,
  TemplateUsuarioBloco,
  TemplateUsuarioMinimal,
} from './group5';
import {
  TemplateMinimalista,
  TemplateAppleStore,
  TemplateDell,
  TemplateLenovo,
  TemplateGamerRGB,
} from './group1';
import {
  TemplatePremium,
  TemplateBlackFriday,
  TemplateMagazineLuiza,
  TemplateKabum,
  TemplateFastShop,
} from './group2';
import {
  TemplateCorporativo,
  TemplateModerno,
  TemplateLuxo,
  TemplateElegante,
  TemplateCompacto,
} from './group3';
import {
  TemplateVertical,
  TemplateHorizontal,
  TemplateTecnologico,
  TemplateClean,
  TemplateComercial,
} from './group4';

// Catálogo central dos modelos de etiqueta. Adicionar um modelo novo no
// futuro é só criar o componente (num dos grupos, ou num arquivo novo) e
// incluir uma entrada aqui — a página do showroom não precisa mudar.
// A ordem abaixo já segue o agrupamento por categoria usado no showroom.
export const LABEL_TEMPLATES: LabelTemplateDefinition[] = [
  // Modelos do Usuário
  { id: 'usuario-classico', name: 'Ficha Clássica', description: 'Selo escuro, grid de specs com ícones, pílula de bateria e preço dividido.', category: 'Modelos do Usuário', Component: TemplateUsuarioClassico },
  { id: 'usuario-escuro', name: 'Ficha Escura', description: 'Mesma ficha, invertida em fundo escuro com selo amarelo.', category: 'Modelos do Usuário', Component: TemplateUsuarioEscuro },
  { id: 'usuario-contorno', name: 'Ficha Contorno', description: 'Faixa de acento no topo, specs em lista, bateria com indicador de ponto.', category: 'Modelos do Usuário', Component: TemplateUsuarioContorno },
  { id: 'usuario-bloco', name: 'Ficha Bloco', description: 'Selo dentro de uma faixa cheia no topo, preço dividido por linha vertical.', category: 'Modelos do Usuário', Component: TemplateUsuarioBloco },
  { id: 'usuario-minimal', name: 'Ficha Minimal', description: 'Selo isolado, bastante espaço em branco, specs em uma única linha.', category: 'Modelos do Usuário', Component: TemplateUsuarioMinimal },

  // Editorial & Minimalista
  { id: 'minimalista', name: 'Minimalista', description: 'Tipografia fina, uma linha de specs, muito espaço em branco.', category: 'Editorial & Minimalista', Component: TemplateMinimalista },
  { id: 'apple-store', name: 'Apple Store', description: 'Centralizado, sem ícones, hierarquia só na tipografia.', category: 'Editorial & Minimalista', Component: TemplateAppleStore },
  { id: 'clean', name: 'Clean', description: 'Sublinhado de destaque, specs em tabela explícita label:valor.', category: 'Editorial & Minimalista', Component: TemplateClean },
  { id: 'compacto', name: 'Compacto', description: 'Etiqueta pequena e densa, otimizada pro tamanho real de um sticker.', category: 'Editorial & Minimalista', Component: TemplateCompacto },

  // Varejo & Promoção
  { id: 'black-friday', name: 'Black Friday', description: 'Contraste agressivo preto/amarelo/vermelho, preço gigante.', category: 'Varejo & Promoção', Component: TemplateBlackFriday },
  { id: 'magazine-luiza', name: 'Magazine Luiza', description: 'Header em onda colorida, preço em pílula arredondada.', category: 'Varejo & Promoção', Component: TemplateMagazineLuiza },
  { id: 'kabum', name: 'Kabum', description: 'Dark + laranja, bullets quadrados, à vista x parcelado lado a lado.', category: 'Varejo & Promoção', Component: TemplateKabum },
  { id: 'comercial', name: 'Comercial', description: 'Etiqueta de prateleira clássica, preço gigante primeiro.', category: 'Varejo & Promoção', Component: TemplateComercial },

  // Corporativo & Marca
  { id: 'dell', name: 'Dell', description: 'Banner corporativo azul, specs em tabela, preço em caixa.', category: 'Corporativo & Marca', Component: TemplateDell },
  { id: 'lenovo', name: 'Lenovo', description: 'Corte diagonal vermelho, specs com ícone, faixa de preço no rodapé.', category: 'Corporativo & Marca', Component: TemplateLenovo },
  { id: 'corporativo', name: 'Corporativo', description: 'Ficha técnica formal, linhas zebradas, caixa de preço discreta.', category: 'Corporativo & Marca', Component: TemplateCorporativo },
  { id: 'fast-shop', name: 'Fast Shop', description: 'Premium clean, grid de specs, preço em caixa no canto.', category: 'Corporativo & Marca', Component: TemplateFastShop },

  // Premium & Sofisticado
  { id: 'premium', name: 'Premium', description: 'Preto e dourado, serifada, simétrica.', category: 'Premium & Sofisticado', Component: TemplatePremium },
  { id: 'luxo', name: 'Luxo', description: 'Fundo marmorizado, filete dourado, tipografia bem espaçada.', category: 'Premium & Sofisticado', Component: TemplateLuxo },
  { id: 'elegante', name: 'Elegante', description: 'Tons pastel, specs em pills suaves, preço num cartão arredondado.', category: 'Premium & Sofisticado', Component: TemplateElegante },
  { id: 'moderno', name: 'Moderno', description: 'Bloco diagonal bicolor, preço como badge flutuante.', category: 'Premium & Sofisticado', Component: TemplateModerno },

  // Tech & Formatos
  { id: 'gamer-rgb', name: 'Gamer RGB', description: 'Fundo escuro, borda em degradê neon, tipografia condensada.', category: 'Tech & Formatos', Component: TemplateGamerRGB },
  { id: 'tecnologico', name: 'Tecnológico', description: 'Padrão de pontos, monoespaçada, visual de saída de terminal.', category: 'Tech & Formatos', Component: TemplateTecnologico },
  { id: 'vertical', name: 'Vertical', description: 'Retrato, ícone grande no topo, preço em faixa no rodapé.', category: 'Tech & Formatos', Component: TemplateVertical },
  { id: 'horizontal', name: 'Horizontal', description: 'Paisagem, specs à esquerda, painel de preço colorido à direita.', category: 'Tech & Formatos', Component: TemplateHorizontal },
];
