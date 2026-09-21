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
} from '../gamer-ui';
import type { PcGamerTemplateProps, PcGamerSampleData } from '@/lib/jp/pc-gamer-templates';

// Modelos de etiqueta IMPRESSA do módulo PC Gamer — mesma identidade dos
// moldes da Vitrine Digital (preto/amarelo, cantos chanfrados, pinceladas),
// adaptada pro formato quadrado de 340px que a grade de impressão usa.
//
// Todos têm exatamente 340x340: é esse tamanho fixo que o PrintFitStage mede
// pra encaixar a etiqueta no slot da folha A4 (6 ou 9 por página) sem
// depender de zoom da impressora. As cores de fundo só saem no papel por
// causa do print-color-adjust: exact em globals.css.

const LOGO_SRC = '/jp/info-centro-mark.png';

const SPEC_LIST = [
  { key: 'processador', label: 'CPU', Icon: IconProcessador },
  { key: 'memoriaRam', label: 'RAM', Icon: IconMemoria },
  { key: 'ssd', label: 'SSD', Icon: IconSsd },
  { key: 'hd', label: 'HD', Icon: IconHd },
  { key: 'placaVideo', label: 'GPU', Icon: IconPlacaVideo },
] as const;

function specValues(data: PcGamerSampleData): Record<string, string> {
  return {
    processador: data.processador,
    memoriaRam: data.memoriaRam,
    ssd: data.ssd,
    hd: data.hd,
    placaVideo: data.placaVideo,
  };
}

/** Casca comum: 340x340, fundo preto com os riscos e o selo da loja no rodapé. */
function GamerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[340px] w-[340px] overflow-hidden" style={{ background: GAMER_BLACK }}>
      <GamerBackdrop />
      <div className="relative flex h-full w-full flex-col px-[18px] pb-[14px] pt-[16px]">{children}</div>
    </div>
  );
}

/** Assinatura discreta da loja — a etiqueta é de PC Gamer, mas é da Info Centro. */
function SeloLoja({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_SRC} alt="" className="h-[13px] w-[13px] object-contain" />
      <span className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-white/45">Info Centro</span>
    </div>
  );
}

function SpecLinha({
  Icon,
  value,
  size = 15,
}: {
  Icon: (typeof SPEC_LIST)[number]['Icon'];
  value: string;
  size?: number;
}) {
  return (
    <CutBox cut={9} border={1.5} corners="tl-br" background={GAMER_BLACK} className="h-full">
      <div className="flex h-full w-full items-center gap-1.5 px-2">
        <span className="shrink-0" style={{ color: GAMER_YELLOW }}>
          <Icon size={size} />
        </span>
        <span className="min-w-0 text-[8.5px] font-bold leading-tight text-white" style={{ wordBreak: 'break-word' }}>
          {value || '—'}
        </span>
      </div>
    </CutBox>
  );
}

function GradeSpecs({ data, rowHeight = 33 }: { data: PcGamerSampleData; rowHeight?: number }) {
  const values = specValues(data);
  return (
    <div className="grid grid-cols-2 gap-[6px]">
      {SPEC_LIST.map(({ key, Icon }, index) => (
        <div
          key={key}
          style={{ height: rowHeight }}
          className={index === SPEC_LIST.length - 1 ? 'col-span-2' : undefined}
        >
          <SpecLinha Icon={Icon} value={values[key]} />
        </div>
      ))}
    </div>
  );
}

function BarraJogos({ jogos, pincel = true }: { jogos: string; pincel?: boolean }) {
  if (!pincel) {
    return (
      <CutBox cut={9} border={1.5} corners="tl-br" background={GAMER_BLACK} className="h-[30px] w-full">
        <div className="flex h-full w-full items-center gap-1.5 px-2">
          <span className="shrink-0" style={{ color: GAMER_YELLOW }}>
            <IconControle size={15} />
          </span>
          <span className="min-w-0 truncate text-[8.5px] font-bold text-white">{jogos || 'Roda os principais jogos'}</span>
        </div>
      </CutBox>
    );
  }
  return (
    <div className="relative h-[32px] w-full">
      <BrushSwipe style={{ position: 'absolute', inset: 0 }} />
      <div
        className="absolute flex items-center gap-1.5 px-2"
        style={{
          left: 4,
          top: 4,
          right: 26,
          bottom: 4,
          background: GAMER_BLACK,
          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        }}
      >
        <span className="shrink-0" style={{ color: GAMER_YELLOW }}>
          <IconControle size={15} />
        </span>
        <span className="min-w-0 truncate text-[8.5px] font-bold text-white">{jogos || 'Roda os principais jogos'}</span>
      </div>
    </div>
  );
}

function CaixaPreco({ data, compacta = false }: { data: PcGamerSampleData; compacta?: boolean }) {
  return (
    <CutBox cut={12} border={2} corners="tl-br" background={GAMER_BLACK} className="w-full">
      <div className="flex w-full items-end justify-between px-3 py-2">
        <div>
          <p className="text-[6.5px] font-bold uppercase tracking-[0.2em]" style={{ color: GAMER_YELLOW }}>
            À Vista
          </p>
          <p className={`display-font font-black leading-none text-white ${compacta ? 'text-[22px]' : 'text-[26px]'}`}>
            {data.valorFormatado}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[6px] font-bold uppercase tracking-[0.15em] text-white/40">Parcelado</p>
          <p className="text-[9px] font-bold" style={{ color: GAMER_YELLOW }}>
            12x {data.parcelaFormatado}
          </p>
        </div>
      </div>
    </CutBox>
  );
}

function Nome({ nome, size = 'text-[13px]' }: { nome: string; size?: string }) {
  return (
    <h3 className={`display-font font-black uppercase leading-tight text-white ${size}`} style={{ wordBreak: 'break-word' }}>
      {nome}
    </h3>
  );
}

// --- Modelos -------------------------------------------------------------

/** Pincelada: assinatura em tinta, specs em grade e barra de jogos pintada. */
export function TemplateGamerPincelada({ data }: PcGamerTemplateProps) {
  return (
    <GamerShell>
      <div className="flex shrink-0 items-start justify-between">
        <PcGamerWordmark variant="brush" size={25} />
        <span className="mt-0.5 shrink-0" style={{ color: GAMER_YELLOW }}>
          <IconControle size={18} />
        </span>
      </div>
      <div className="mt-2.5 shrink-0">
        <Nome nome={data.nome} />
      </div>
      <div className="mt-2.5 shrink-0">
        <GradeSpecs data={data} />
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <BarraJogos jogos={data.jogos} />
        <CaixaPreco data={data} />
        <SeloLoja className="self-end" />
      </div>
    </GamerShell>
  );
}

/** Placa: assinatura emoldurada, tudo reto, com os selos no rodapé. */
export function TemplateGamerPlaca({ data }: PcGamerTemplateProps) {
  return (
    <GamerShell>
      <div className="flex shrink-0 justify-center">
        <PcGamerWordmark variant="boxed" size={20} />
      </div>
      <div className="mt-2.5 shrink-0 text-center">
        <Nome nome={data.nome} size="text-[12px]" />
      </div>
      <div className="mt-2.5 shrink-0">
        <GradeSpecs data={data} rowHeight={31} />
      </div>
      <div className="mt-auto flex flex-col gap-1.5 pt-2">
        <BarraJogos jogos={data.jogos} pincel={false} />
        <CaixaPreco data={data} compacta />
        <GamerBadgeRow size={13} className="px-3" />
      </div>
    </GamerShell>
  );
}

/** Coroa: a versão mais chamativa, pra máquina de destaque na loja. */
export function TemplateGamerCoroa({ data }: PcGamerTemplateProps) {
  return (
    <GamerShell>
      <div className="flex shrink-0 justify-center">
        <PcGamerWordmark variant="crown" size={26} />
      </div>
      <div className="mt-2.5 shrink-0 text-center">
        <Nome nome={data.nome} />
      </div>
      <div className="mt-2.5 shrink-0">
        <GradeSpecs data={data} />
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <BarraJogos jogos={data.jogos} />
        <CaixaPreco data={data} />
        <SeloLoja className="self-center" />
      </div>
    </GamerShell>
  );
}

/** Controle: assinatura alinhada à esquerda com sublinhado reto. */
export function TemplateGamerControle({ data }: PcGamerTemplateProps) {
  return (
    <GamerShell>
      <PcGamerWordmark variant="clean" size={24} className="shrink-0" />
      <div className="mt-2.5 shrink-0">
        <Nome nome={data.nome} />
      </div>
      <div className="mt-2.5 shrink-0">
        <GradeSpecs data={data} />
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <BarraJogos jogos={data.jogos} />
        <CaixaPreco data={data} />
        <GamerBadgeRow size={13} className="px-3" />
      </div>
    </GamerShell>
  );
}

/** Coroa Cheia: assinatura invertida, toda em amarelo. */
export function TemplateGamerCoroaCheia({ data }: PcGamerTemplateProps) {
  return (
    <GamerShell>
      <div className="flex shrink-0 justify-center">
        <PcGamerWordmark variant="crown-solid" size={26} />
      </div>
      <div className="mt-2.5 shrink-0 text-center">
        <Nome nome={data.nome} />
      </div>
      <div className="mt-2.5 shrink-0">
        <GradeSpecs data={data} />
      </div>
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <BarraJogos jogos={data.jogos} />
        <CaixaPreco data={data} />
        <SeloLoja className="self-end" />
      </div>
    </GamerShell>
  );
}

/** Preço Grande: preço dominante, pra vitrine vista de longe. */
export function TemplateGamerPreco({ data }: PcGamerTemplateProps) {
  const values = specValues(data);
  return (
    <GamerShell>
      <div className="flex shrink-0 items-center justify-between">
        <PcGamerWordmark variant="tag" size={17} />
        <SeloLoja />
      </div>

      <div className="mt-2.5 shrink-0">
        <Nome nome={data.nome} size="text-[12px]" />
      </div>

      {/* Specs numa faixa só, bem compacta — o protagonista aqui é o preço. */}
      <div className="mt-2.5 grid shrink-0 grid-cols-5 gap-[5px]">
        {SPEC_LIST.map(({ key, Icon }) => (
          <CutBox key={key} cut={7} border={1.5} corners="tl-br" background={GAMER_BLACK} className="h-[44px]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 px-1">
              <span style={{ color: GAMER_YELLOW }}>
                <Icon size={13} />
              </span>
              <span className="w-full text-center text-[6.5px] font-bold leading-[1.15] text-white" style={{ wordBreak: 'break-word' }}>
                {values[key] || '—'}
              </span>
            </div>
          </CutBox>
        ))}
      </div>

      <div className="mt-2 shrink-0">
        <BarraJogos jogos={data.jogos} pincel={false} />
      </div>

      <div className="mt-auto pt-2">
        <CutBox cut={14} border={2} corners="tl-br" background={GAMER_YELLOW} className="w-full">
          <div className="flex w-full items-end justify-between px-3 py-2.5">
            <div>
              <p className="text-[6.5px] font-black uppercase tracking-[0.2em] text-black/60">À Vista</p>
              <p className="display-font text-[30px] font-black leading-none text-black">{data.valorFormatado}</p>
            </div>
            <div className="text-right">
              <p className="text-[6px] font-black uppercase tracking-[0.15em] text-black/50">Parcelado</p>
              <p className="text-[9px] font-black text-black">12x {data.parcelaFormatado}</p>
            </div>
          </div>
        </CutBox>
      </div>
    </GamerShell>
  );
}
