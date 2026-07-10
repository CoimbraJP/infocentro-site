import { LucideGem, LucideCpu, LucideMemoryStick, LucideHardDrive, LucideMonitor, LucideGamepad2 } from 'lucide-react';
import type { LabelTemplateProps } from '@/lib/jp/label-templates';

// Grupo 3 — Corporativo, Moderno, Luxo, Elegante, Compacto.
// Placa de vídeo é opcional — sempre filtrada por Boolean, só aparece quando
// preenchida.

/** Corporativo: ficha técnica formal, linhas zebradas, selo de conformidade, caixa de preço discreta. */
export function TemplateCorporativo({ data }: LabelTemplateProps) {
  const rows: [string, string][] = [
    ['Processador', data.processador],
    ['Memória', data.memoriaRam],
    ['Armazenamento', data.armazenamento],
    ['Sistema Operacional', data.sistemaOperacional],
    ['Bateria', data.bateria],
  ];
  if (data.placaVideo) rows.push(['Placa de Vídeo', data.placaVideo]);
  return (
    <div className="w-[280px] border border-slate-300 bg-white text-slate-800 shadow-sm">
      <div className="flex items-center justify-between border-b-2 border-slate-800 bg-slate-800 px-5 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white">Ficha Técnica</p>
        <p className="text-[9px] text-white/50">Info Centro</p>
      </div>
      <div className="p-5">
        <h3 className="text-base font-bold text-slate-900">{data.marcaModelo}</h3>
        <div className="mt-3">
          {rows.map(([label, value], i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-2 py-1.5 text-[11px] ${i % 2 === 0 ? 'bg-slate-50' : ''}`}
            >
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-wide text-slate-400">Ref. Vitrine</p>
          <div className="border border-slate-300 px-3 py-2 text-right">
            <p className="text-sm font-bold text-slate-900">{data.valorFormatado}</p>
            <p className="text-[10px] text-slate-500">12x de {data.parcelaFormatado}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Moderno: bloco diagonal bicolor, preço como badge flutuante no canto. */
export function TemplateModerno({ data }: LabelTemplateProps) {
  const specs = [
    { icon: LucideCpu, label: data.processador },
    { icon: LucideMemoryStick, label: data.memoriaRam },
    { icon: LucideHardDrive, label: data.armazenamento },
    ...(data.placaVideo ? [{ icon: LucideGamepad2, label: data.placaVideo }] : []),
  ];
  return (
    <div className="relative w-[280px] overflow-visible bg-white pb-2 pr-2 text-black shadow-sm">
      <div
        className="relative overflow-hidden bg-[#111111] px-5 pb-8 pt-5"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-primary/20" style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 40%, 80% 100%, 40% 100%)' }} />
        <p className="relative text-[10px] font-bold uppercase tracking-widest text-white/50">Info Centro</p>
        <h3 className="relative mt-1 text-xl font-black text-white [text-wrap:pretty]">{data.marcaModelo}</h3>
      </div>
      <div className="absolute -top-4 right-3 rounded-xl bg-primary px-4 py-2 text-right shadow-lg">
        <p className="text-lg font-black text-black">{data.valorFormatado}</p>
        <p className="text-[9px] font-medium text-black/60">12x {data.parcelaFormatado}</p>
      </div>
      <div className="space-y-2 px-5 pt-6">
        {specs.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-black/70">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5">
              <Icon size={13} />
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Luxo: fundo marmorizado suave, filete dourado, tipografia bem espaçada. */
export function TemplateLuxo({ data }: LabelTemplateProps) {
  return (
    <div
      className="w-[280px] border-t-2 border-[#C9A65B] p-8 text-center text-[#2b2b2b] shadow-lg"
      style={{ background: 'linear-gradient(160deg, #fdfdfc, #ece7e0 60%, #fdfdfc)' }}
    >
      <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a7a56]">Info Centro</p>
      <h3 className="mt-5 text-xl font-light uppercase tracking-[0.15em] [text-wrap:pretty]">{data.marcaModelo}</h3>
      <div className="mx-auto my-5 flex items-center justify-center gap-2 text-[#C9A65B]">
        <LucideGem size={12} />
      </div>
      <div className="space-y-1.5 text-[11px] leading-relaxed text-[#2b2b2b]/70">
        <p>{data.processador}</p>
        <p>{data.memoriaRam} · {data.armazenamento}</p>
        <p>{data.sistemaOperacional} · {data.bateria}</p>
        {data.placaVideo && <p>{data.placaVideo}</p>}
      </div>
      <div className="mx-auto mt-6 w-fit border border-[#C9A65B] px-6 py-3">
        <p className="text-2xl font-light">{data.valorFormatado}</p>
        <p className="mt-1 text-[10px] tracking-wide text-[#8a7a56]">12 vezes de {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Elegante: tons pastel, specs como pills suaves, preço num cartão arredondado. */
export function TemplateElegante({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="w-[280px] rounded-3xl border border-[#e7ded3] bg-[#fbf6ef] p-6 text-[#4a4340] shadow-sm">
      <p className="font-serif text-sm italic text-[#a9764f]">Info Centro</p>
      <h3 className="mt-2 text-lg font-semibold text-[#4a4340] [text-wrap:pretty]">{data.marcaModelo}</h3>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {specs.map((s) => (
          <span key={s} className="rounded-full border border-[#e7ded3] bg-white px-2.5 py-1 text-[10px] text-[#4a4340]/70">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-white px-4 py-3">
        <p className="text-xl font-semibold text-[#a9764f]">{data.valorFormatado}</p>
        <p className="text-[11px] text-[#4a4340]/50">ou 12x de {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}

/** Compacto: etiqueta pequena e densa, otimizada pro tamanho real de uma sticker. */
export function TemplateCompacto({ data }: LabelTemplateProps) {
  const specsLinha = [data.processador, data.memoriaRam, data.armazenamento, data.placaVideo]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className="w-[200px] border border-dashed border-black/25 bg-white p-4 text-black shadow-sm">
      <p className="text-[9px] font-bold uppercase text-black/40">Info Centro</p>
      <h3 className="text-xs font-bold leading-tight [text-wrap:pretty]">{data.marcaModelo}</h3>
      <p className="mt-1 text-[9px] leading-snug text-black/60 [text-wrap:pretty]">
        {specsLinha} | {data.sistemaOperacional} | {data.bateria}
      </p>
      <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-1.5">
        <div className="flex items-center gap-1 text-[9px] text-black/40">
          <LucideMonitor size={10} />
        </div>
        <p className="text-base font-black">{data.valorFormatado}</p>
      </div>
      <p className="text-right text-[8px] text-black/40">12x {data.parcelaFormatado}</p>
    </div>
  );
}
