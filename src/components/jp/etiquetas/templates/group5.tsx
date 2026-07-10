import {
  LucideCpu,
  LucideMemoryStick,
  LucideHardDrive,
  LucideMonitor,
  LucideCheckCircle2,
  LucideAlertTriangle,
  LucideGamepad2,
} from 'lucide-react';
import type { LabelTemplateProps } from '@/lib/jp/label-templates';

// Grupo 5 — "Modelos do Usuário": ficha técnica quadrada com o logo real da
// Info Centro no cabeçalho (arquivo em /public/jp/info-centro-mark.png,
// enviado pelo usuário), grid de specs com ícone e o rodapé sempre mostrando
// à vista + parcelado (em vez de qualquer texto fixo tipo "acompanha
// carregador", que nem sempre é verdade pra todo notebook da vitrine). Todas
// quadradas, sem borda pontilhada — é uma ficha de verdade, não um tíquete
// de recorte.
//
// O logo é uma imagem com cor própria (dourado/amarelo em degradê), não dá
// pra recolorir via currentColor como um ícone comum. Por isso, nos cards de
// fundo claro ele fica dentro de um chip escuro (senão amarelo em cima de
// branco fica sem contraste); nos cards já escuros (Escura, Bloco) ele fica
// direto no fundo, sem chip.
//
// Placa de vídeo é opcional — só aparece quando preenchida, e sempre no
// MESMO padrão visual dos outros itens de spec do modelo (mesmo ícone+rótulo
// em cima+valor embaixo do Sistema, ou mesma linha da lista, dependendo do
// modelo) — nunca como uma pílula separada. Nos modelos com grid de 2
// colunas (Clássica, Escura, Bloco), Bateria e Placa de Vídeo ficam lado a
// lado na mesma linha, logo abaixo de Armazenamento/Sistema.
const LOGO_SRC = '/jp/info-centro-mark.png';

function batteryInfo(bateria: string) {
  const isGood = !/ruim/i.test(bateria);
  const label = bateria.replace(/^Bateria\s*/i, '').trim() || (isGood ? 'Boa' : 'Ruim');
  return { isGood, label };
}

/** Clássica: chip escuro com o logo, grid 2 colunas com ícones, bateria e placa de vídeo lado a lado, preço dividido no rodapé. */
export function TemplateUsuarioClassico({ data }: LabelTemplateProps) {
  const { isGood, label } = batteryInfo(data.bateria);
  const specs: [typeof LucideCpu, string, string][] = [
    [LucideCpu, 'Processador', data.processador],
    [LucideMemoryStick, 'Memória RAM', data.memoriaRam],
    [LucideHardDrive, 'Armazenamento', data.armazenamento],
    [LucideMonitor, 'Sistema', data.sistemaOperacional],
  ];
  return (
    <div className="flex aspect-square w-[340px] flex-col justify-between rounded-[28px] border border-black/10 bg-white p-6 text-black shadow-md">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="" className="h-7 w-7 object-contain" />
          </span>
          <div>
            <p className="text-sm font-extrabold leading-none text-slate-800">INFO CENTRO</p>
            <p className="mt-1 text-[10px] text-slate-400">Assistência Técnica &amp; Vendas</p>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-snug [text-wrap:pretty]">{data.marcaModelo}</h3>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {specs.map(([Icon, label2, value]) => (
            <div key={label2} className="flex items-start gap-2">
              <Icon size={15} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label2}</p>
                <p className="text-xs font-bold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 items-center gap-x-4">
          <div
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {isGood ? <LucideCheckCircle2 size={14} /> : <LucideAlertTriangle size={14} />}
            BATERIA {label.toUpperCase()}
          </div>
          {data.placaVideo && (
            <div className="flex items-start gap-2">
              <LucideGamepad2 size={15} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Placa de Vídeo</p>
                <p className="text-xs font-bold text-slate-800">{data.placaVideo}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-black/10 pt-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">À Vista</p>
          <p className="text-xl font-black text-slate-900">{data.valorFormatado}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Parcelado</p>
          <p className="text-sm font-bold text-slate-700">12x de {data.parcelaFormatado}</p>
        </div>
      </div>
    </div>
  );
}

/** Escura: mesma estrutura, invertida em fundo escuro — logo direto no fundo, sem chip. */
export function TemplateUsuarioEscuro({ data }: LabelTemplateProps) {
  const { isGood, label } = batteryInfo(data.bateria);
  const specs: [typeof LucideCpu, string, string][] = [
    [LucideCpu, 'Processador', data.processador],
    [LucideMemoryStick, 'Memória RAM', data.memoriaRam],
    [LucideHardDrive, 'Armazenamento', data.armazenamento],
    [LucideMonitor, 'Sistema', data.sistemaOperacional],
  ];
  return (
    <div className="flex aspect-square w-[340px] flex-col justify-between rounded-[28px] border border-white/10 bg-[#0e0e12] p-6 text-white shadow-lg">
      <div>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="" className="h-10 w-10 shrink-0 object-contain" />
          <div>
            <p className="text-sm font-extrabold leading-none text-white">INFO CENTRO</p>
            <p className="mt-1 text-[10px] text-white/40">Assistência Técnica &amp; Vendas</p>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-snug text-white [text-wrap:pretty]">{data.marcaModelo}</h3>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {specs.map(([Icon, label2, value]) => (
            <div key={label2} className="flex items-start gap-2">
              <Icon size={15} className="mt-0.5 shrink-0 text-white/40" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">{label2}</p>
                <p className="text-xs font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 items-center gap-x-4">
          <div
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              isGood ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-300'
            }`}
          >
            {isGood ? <LucideCheckCircle2 size={14} /> : <LucideAlertTriangle size={14} />}
            BATERIA {label.toUpperCase()}
          </div>
          {data.placaVideo && (
            <div className="flex items-start gap-2">
              <LucideGamepad2 size={15} className="mt-0.5 shrink-0 text-white/40" />
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">Placa de Vídeo</p>
                <p className="text-xs font-bold text-white">{data.placaVideo}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-white/10 pt-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">À Vista</p>
          <p className="text-xl font-black text-primary">{data.valorFormatado}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-white/40">Parcelado</p>
          <p className="text-sm font-bold text-white/80">12x de {data.parcelaFormatado}</p>
        </div>
      </div>
    </div>
  );
}

/** Contorno: faixa de acento fina no topo, chip escuro com o logo, specs em lista (placa de vídeo entra como mais uma linha, mesmo padrão), preço no rodapé. */
export function TemplateUsuarioContorno({ data }: LabelTemplateProps) {
  const { isGood, label } = batteryInfo(data.bateria);
  const rows: [string, string][] = [
    ['Processador', data.processador],
    ['Memória RAM', data.memoriaRam],
    ['Armazenamento', data.armazenamento],
    ['Sistema', data.sistemaOperacional],
  ];
  if (data.placaVideo) rows.push(['Placa de Vídeo', data.placaVideo]);
  return (
    <div className="flex aspect-square w-[340px] flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white text-black shadow-md">
      <div className="h-2 w-full bg-primary" />
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="" className="h-5 w-5 object-contain" />
            </span>
            <div>
              <p className="text-xs font-extrabold leading-none text-slate-800">INFO CENTRO</p>
              <p className="mt-0.5 text-[9px] text-slate-400">Assistência Técnica &amp; Vendas</p>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-bold leading-snug [text-wrap:pretty]">{data.marcaModelo}</h3>

          <div className="mt-4 space-y-1.5">
            {rows.map(([lbl, value]) => (
              <div key={lbl} className="flex items-center justify-between border-b border-black/5 pb-1.5 text-xs">
                <span className="text-slate-400">{lbl}</span>
                <span className="font-semibold text-slate-800">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
            <span className={`h-2 w-2 rounded-full ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={isGood ? 'text-emerald-700' : 'text-red-700'}>Bateria {label}</span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-black/10 pt-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">À Vista</p>
            <p className="text-xl font-black text-slate-900">{data.valorFormatado}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Parcelado</p>
            <p className="text-sm font-bold text-slate-700">12x de {data.parcelaFormatado}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Bloco: banner escuro no topo com o logo direto nele (sem chip), corpo branco, bateria e placa de vídeo lado a lado, preço dividido por linha vertical. */
export function TemplateUsuarioBloco({ data }: LabelTemplateProps) {
  const { isGood, label } = batteryInfo(data.bateria);
  const specs: [typeof LucideCpu, string][] = [
    [LucideCpu, data.processador],
    [LucideMemoryStick, data.memoriaRam],
    [LucideHardDrive, data.armazenamento],
    [LucideMonitor, data.sistemaOperacional],
  ];
  return (
    <div className="flex aspect-square w-[340px] flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white text-black shadow-md">
      <div className="flex items-center gap-3 bg-slate-800 px-6 py-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_SRC} alt="" className="h-8 w-8 shrink-0 object-contain" />
        <div>
          <p className="text-sm font-extrabold leading-none text-white">INFO CENTRO</p>
          <p className="mt-1 text-[10px] text-white/50">Assistência Técnica &amp; Vendas</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-6 py-5">
        <div>
          <h3 className="text-lg font-bold leading-snug [text-wrap:pretty]">{data.marcaModelo}</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {specs.map(([Icon, value]) => (
              <div key={value} className="flex items-center gap-2 text-xs text-slate-700">
                <Icon size={14} className="shrink-0 text-slate-400" />
                {value}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 items-center gap-x-4">
            <p className={`text-xs font-bold ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>Bateria {label}</p>
            {data.placaVideo && (
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <LucideGamepad2 size={14} className="shrink-0 text-slate-400" />
                {data.placaVideo}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-stretch justify-between rounded-xl border border-black/10">
          <div className="flex flex-1 flex-col justify-center px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">À Vista</p>
            <p className="text-lg font-black text-slate-900">{data.valorFormatado}</p>
          </div>
          <div className="w-px bg-black/10" />
          <div className="flex flex-1 flex-col justify-center px-4 py-3 text-right">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Parcelado</p>
            <p className="text-sm font-bold text-slate-700">12x de {data.parcelaFormatado}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Minimal: chip escuro pequeno isolado com o logo, muito espaço em branco, specs em uma linha (placa de vídeo entra na mesma linha, mesmo padrão), editorial. */
export function TemplateUsuarioMinimal({ data }: LabelTemplateProps) {
  const { isGood, label } = batteryInfo(data.bateria);
  const specs = [data.processador, data.memoriaRam, data.armazenamento, data.sistemaOperacional, data.placaVideo].filter(
    Boolean
  );
  return (
    <div className="flex aspect-square w-[340px] flex-col justify-between rounded-[28px] border border-black/10 bg-white p-7 text-black shadow-sm">
      <div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_SRC} alt="" className="h-5 w-5 object-contain" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Info Centro</p>
        <h3 className="mt-1 text-xl font-light tracking-tight text-slate-900 [text-wrap:pretty]">{data.marcaModelo}</h3>
        <p className="mt-4 text-xs leading-relaxed text-slate-500 [text-wrap:pretty]">{specs.join(' · ')}</p>
        <p className={`mt-2 text-xs font-semibold ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>Bateria {label}</p>
      </div>

      <div className="flex items-end justify-between border-t border-black/10 pt-4">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">À Vista</p>
          <p className="text-2xl font-semibold text-slate-900">{data.valorFormatado}</p>
        </div>
        <p className="text-xs text-slate-400">12x de {data.parcelaFormatado}</p>
      </div>
    </div>
  );
}
