# Handoff — Módulo "Etiquetas" (/jp) para o PDV

Este documento descreve o módulo de Etiquetas de Vitrine hoje existente no site (Next.js, painel `/jp`), pra ser recriado/absorvido dentro do PDV (`https://info-pdv.vercel.app/`), que já tem backend real e sincronização entre dispositivos. Cole este arquivo inteiro na conversa do PDV.

## Contexto e decisão de arquitetura

Hoje o módulo `/jp/etiquetas` guarda tudo em `localStorage` do navegador (sem backend), porque nasceu como uma ferramenta isolada. Isso tem um problema real: os dados só existem no navegador de quem cadastrou, não sincronizam entre aparelhos/lojas, e não têm relação nenhuma com o estoque de verdade.

**Recomendação**: não construir um pipeline de importação automática de `/jp` pro PDV. Migrar as funcionalidades de etiqueta pra dentro do PDV, usando o banco de dados que ele já tem, e transformar "estoque" (que o PDV já modela: código, produto, quantidade, preço) na fonte única de verdade. A etiqueta passa a ser uma "view" gerada a partir de um item de estoque, não um cadastro paralelo. O site (`infocentrosjc.com.br`) só precisa linkar pro PDV.

O único dado que precisa ser transportado do sistema antigo é o que já está salvo em produção — ver seção "Importação única" no fim.

## Modelo de dados

```ts
interface NotebookLabel {
  id: string;
  marcaModelo: string;
  processador: string;
  memoriaRam: string;
  armazenamento: string;
  sistemaOperacional: string;   // 'Windows 11' | 'Windows 10' | 'Linux' | 'Sem Sistema Operacional'
  tela: string;                 // '11.6"' | '13.3"' | '14"' | '15.6"' | '17.3"'
  bateria: 'Boa' | 'Ruim' | ''; // união estrita — só duas opções + vazio, nunca texto livre
  placaVideo: string;           // opcional; string vazia = não aparece na etiqueta
  valorAVista: string;          // texto bruto digitado (ex: "1899,00"), não number
  createdAt: number;            // timestamp ms
}
```

No PDV, o ideal é este conjunto de campos virar atributos do item de estoque (ou uma tabela `product_specs` ligada por `product_id`), com `valorAVista` mapeado pro campo de preço que já existe lá, e um campo boolean/enum pra bateria.

## Fórmula de parcelamento (regra de negócio, preservar exatamente)

```ts
const INSTALLMENT_RATE = 0.15; // 15% de acréscimo
const INSTALLMENTS = 12;

function calculateInstallmentValue(valorAVista: number): number {
  if (valorAVista <= 0) return 0;
  return (valorAVista * (1 + INSTALLMENT_RATE)) / INSTALLMENTS;
}
```

O parcelado NUNCA é digitado — sempre calculado a partir do valor à vista. Isso foi validado batendo com os valores reais de "12x de R$X" que o usuário já pratica pros 15 notebooks do catálogo atual.

Formatação de moeda: `value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`.

## Catálogo atual (15 modelos, referência — não precisa recriar como "presets" se o PDV já tem estoque real, mas serve pra popular/testar)

| Modelo | Processador | RAM | Armazenamento | SO | Bateria | À vista |
|---|---|---|---|---|---|---|
| Lenovo G40-80 | Intel Core i5 | 8GB | 500GB HD | Windows 11 | Ruim | R$1.899,00 |
| Dell Vostro 14 3468 | Intel Core i5 | 8GB | 500GB HD | Windows 10 | Ruim | R$1.499,00 |
| Lenovo ThinkPad E431 | Intel Core i3 | 6GB | 320GB HD | Windows 10 | Boa | R$1.499,00 |
| Lenovo IdeaPad S145 | Intel Core i5 8ª Ger. | 8GB | 240GB SSD | Windows 10 | Boa | R$2.499,00 |
| Compaq Presario CQ-17 | Intel Core i5 | 4GB | 32GB SSD + 500GB HD | Windows 10 | Boa | R$1.799,00 |
| Samsung 350X | Intel Core i5 | 8GB | 240GB NVMe SSD | Windows 10 | Boa | R$2.499,00 |
| Acer Aspire A315-53 | Intel Core i3 7ª Ger. | 8GB | 120GB SSD | Windows 10 | Boa | R$1.899,00 |
| Dell Vostro 3300 | Intel Core i5 | 4GB | 128GB NVMe SSD | Windows 10 | Boa | R$2.399,00 |
| Asus K45A | Intel Core i5 | 8GB | 240GB SSD | Windows 10 | Boa | R$2.399,00 |
| Lenovo L440 | Intel Core i7 | 16GB | 120GB SSD | Windows 11 | Boa | R$2.999,00 |
| Samsung NP550X | Intel Celeron | 4GB | 500GB HD | Windows 10 | Boa | R$2.399,00 |
| Positivo Vision C15 | Intel Celeron | 4GB | 120GB NVMe SSD | Windows 10 | Boa | R$1.699,00 |
| Asus X5DIJ | Intel Dual Core | 4GB | 320GB HD | Windows 10 | Ruim | R$899,00 |
| Lenovo LNV L4070 | Intel Core i3 | 4GB | 320GB HD | Windows 10 | Ruim | R$899,00 |
| Asus X552E | AMD C | 4GB | 500GB HD | Windows 10 | Ruim | R$999,00 |

## Templates visuais de etiqueta (5 modelos "do usuário")

Todos quadrados (`aspect-square`, 340px de referência), fundo com logo `INFO CENTRO` (arquivo `/jp/info-centro-mark.png` — pedir pro usuário reenviar/hospedar no PDV), specs com ícone (Processador/Memória RAM/Armazenamento/Sistema, com Placa de Vídeo opcional só aparecendo se preenchida), pílula de bateria (verde "BATERIA BOA" / vermelho "BATERIA RUIM"), rodapé com À Vista + Parcelado.

Layout específico: nos modelos de grid 2 colunas (Clássico, Escuro, Bloco), Bateria e Placa de Vídeo ficam lado a lado na mesma linha, logo abaixo da linha Armazenamento/Sistema — isso foi um ajuste explícito pedido pelo usuário. Nos modelos de lista (Contorno, Minimal) a placa de vídeo entra como mais uma linha/item no mesmo padrão dos demais, nunca como pílula separada.

Os 5 templates (Clássico, Escuro, Contorno, Bloco, Minimal) têm o código-fonte completo em `src/components/jp/etiquetas/templates/group5.tsx` no repositório do site — copiar esse arquivo é o caminho mais rápido pra recriar visualmente idêntico no PDV (é só React + Tailwind, sem dependência externa além de `lucide-react`).

## Impressão / geração de PDF (técnica de auto-ajuste)

Problema original: o navegador imprimindo etiquetas em A4 sem controle de layout jogava só 4 por página, forçando o usuário a mexer manualmente em zoom da impressora (96%) pra caber 6.

Solução implementada (reaproveitar tal e qual):

1. CSS de página: `@page { size: A4; margin: 6mm; }` dentro de `@media print`, mais a correção obrigatória de cor:
```css
@media print {
  @page { size: A4; margin: 6mm; }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
```
Sem o `print-color-adjust: exact`, o navegador remove fundos/gradientes na impressão por padrão — a etiqueta impressa fica "sem graça" e diferente do modelo escolhido na tela.

2. Cálculo do tamanho exato de cada slot da grade, em pixels a 96dpi, a partir da área útil real do A4 menos as margens:
```ts
const MM_TO_PX = 96 / 25.4;
const PAGE_CONTENT_WIDTH_PX = 198 * MM_TO_PX;  // ~748px (210mm - 2x6mm)
const PAGE_CONTENT_HEIGHT_PX = 285 * MM_TO_PX; // ~1077px (297mm - 2x6mm)
const GRID_GAP_PX = 16; // bate com gap-4 do Tailwind
const SAFETY_MARGIN = 0.985; // folga de 1.5% pra nunca estourar por arredondamento

const PRINT_LAYOUTS = {
  6: { cols: 2, rows: 3, fontBoost: 1 },
  9: { cols: 3, rows: 3, fontBoost: 1.15 },
};

function computePrintCellSize(perPage) {
  const { cols, rows, fontBoost } = PRINT_LAYOUTS[perPage];
  const width = ((PAGE_CONTENT_WIDTH_PX - GRID_GAP_PX * (cols - 1)) / cols) * SAFETY_MARGIN;
  const height = ((PAGE_CONTENT_HEIGHT_PX - GRID_GAP_PX * (rows - 1)) / rows) * SAFETY_MARGIN;
  return { width, height, cols, fontBoost };
}
```

3. Componente `PrintFitStage` que mede o tamanho natural (sem transform) do template renderizado via `ResizeObserver` + `scrollWidth`/`scrollHeight`, e aplica `transform: scale()` pra caber exatamente no slot calculado acima — isso garante "6 por página" ou "9 por página" de verdade, sem o usuário precisar tocar em configuração nenhuma de impressora:
```tsx
function PrintFitStage({ children, targetWidth, targetHeight, fontBoost = 1 }) {
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const recalc = () => {
      const w = content.scrollWidth, h = content.scrollHeight;
      if (!w || !h) return;
      const next = Math.min(targetWidth / w, targetHeight / h);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };
    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(content);
    return () => observer.disconnect();
  }, [targetWidth, targetHeight, fontBoost]);
  const boostedStyle = fontBoost !== 1 ? { fontSize: `${fontBoost * 100}%` } : {};
  return (
    <div style={{ width: targetWidth, height: targetHeight }} className="flex items-center justify-center overflow-hidden">
      <div ref={contentRef} style={{ transform: `scale(${scale})`, ...boostedStyle }}>{children}</div>
    </div>
  );
}
```
`fontBoost` aumenta a fonte do conteúdo ANTES de medir — como a etapa final sempre encolhe pra caber, o efeito é texto proporcionalmente maior sem nunca estourar a margem.

4. Geração do PDF em si é feita com `window.print()` do navegador (o usuário escolhe "Salvar como PDF" no diálogo nativo) — não usa nenhuma lib de geração de PDF no servidor. Isso é reaproveitável direto no PDV sem mudança.

## Biblioteca de etiquetas salvas (persistência + reordenação manual)

Feature: além do formulário de trabalho (que no site expira em 30 dias), existe uma "biblioteca" permanente onde o usuário salva etiquetas individualmente ou em lote, com página dedicada pra ver todas, editar, apagar e reordenar manualmente (drag-and-drop).

No PDV isso deveria ser natural — cada notebook em estoque já É a "etiqueta salva" permanente, não precisa de uma tabela separada de "salvos". A reordenação manual (se fizer sentido manter) pode virar um campo `sortOrder`/`position` na tabela de produtos, atualizado via drag-and-drop.

Detalhes técnicos da reordenação (caso replicado): usamos `@dnd-kit/core` + `@dnd-kit/sortable` (`PointerSensor` pra mouse, `TouchSensor` com `activationConstraint: { delay: 200, tolerance: 8 }` pra não atrapalhar scroll no celular), com uma "alcinha" (ícone de grip) dedicada como único ponto arrastável de cada card, pra não conflitar com cliques em botões/checkbox/campos de edição.

## Vitrine Digital (etiqueta formato celular, com foto)

Formato adicional de etiqueta: cartão vertical fixo em 480×960px (não responsivo — tamanho fixo garante que a imagem baixada e a exibição ao vivo sejam sempre pixel-a-pixel iguais), com foto do produto (fundo removido externamente pelo usuário antes de anexar), specs no mesmo padrão dos outros templates, pílula de bateria e rodapé de preço.

Fluxo hoje: usuário anexa uma foto por MODELO (não por unidade — reaproveitada automaticamente em qualquer notebook do mesmo modelo), foto é comprimida no navegador (canvas → WebP, redimensionada pra no máximo 480px do lado maior, qualidade 0.75) antes de guardar, porque fotos de internet costumam vir com vários MB. A entrega principal é BAIXAR A IMAGEM (PNG, via `html-to-image`, `pixelRatio: 2`) pra mandar direto pro cliente por WhatsApp — individualmente ou todas de uma vez via "Gerar Todos" (zip com `jszip`, contendo um PNG por modelo com foto).

Existe também um link de exibição ao vivo (pra deixar aberto num tablet fixo na loja), que hoje funciona embutindo o payload inteiro (specs + foto em base64) depois do `#` na URL — funciona sem backend porque o hash nunca é enviado ao servidor, mas é uma técnica de contorno pra quando não existe banco de dados nenhum.

**Recomendação explícita pro PDV**: essa técnica de payload-na-URL deve ser SIMPLIFICADA/removida. Com backend real, o link de exibição deveria ser simplesmente `/vitrine/[productId]`, buscando os dados no banco — muito mais simples, sem limite de tamanho de URL, e a foto fica de fato hospedada (upload real) em vez de embutida como base64 gigante no link.

Código de referência pra copiar:
- `src/lib/jp/fotos-modelo.ts` — compressão de imagem (`compressImageFile`, técnica FileReader → Image → canvas → `toDataURL('image/webp', quality)`, reaproveitável tal e qual pro upload no PDV antes de mandar pro storage real).
- `src/components/jp/etiquetas/VitrineDigitalCard.tsx` — o card visual fixo 480×960.
- `src/lib/jp/vitrine-digital.ts` — a parte do payload-na-URL que deve ser descartada/substituída por busca no banco.

## Importação única (dados já salvos em produção)

O usuário tem notebooks já cadastrados na biblioteca salva em produção: `https://www.infocentrosjc.com.br/jp/etiquetas`. **Isso — e só isso — deve ser importado pro PDV**, não o sistema inteiro.

Como esses dados vivem em `localStorage` do navegador real do usuário (chave `jp_etiquetas_biblioteca_v1`), não há como extrair remotamente — nem o assistente do site nem o do PDV têm acesso ao navegador do usuário. O caminho é:

1. O usuário abre `https://www.infocentrosjc.com.br/jp/etiquetas/salvas` no navegador onde os dados estão salvos.
2. Clica no botão "Baixar backup (JSON)" (já implementado e no ar após o próximo deploy — ver comandos abaixo).
3. Isso baixa um arquivo `etiquetas-salvas-backup-AAAA-MM-DD.json` contendo um array de objetos `NotebookLabel` (schema exato descrito na seção "Modelo de dados" acima).
4. O usuário sobe esse arquivo JSON na conversa do PDV, e o assistente de lá escreve um script de importação único (map de cada campo pro schema do PDV, usando a fórmula de parcelamento acima se o PDV quiser exibir parcelado também).

Isso é uma migração pontual, não um pipeline recorrente — depois dela, o PDV passa a ser a fonte única e o `/jp` do site pode ser aposentado ou virar só um link pro PDV.
