// Estilo compartilhado dos campos de formulário do painel (inputs e selects).
//
// Foi reportado que o texto digitado ficava invisível: com fundo escuro e
// texto claro em <input>/<select>, alguns navegadores aplicam o próprio
// esquema de cores nativo (autofill, spinners, lista do <select>) por cima
// do nosso CSS, deixando texto claro sobre um controle que o navegador
// pinta de claro por conta própria. Um controle com fundo e texto
// explicitamente claros + `color-scheme: light` remove essa ambiguidade e
// garante contraste em qualquer navegador/SO.
//
// Não inclui `width` nem padding — cada campo define isso no próprio uso
// (ex: `${JP_INPUT_CLASS} w-full px-3 py-2.5` ou `pl-10 pr-3 py-3` quando há
// um ícone à esquerda). Manter essas propriedades fora da constante evita
// conflito entre classes Tailwind concorrendo pela mesma propriedade — duas
// classes de padding para o mesmo lado não têm ordem de prioridade
// garantida só por estarem juntas na mesma string de className.
export const JP_INPUT_CLASS =
  'rounded-lg border border-black/10 bg-white text-sm text-black placeholder:text-black/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:light]';
