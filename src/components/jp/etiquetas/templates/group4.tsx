import { LucideLaptop2, LucideScissors } from 'lucide-react';
import type { LabelTemplateProps } from '@/lib/jp/label-templates';

// Grupo 4 — Vertical, Horizontal, Tecnológico, Clean, Comercial.
// Placa de vídeo é opcional — sempre filtrada por Boolean, só aparece quando
// preenchida.

/** Vertical: retrato, ícone grande no topo, specs empilhadas centralizadas, preço em faixa no rodapé. */
export function TemplateVertical({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="w-[200px] border border-black/10 bg-white text-center text-black shadow-md">
      <div className="flex flex-col items-center px-4 pb-4 pt-6">
        <LucideLaptop2 size={40} strokeWidth={1.2} className="text-black/70" />
        <p className="mt-3 text-[9px] uppercase tracking-widest text-black/40">Info Centro</p>
        <h3 className="mt-1 text-sm font-bold leading-tight [text-wrap:pretty]">{data.marcaModelo}</h3>
        <div className="mt-3 space-y-1 text-[10px] text-black/55">
          {specs.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </div>
      <div className="bg-black px-4 py-3 text-white">
        <p className="text-lg font-bold">{data.valorFormatado}</p>
        <p className="text-[9px] text-white/50">12x de {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Horizontal: paisagem, specs à esquerda, painel de preço colorido à direita. */
export function TemplateHorizontal({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="flex w-[360px] border border-black/10 bg-white text-black shadow-md">
      <div className="flex-1 p-5">
        <p className="text-[9px] uppercase tracking-widest text-black/40">Info Centro</p>
        <h3 className="mt-1 text-base font-bold leading-tight [text-wrap:pretty]">{data.marcaModelo}</h3>
        <div className="mt-3 space-y-1 text-[10px] text-black/55">
          {specs.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </div>
      <div className="flex w-[130px] flex-col items-center justify-center border-l border-black/10 bg-primary/10 px-3 py-5 text-center">
        <p className="text-xl font-black leading-tight text-black">{data.valorFormatado}</p>
        <p className="mt-1 text-[9px] text-black/50">12x de</p>
        <p className="text-xs font-semibold text-black/70">{data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Tecnológico: padrão de pontos tipo circuito, tudo em monoespaçada, saída "terminal". */
export function TemplateTecnologico({ data }: LabelTemplateProps) {
  const dotPattern = 'radial-gradient(rgba(0,255,255,0.18) 1px, transparent 1px)';
  return (
    <div
      className="w-[280px] border border-cyan-500/30 bg-[#04070a] p-5 font-mono text-cyan-100 shadow-lg"
      style={{ backgroundImage: dotPattern, backgroundSize: '14px 14px' }}
    >
      <p className="text-[10px] text-cyan-400">[INFO_CENTRO]</p>
      <h3 className="mt-2 text-base font-bold text-white [text-wrap:pretty]">&gt; {data.marcaModelo}</h3>
      <div className="mt-3 space-y-1 text-[11px] text-cyan-200/80">
        <p>cpu.......: {data.processador}</p>
        <p>ram.......: {data.memoriaRam}</p>
        <p>storage...: {data.armazenamento}</p>
        {data.placaVideo && <p>gpu.......: {data.placaVideo}</p>}
        <p>os........: {data.sistemaOperacional}</p>
        <p>battery...: {data.bateria}</p>
      </div>
      <div className="mt-4 border-t border-cyan-500/20 pt-3">
        <p className="text-lg font-bold text-cyan-300">price: {data.valorFormatado}</p>
        <p className="text-[10px] text-cyan-200/50">installment: 12x {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Clean: cartão branco, sublinhado de destaque, specs em tabela explícita label:valor. */
export function TemplateClean({ data }: LabelTemplateProps) {
  const rows: [string, string][] = [
    ['Processador', data.processador],
    ['Memória', data.memoriaRam],
    ['Armazenamento', data.armazenamento],
    ['Sistema', data.sistemaOperacional],
    ['Bateria', data.bateria],
  ];
  if (data.placaVideo) rows.push(['Placa de Vídeo', data.placaVideo]);
  return (
    <div className="w-[280px] bg-white p-6 text-black shadow-sm">
      <h3 className="inline-block border-b-2 border-primary pb-1 text-lg font-bold [text-wrap:pretty]">{data.marcaModelo}</h3>
      <div className="mt-4 space-y-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-xs">
            <span className="text-black/45">{label}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 text-left">
        <p className="text-2xl font-bold">{data.valorFormatado}</p>
        <p className="text-xs text-black/45">12x de {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Comercial: etiqueta de prateleira clássica — preço gigante primeiro, specs pequenas depois. */
export function TemplateComercial({ data }: LabelTemplateProps) {
  const linha1 = [data.processador, data.memoriaRam, data.armazenamento].filter(Boolean).join(' · ');
  const linha2 = [data.sistemaOperacional, data.bateria, data.placaVideo].filter(Boolean).join(' · ');
  return (
    <div className="w-[280px] border-2 border-dashed border-black/40 bg-white p-5 text-center text-black shadow-sm">
      <div className="flex items-center justify-center gap-1 text-[9px] text-black/40">
        <LucideScissors size={10} /> RECORTE AQUI
      </div>
      <div className="mt-2 bg-[#FFE600] py-4">
        <p className="text-4xl font-black leading-none">{data.valorFormatado}</p>
        <p className="mt-1 text-xs font-bold text-black/70">ou 12x de {data.parcelaFormatado}</p>
      </div>
      <h3 className="mt-3 text-sm font-bold [text-wrap:pretty]">{data.marcaModelo}</h3>
      <p className="mt-1 text-[10px] text-black/55 [text-wrap:pretty]">{linha1}</p>
      <p className="text-[10px] text-black/55 [text-wrap:pretty]">{linha2}</p>
      <p className="mt-2 text-[9px] uppercase tracking-widest text-black/30">Info Centro</p>
    </div>
  );
}
