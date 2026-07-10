import { LucideDiamond, LucideFlame, LucideZap } from 'lucide-react';
import type { LabelTemplateProps } from '@/lib/jp/label-templates';

// Grupo 2 — Premium, Black Friday, Magazine Luiza, Kabum, Fast Shop.
// Placa de vídeo é opcional — sempre filtrada por Boolean, só aparece quando
// preenchida.

/** Premium: preto + dourado, serifada, simétrica. */
export function TemplatePremium({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div
      className="w-[280px] border-2 border-[#D4AF37] bg-black p-8 text-center text-[#F1E4B8] shadow-lg"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]">Info Centro</p>
      <h3 className="mt-4 text-2xl">{data.marcaModelo}</h3>
      <div className="my-5 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[#D4AF37]/50" />
        <LucideDiamond size={12} className="text-[#D4AF37]" />
        <span className="h-px w-10 bg-[#D4AF37]/50" />
      </div>
      <p className="text-xs leading-loose text-[#F1E4B8]/70 [text-wrap:pretty]">{specs.join(' — ')}</p>
      <p className="mt-6 text-3xl">
        <span className="mr-1 text-sm">R$</span>
        {data.valorFormatado.replace('R$', '').trim()}
      </p>
      <p className="mt-1 text-[11px] tracking-wide text-[#D4AF37]/70">12 x de {data.parcelaFormatado}</p>
    </div>
  );
}

/** Black Friday: preto/amarelo/vermelho, contraste agressivo, preço gigante. */
export function TemplateBlackFriday({ data }: LabelTemplateProps) {
  const linha1 = [data.processador, data.memoriaRam, data.armazenamento].filter(Boolean).join(' · ');
  const linha2 = [data.sistemaOperacional, data.bateria, data.placaVideo].filter(Boolean).join(' · ');
  return (
    <div className="w-[280px] overflow-hidden bg-black text-white shadow-lg">
      <div className="flex items-center gap-1.5 bg-[#FFE600] px-4 py-1.5 text-black">
        <LucideFlame size={13} />
        <p className="text-[11px] font-black uppercase tracking-wider">Oferta Info Centro</p>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-extrabold uppercase">{data.marcaModelo}</h3>
        <p className="mt-1 text-[11px] text-white/60 [text-wrap:pretty]">{linha1}</p>
        <p className="text-[11px] text-white/60 [text-wrap:pretty]">{linha2}</p>
        <div className="mt-4 bg-[#E60000] px-4 py-3 text-center">
          <p className="text-3xl font-black">{data.valorFormatado}</p>
          <p className="text-xs font-semibold text-white/90">12x de {data.parcelaFormatado}</p>
        </div>
      </div>
    </div>
  );
}

/** Magazine Luiza: header em onda colorida, preço em pílula arredondada. */
export function TemplateMagazineLuiza({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="w-[280px] overflow-hidden rounded-2xl bg-white text-black shadow-lg">
      <div
        className="relative px-5 pb-6 pt-4"
        style={{ background: 'linear-gradient(120deg, #FF0A8C, #A020F0)' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white/90" />
          <p className="text-xs font-bold text-white">Info Centro</p>
        </div>
        <h3 className="mt-2 text-lg font-bold text-white">{data.marcaModelo}</h3>
      </div>
      <div className="px-5 pb-5 pt-4">
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {specs.map((s) => (
            <span key={s} className="rounded-full bg-black/5 px-2.5 py-1 text-black/60">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 inline-flex items-baseline gap-2 rounded-full bg-[#FF0A8C]/10 px-4 py-2">
          <p className="text-2xl font-extrabold text-[#A020F0]">{data.valorFormatado}</p>
        </div>
        <p className="mt-1.5 text-xs text-black/50">ou 12x de {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Kabum: dark + laranja, bullets quadrados, comparativo à vista / parcelado (12x em destaque). */
export function TemplateKabum({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="w-[280px] bg-[#101010] p-5 text-white shadow-lg">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6B00]">Info Centro</p>
      <h3 className="mt-1 text-lg font-extrabold uppercase tracking-tight">{data.marcaModelo}</h3>
      <div className="mt-3 space-y-1.5">
        {specs.map((s) => (
          <div key={s} className="flex items-center gap-2 text-[11px] text-white/70">
            <span className="h-1.5 w-1.5 bg-[#FF6B00]" />
            {s}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-center rounded border border-white/10 px-3 py-2 text-center">
          <p className="text-[9px] uppercase text-white/40">à vista</p>
          <p className="text-sm font-bold">{data.valorFormatado}</p>
        </div>
        <div className="flex flex-col justify-center rounded bg-[#FF6B00] px-3 py-2 text-center">
          <p className="text-[9px] uppercase text-black/60">12x de</p>
          <p className="text-base font-black text-black">{data.parcelaFormatado}</p>
        </div>
      </div>
    </div>
  );
}

/** Fast Shop: premium clean, grid 2 colunas, preço em caixa no canto. */
export function TemplateFastShop({ data }: LabelTemplateProps) {
  const specs: [string, string][] = [
    ['Proc.', data.processador],
    ['RAM', data.memoriaRam],
    ['Disco', data.armazenamento],
    ['SO', data.sistemaOperacional],
  ];
  if (data.placaVideo) specs.push(['GPU', data.placaVideo]);
  return (
    <div className="relative w-[280px] border border-black/10 bg-white p-6 text-black shadow-sm">
      <div className="absolute right-5 top-5 rounded border border-black/15 bg-white px-3 py-1.5 text-right shadow-sm">
        <p className="text-base font-bold">{data.valorFormatado}</p>
        <p className="text-[9px] text-black/40">12x {data.parcelaFormatado}</p>
      </div>
      <p className="text-[10px] font-medium uppercase tracking-widest text-black/40">Info Centro</p>
      <h3 className="mt-1 max-w-[140px] text-base font-semibold leading-snug [text-wrap:pretty]" style={{ fontFamily: 'Georgia, serif' }}>
        {data.marcaModelo}
      </h3>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
        {specs.map(([label, value]) => (
          <div key={label}>
            <p className="text-[9px] uppercase text-black/35">{label}</p>
            <p className="text-xs font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-black/60">
        <LucideZap size={12} /> {data.bateria}
      </div>
    </div>
  );
}
