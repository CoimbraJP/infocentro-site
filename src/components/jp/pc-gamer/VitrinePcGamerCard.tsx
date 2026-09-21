import type { ReactNode } from 'react';
import {
  GAMER_YELLOW,
  GAMER_BLACK,
  CutBox,
  BrushSwipe,
  GamerBackdrop,
  GamerBadgeRow,
  PcGamerWordmark,
  IconControle,
  IconProcessador,
  IconMemoria,
  IconSsd,
  IconHd,
  IconPlacaVideo,
  type WordmarkVariant,
} from './gamer-ui';
import { formatCurrency, parseCurrencyInput, calculateInstallmentValue } from '@/lib/jp/pc-gamer';
import type { VitrinePcGamerPayload } from '@/lib/jp/vitrine-pc-gamer';

// Vitrine Digital PC Gamer: etiqueta em formato de tela de celular, com foto
// da máquina. São 6 modelos, um pra cada molde que o usuário enviou.
//
// Tamanho fixo (não responsivo) de propósito — é o que garante que o PNG
// baixado e a exibição ao vivo num tablet sejam pixel a pixel a mesma coisa,
// gerada uma única vez por este componente.
export const VITRINE_PC_GAMER_WIDTH = 480;
export const VITRINE_PC_GAMER_HEIGHT = 960;

export interface VitrinePcGamerModelo {
  id: string;
  name: string;
  description: string;
}

/** Catálogo dos modelos — alimenta o seletor na tela de Vitrine Digital. */
export const VITRINE_PC_GAMER_MODELOS: VitrinePcGamerModelo[] = [
  { id: 'brush', name: 'Pincelada', description: 'Assinatura riscada a pincel, foto à esquerda e barra de jogos em tinta.' },
  { id: 'boxed', name: 'Placa', description: 'Assinatura dentro de moldura chanfrada, tudo alinhado e com selos no rodapé.' },
  { id: 'crown', name: 'Coroa', description: 'Coroa sobre a assinatura em pincel — a versão mais chamativa.' },
  { id: 'clean', name: 'Controle', description: 'Ícone de controle e sublinhado reto, assinatura alinhada à esquerda.' },
  { id: 'crown-solid', name: 'Coroa Cheia', description: 'Coroa com a assinatura invertida, toda em amarelo.' },
  { id: 'tag', name: 'Foto Grande', description: 'Foto ocupando o topo inteiro e as specs em grade embaixo.' },
];

export const DEFAULT_VITRINE_PC_GAMER_MODELO = 'brush';

const SPECS = [
  { key: 'processador', Icon: IconProcessador },
  { key: 'memoriaRam', Icon: IconMemoria },
  { key: 'ssd', Icon: IconSsd },
  { key: 'hd', Icon: IconHd },
  { key: 'placaVideo', Icon: IconPlacaVideo },
] as const;

interface VitrinePcGamerCardProps {
  payload: VitrinePcGamerPayload;
  modeloId?: string;
}

// --- Peças internas ------------------------------------------------------

function Foto({ src, alt, className = '' }: { src: string | null; alt: string; className?: string }) {
  return (
    <CutBox cut={26} border={2} corners="tl-br" className={className} background={GAMER_BLACK}>
      <div className="flex h-full w-full items-center justify-center p-3">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2" style={{ color: 'rgba(255,221,0,0.35)' }}>
            <IconPlacaVideo size={46} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Sem foto</span>
          </div>
        )}
      </div>
    </CutBox>
  );
}

function SpecPill({
  Icon,
  value,
  compact = false,
}: {
  Icon: (typeof SPECS)[number]['Icon'];
  value: string;
  compact?: boolean;
}) {
  return (
    <CutBox cut={12} border={2} corners="tl-br" className="flex-1" background={GAMER_BLACK}>
      <div className={`flex h-full w-full items-center gap-2.5 ${compact ? 'px-2.5' : 'px-3'}`}>
        <span className="shrink-0" style={{ color: GAMER_YELLOW }}>
          <Icon size={compact ? 20 : 22} />
        </span>
        <span
          className={`min-w-0 font-bold leading-tight text-white ${compact ? 'text-[11px]' : 'text-[12.5px]'}`}
          style={{ wordBreak: 'break-word' }}
        >
          {value || '—'}
        </span>
      </div>
    </CutBox>
  );
}

/** Barra de jogos em tinta: pincelada amarela com um painel preto por cima. */
function BarraJogosPincel({ jogos }: { jogos: string }) {
  return (
    <div className="relative h-[80px] w-full shrink-0">
      <BrushSwipe style={{ position: 'absolute', inset: 0 }} />
      <div
        className="absolute flex items-center gap-3 px-4"
        style={{
          left: 7,
          top: 9,
          right: 52,
          bottom: 9,
          background: GAMER_BLACK,
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        }}
      >
        <span className="shrink-0" style={{ color: GAMER_YELLOW }}>
          <IconControle size={28} />
        </span>
        <span className="min-w-0 text-[12.5px] font-bold leading-tight text-white">
          {jogos || 'Roda os principais jogos atuais'}
        </span>
      </div>
    </div>
  );
}

/** Barra de jogos reta (modelos Placa e Foto Grande). */
function BarraJogosReta({ jogos }: { jogos: string }) {
  return (
    <CutBox cut={14} border={2} corners="tl-br" className="h-[74px] w-full shrink-0" background={GAMER_BLACK}>
      <div className="flex h-full w-full items-center gap-3 px-4">
        <span className="shrink-0" style={{ color: GAMER_YELLOW }}>
          <IconControle size={28} />
        </span>
        <span className="min-w-0 text-[12.5px] font-bold leading-tight text-white">
          {jogos || 'Roda os principais jogos atuais'}
        </span>
      </div>
    </CutBox>
  );
}

function CaixaPreco({ valorFormatado, parcelaFormatado }: { valorFormatado: string; parcelaFormatado: string }) {
  return (
    <CutBox cut={18} border={2} corners="tl-br" className="w-full shrink-0" background={GAMER_BLACK}>
      <div className="flex h-full w-full items-end justify-between px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GAMER_YELLOW }}>
            À Vista
          </p>
          <p className="display-font text-[40px] font-black leading-none text-white">{valorFormatado}</p>
        </div>
        <div className="pb-1 text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">Parcelado</p>
          <p className="text-[13px] font-bold" style={{ color: GAMER_YELLOW }}>
            12x {parcelaFormatado}
          </p>
        </div>
      </div>
    </CutBox>
  );
}

function Moldura({ children }: { children: ReactNode }) {
  return (
    <div
      style={{ width: VITRINE_PC_GAMER_WIDTH, height: VITRINE_PC_GAMER_HEIGHT, background: GAMER_BLACK }}
      className="relative overflow-hidden"
    >
      <GamerBackdrop dense />
      <div className="relative flex h-full w-full flex-col px-6 pb-6 pt-7">{children}</div>
    </div>
  );
}

// --- Componente principal ------------------------------------------------

/** Visual único da Vitrine Digital PC Gamer — usado pra exportar PNG e pra exibir ao vivo. */
export default function VitrinePcGamerCard({ payload, modeloId }: VitrinePcGamerCardProps) {
  const valor = parseCurrencyInput(payload.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  const valorFormatado = valor > 0 ? formatCurrency(valor) : 'R$ --';
  const parcelaFormatado = valor > 0 ? formatCurrency(parcela) : '—';
  const modelo = modeloId ?? payload.modeloId ?? DEFAULT_VITRINE_PC_GAMER_MODELO;

  const specValues: Record<string, string> = {
    processador: payload.processador,
    memoriaRam: payload.memoriaRam,
    ssd: payload.ssd,
    hd: payload.hd,
    placaVideo: payload.placaVideo,
  };

  // Modelo 6: foto grande no topo, specs em grade embaixo.
  if (modelo === 'tag') {
    return (
      <Moldura>
        <PcGamerWordmark variant="tag" size={31} className="mb-5 self-stretch" />

        <Foto src={payload.foto} alt={payload.nome} className="min-h-0 flex-1" />

        <h1 className="display-font mt-4 text-[19px] font-black uppercase leading-tight text-white">
          {payload.nome || 'PC Gamer'}
        </h1>

        <div className="mt-3 grid shrink-0 grid-cols-3 gap-2.5">
          {SPECS.slice(0, 3).map(({ key, Icon }) => (
            <div key={key} className="h-[58px]">
              <SpecPill Icon={Icon} value={specValues[key]} compact />
            </div>
          ))}
        </div>
        <div className="mt-2.5 grid shrink-0 grid-cols-2 gap-2.5">
          {SPECS.slice(3).map(({ key, Icon }) => (
            <div key={key} className="h-[58px]">
              <SpecPill Icon={Icon} value={specValues[key]} compact />
            </div>
          ))}
        </div>

        <div className="mt-3.5">
          <BarraJogosReta jogos={payload.jogos} />
        </div>
        <div className="mt-3">
          <CaixaPreco valorFormatado={valorFormatado} parcelaFormatado={parcelaFormatado} />
        </div>
      </Moldura>
    );
  }

  // Modelos 1 a 5: foto à esquerda, coluna de specs à direita.
  const wordmarkVariant = modelo as WordmarkVariant;
  const comPincel = modelo === 'brush' || modelo === 'crown' || modelo === 'clean' || modelo === 'crown-solid';
  const comSelos = modelo !== 'brush';

  return (
    <Moldura>
      <div className="mb-5 flex shrink-0 items-start justify-between gap-3">
        <PcGamerWordmark
          variant={wordmarkVariant}
          size={modelo === 'boxed' ? 30 : 36}
          className={modelo === 'clean' ? '' : 'flex-1'}
        />
        {modelo === 'brush' && (
          <span className="mt-1 shrink-0" style={{ color: GAMER_YELLOW }}>
            <IconControle size={30} />
          </span>
        )}
      </div>

      <h1 className="display-font mb-3 shrink-0 text-[19px] font-black uppercase leading-tight text-white">
        {payload.nome || 'PC Gamer'}
      </h1>

      <div className="flex min-h-0 flex-1 gap-3.5">
        <Foto src={payload.foto} alt={payload.nome} className="flex-1" />
        <div className="flex w-[178px] shrink-0 flex-col gap-2.5">
          {SPECS.map(({ key, Icon }) => (
            <SpecPill key={key} Icon={Icon} value={specValues[key]} />
          ))}
        </div>
      </div>

      <div className="mt-4">{comPincel ? <BarraJogosPincel jogos={payload.jogos} /> : <BarraJogosReta jogos={payload.jogos} />}</div>

      <div className="mt-3.5">
        <CaixaPreco valorFormatado={valorFormatado} parcelaFormatado={parcelaFormatado} />
      </div>

      {comSelos && <GamerBadgeRow size={21} className="mt-4 shrink-0 px-2" />}
    </Moldura>
  );
}
