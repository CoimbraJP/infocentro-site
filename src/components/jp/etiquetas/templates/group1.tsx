import { LucideCpu, LucideMemoryStick, LucideHardDrive, LucideZap, LucideGamepad2 } from 'lucide-react';
import type { LabelTemplateProps } from '@/lib/jp/label-templates';

// Grupo 1 — Minimalista, Apple Store, Dell, Lenovo, Gamer RGB.
// Cada componente é 100% autocontido (sem depender do Card padrão do painel):
// aqui o "card" É a etiqueta, do jeito que sairia impressa. Sombra suave em
// todos pra dar presença física de objeto sobre uma mesa/vitrine, e
// text-wrap:pretty nas linhas de specs pra evitar quebras feias.
//
// Placa de vídeo é opcional (nem todo notebook tem uma dedicada) — por isso
// entra sempre filtrada por Boolean/condicional, só aparecendo quando
// preenchida.

/** Minimalista: tipografia fina, uma única linha de specs separada por ponto, preço no rodapé. */
export function TemplateMinimalista({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="w-[280px] border border-black/15 bg-white p-8 text-black shadow-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/40">Notebook</p>
      <h3 className="mt-2 text-2xl font-light tracking-tight">{data.marcaModelo}</h3>
      <div className="my-5 h-px w-full bg-black/10" />
      <p className="text-xs leading-relaxed text-black/50 [text-wrap:pretty]">{specs.join(' · ')}</p>
      <div className="mt-8 flex items-end justify-between">
        <p className="text-[10px] text-black/30">INFO CENTRO</p>
        <div className="text-right">
          <p className="text-2xl font-semibold">
            <span className="mr-1 align-top text-xs font-normal">R$</span>
            {data.valorFormatado.replace('R$', '').trim()}
          </p>
          <p className="text-[11px] text-black/40">ou 12x de {data.parcelaFormatado}</p>
        </div>
      </div>
    </div>
  );
}

/** Apple Store: centralizado, sem ícones, hierarquia toda na tipografia. */
export function TemplateAppleStore({ data }: LabelTemplateProps) {
  const specs = [
    data.processador,
    data.memoriaRam,
    data.armazenamento,
    data.sistemaOperacional,
    data.bateria,
    data.placaVideo,
  ].filter(Boolean);
  return (
    <div className="w-[280px] bg-white p-10 text-center text-black shadow-sm">
      <p className="text-[11px] font-medium tracking-widest text-black/40">INFO CENTRO</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight">{data.marcaModelo}</h3>
      <p className="mx-auto mt-3 max-w-[200px] text-xs text-black/50 [text-wrap:pretty]">{specs.join(' · ')}</p>
      <div className="mx-auto my-6 h-px w-12 bg-black/15" />
      <p className="text-4xl font-semibold tracking-tight">{data.valorFormatado}</p>
      <p className="mt-1 text-sm text-black/50">ou 12x de {data.parcelaFormatado}</p>
    </div>
  );
}

/** Dell: banner corporativo azul no topo, specs em tabela, preço em caixa. */
export function TemplateDell({ data }: LabelTemplateProps) {
  const rows: [string, string][] = [
    ['Processador', data.processador],
    ['Memória', data.memoriaRam],
    ['Armazenamento', data.armazenamento],
    ['Sistema', data.sistemaOperacional],
    ['Bateria', data.bateria],
  ];
  if (data.placaVideo) rows.push(['Placa de Vídeo', data.placaVideo]);
  return (
    <div className="w-[280px] overflow-hidden border border-black/10 bg-white text-black shadow-sm">
      <div className="bg-[#0672CB] px-5 py-3">
        <p className="text-xs font-bold tracking-wide text-white">INFO CENTRO</p>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{data.marcaModelo}</h3>
        <div className="mt-4 divide-y divide-black/5 border-y border-black/5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-1.5 text-xs">
              <span className="text-black/45">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="rounded border-2 border-[#0672CB] px-4 py-2 text-right">
            <p className="text-lg font-bold text-[#0672CB]">{data.valorFormatado}</p>
            <p className="text-[10px] text-black/50">12x de {data.parcelaFormatado}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lenovo: corte diagonal vermelho, specs com ícone, faixa de preço no rodapé. */
export function TemplateLenovo({ data }: LabelTemplateProps) {
  const specs = [
    { icon: LucideCpu, label: data.processador },
    { icon: LucideMemoryStick, label: data.memoriaRam },
    { icon: LucideHardDrive, label: data.armazenamento },
    ...(data.placaVideo ? [{ icon: LucideGamepad2, label: data.placaVideo }] : []),
  ];
  return (
    <div className="w-[280px] overflow-hidden bg-white text-black shadow-md">
      <div
        className="flex items-center justify-between bg-[#E2231A] px-5 py-2.5 text-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 100%)' }}
      >
        <p className="text-xs font-bold tracking-wide">INFO CENTRO</p>
        <p className="text-[10px] font-medium">{data.sistemaOperacional}</p>
      </div>
      <div className="px-5 pb-4 pt-3">
        <h3 className="text-lg font-bold">{data.marcaModelo}</h3>
        <div className="mt-3 space-y-2">
          {specs.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-black/70">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2231A]/10 text-[#E2231A]">
                <Icon size={13} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#E2231A] px-5 py-3">
        <p className="text-[11px] text-white/80">12x de {data.parcelaFormatado}</p>
        <p className="text-xl font-bold text-white">{data.valorFormatado}</p>
      </div>
    </div>
  );
}

/** Gamer RGB: fundo quase preto, borda em degradê neon, tipografia condensada. */
export function TemplateGamerRGB({ data }: LabelTemplateProps) {
  return (
    <div
      className="w-[280px] rounded-xl p-[2px] shadow-lg"
      style={{ background: 'linear-gradient(135deg, #00f2ff, #ff00e6, #7dff00)' }}
    >
      <div className="rounded-[10px] bg-[#0a0a0f] p-5 text-white">
        <p className="font-mono text-[10px] tracking-widest text-cyan-300">[ INFO_CENTRO ]</p>
        <h3 className="mt-2 font-mono text-xl font-bold uppercase tracking-tight text-white">{data.marcaModelo}</h3>
        <div className="mt-4 grid grid-cols-1 gap-1.5 font-mono text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <LucideCpu size={13} className="text-fuchsia-400" /> {data.processador}
          </div>
          <div className="flex items-center gap-2">
            <LucideMemoryStick size={13} className="text-cyan-300" /> {data.memoriaRam}
          </div>
          <div className="flex items-center gap-2">
            <LucideHardDrive size={13} className="text-lime-300" /> {data.armazenamento}
          </div>
          {data.placaVideo && (
            <div className="flex items-center gap-2">
              <LucideGamepad2 size={13} className="text-orange-300" /> {data.placaVideo}
            </div>
          )}
          <div className="flex items-center gap-2">
            <LucideZap size={13} className="text-yellow-300" /> {data.bateria}
          </div>
        </div>
        <div className="mt-5 border-t border-white/10 pt-4 text-right">
          <p
            className="font-mono text-2xl font-black text-lime-300"
            style={{ textShadow: '0 0 12px rgba(125,255,0,0.6)' }}
          >
            {data.valorFormatado}
          </p>
          <p className="font-mono text-[10px] text-white/40">12x de {data.parcelaFormatado}</p>
        </div>
      </div>
    </div>
  );
}
