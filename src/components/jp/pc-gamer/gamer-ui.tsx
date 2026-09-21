import type { CSSProperties, ReactNode } from 'react';

// Kit visual compartilhado do módulo PC Gamer — é o que dá a identidade dos
// moldes (preto + amarelo, cantos chanfrados, pinceladas, ícones de peça) e
// garante que a etiqueta impressa e a Vitrine Digital sejam a mesma
// linguagem, não dois desenhos parecidos.
//
// Tudo aqui é CSS/SVG puro, sem imagem externa: assim o mesmo componente
// renderiza igual na tela, na impressão (PDF) e no PNG exportado pelo
// html-to-image — que não baixa recurso externo nenhum.

/** Amarelo dos moldes enviados pelo usuário (dourado, não o verde-limão do site). */
export const GAMER_YELLOW = '#FFDD00';
export const GAMER_YELLOW_DIM = 'rgba(255, 221, 0, 0.55)';
export const GAMER_BLACK = '#0A0A0A';
export const GAMER_PANEL = '#0E0E0E';

// --- Caixa com cantos chanfrados (o "octógono" dos moldes) ---------------

type CutCorners = 'tl-br' | 'tr-bl' | 'all';

function cutPolygon(cut: number, corners: CutCorners): string {
  if (corners === 'tr-bl') {
    return `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
  }
  if (corners === 'all') {
    return `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, ${cut}px 100%, 0 calc(100% - ${cut}px), 0 ${cut}px)`;
  }
  return `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;
}

interface CutBoxProps {
  children?: ReactNode;
  /** Tamanho do chanfro em px. */
  cut?: number;
  /** Espessura do contorno em px. */
  border?: number;
  corners?: CutCorners;
  borderColor?: string;
  background?: string;
  className?: string;
  style?: CSSProperties;
  /** Classe aplicada na caixa interna (onde o conteúdo vive). */
  innerClassName?: string;
}

/**
 * Contorno chanfrado de verdade: a caixa de fora é o "traço" (preenchida de
 * amarelo) e a de dentro, recuada pela espessura da borda, volta pro preto.
 * É a única forma de ter borda com canto cortado em CSS — border-radius não
 * faz chanfro, e clip-path sozinho corta o conteúdo mas não desenha traço.
 */
export function CutBox({
  children,
  cut = 12,
  border = 2,
  corners = 'tl-br',
  borderColor = GAMER_YELLOW,
  background = GAMER_BLACK,
  className = '',
  style,
  innerClassName = '',
}: CutBoxProps) {
  const clip = cutPolygon(cut, corners);
  return (
    <div style={{ clipPath: clip, background: borderColor, padding: border, ...style }} className={className}>
      <div
        style={{ clipPath: cutPolygon(Math.max(cut - border, 2), corners), background }}
        className={`h-full w-full ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

// --- Pinceladas ----------------------------------------------------------

/**
 * Faixa de tinta com as pontas irregulares, como as barras amarelas dos
 * moldes. O polígono tem muitos vértices de propósito: é o que quebra a
 * silhueta reta e faz parecer pincel em vez de retângulo.
 */
export function BrushSwipe({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: GAMER_YELLOW,
        clipPath:
          'polygon(0% 32%, 9% 8%, 26% 20%, 44% 4%, 63% 17%, 81% 2%, 94% 16%, 100% 38%, 97% 68%, 86% 94%, 68% 79%, 49% 98%, 31% 82%, 13% 96%, 2% 70%)',
        ...style,
      }}
    />
  );
}

/** Risco diagonal fino, usado nos cantos como textura de fundo. */
export function BrushSlash({
  className = '',
  style,
  color = GAMER_YELLOW,
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: color,
        clipPath: 'polygon(0% 14%, 92% 0%, 100% 74%, 8% 100%)',
        ...style,
      }}
    />
  );
}

/**
 * Fundo dos moldes: preto com riscos diagonais amarelos nos cantos e uma
 * malha de pontos (meio-tom) em duas pontas opostas. Fica sempre atrás do
 * conteúdo (absolute + pointer-events-none).
 */
export function GamerBackdrop({ dense = false }: { dense?: boolean }) {
  const dots = 'radial-gradient(rgba(255,221,0,0.35) 1.1px, transparent 1.2px)';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: GAMER_BLACK }}>
      {/* meio-tom no canto superior direito */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '46%',
          height: '22%',
          backgroundImage: dots,
          backgroundSize: '6px 6px',
          opacity: 0.5,
          clipPath: 'polygon(38% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      />
      {/* meio-tom no canto inferior esquerdo */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '44%',
          height: '20%',
          backgroundImage: dots,
          backgroundSize: '6px 6px',
          opacity: 0.4,
          clipPath: 'polygon(0 0, 100% 0, 62% 100%, 0 100%)',
        }}
      />

      {/* riscos diagonais — topo esquerdo */}
      <BrushSlash
        style={{ position: 'absolute', top: '-4%', left: '-14%', width: '46%', height: '10px', transform: 'rotate(-42deg)', opacity: 0.95 }}
      />
      <BrushSlash
        style={{ position: 'absolute', top: '4%', left: '-18%', width: '34%', height: '5px', transform: 'rotate(-42deg)', opacity: 0.6 }}
      />
      {/* riscos diagonais — base direita */}
      <BrushSlash
        style={{ position: 'absolute', bottom: '-3%', right: '-13%', width: '44%', height: '9px', transform: 'rotate(-42deg)', opacity: 0.9 }}
      />
      <BrushSlash
        style={{ position: 'absolute', bottom: '5%', right: '-17%', width: '30%', height: '5px', transform: 'rotate(-42deg)', opacity: 0.55 }}
      />

      {dense && (
        <>
          <BrushSlash
            style={{ position: 'absolute', top: '32%', right: '-20%', width: '28%', height: '4px', transform: 'rotate(-42deg)', opacity: 0.35 }}
          />
          <BrushSlash
            style={{ position: 'absolute', bottom: '34%', left: '-16%', width: '24%', height: '4px', transform: 'rotate(-42deg)', opacity: 0.3 }}
          />
        </>
      )}
    </div>
  );
}

// --- Ícones das peças ----------------------------------------------------
// Desenhados aqui (em vez de usar ícones genéricos) pra bater com os
// pictogramas dos moldes: chip com pinos, pente de memória, SSD escrito,
// disco com prato e placa de vídeo com dois coolers.

interface PartIconProps {
  size?: number;
  className?: string;
}

const svgBase = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IconProcessador({ size = 18, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...svgBase}>
      <rect x="5.5" y="5.5" width="13" height="13" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.6" />
      <path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" />
    </svg>
  );
}

export function IconMemoria({ size = 18, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...svgBase}>
      <path d="M2.5 7.5h19v9h-19z" />
      <path d="M6 10.5v3M9 10.5v3M12 10.5v3M15 10.5v3M18 10.5v3" />
      <path d="M7 16.5v2M17 16.5v2" />
    </svg>
  );
}

export function IconSsd({ size = 18, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...svgBase}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <text
        x="12"
        y="14.6"
        textAnchor="middle"
        fontSize="6.6"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
      >
        SSD
      </text>
    </svg>
  );
}

export function IconHd({ size = 18, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...svgBase}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <circle cx="10.5" cy="12" r="4" />
      <circle cx="10.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <path d="M16.5 15.5h2" />
    </svg>
  );
}

export function IconPlacaVideo({ size = 18, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...svgBase}>
      <rect x="2" y="6" width="20" height="11.5" rx="1.5" />
      <circle cx="8" cy="11.75" r="3.1" />
      <circle cx="16" cy="11.75" r="3.1" />
      <path d="M5 17.5v2.5M19 17.5v2.5" />
    </svg>
  );
}

export function IconControle({ size = 18, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...svgBase}>
      <path d="M7.5 7h9a5 5 0 0 1 4.7 6.7l-1 2.8A2.6 2.6 0 0 1 16.3 17l-1.6-1.6H9.3L7.7 17a2.6 2.6 0 0 1-3.9-.5l-1-2.8A5 5 0 0 1 7.5 7Z" />
      <path d="M8.2 11h2.2M9.3 9.9v2.2" />
      <circle cx="15.4" cy="10.6" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="17.4" cy="12.4" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Ícones das 5 specs, na ordem dos moldes. */
export const SPEC_ICONS = [IconProcessador, IconMemoria, IconSsd, IconHd, IconPlacaVideo];

// --- Assinatura "PC GAMER" ----------------------------------------------

export type WordmarkVariant = 'brush' | 'boxed' | 'crown' | 'clean' | 'crown-solid' | 'tag';

function Crown({ size = 22, className = '' }: PartIconProps) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 32 23" className={className} fill="currentColor">
      <path d="M2 21.2 0 4.6l8.4 5.6L16 0l7.6 10.2L32 4.6l-2 16.6H2Z" />
    </svg>
  );
}

interface WordmarkProps {
  variant?: WordmarkVariant;
  /** Tamanho da fonte em px do "PC GAMER". */
  size?: number;
  className?: string;
}

/**
 * As seis assinaturas "PC GAMER" dos moldes. A inclinação vem de skewX (não
 * de italic da fonte) porque o corte reto das letras é justamente o que dá o
 * ar "esportivo" do material gamer — italic comum arredonda demais.
 */
export function PcGamerWordmark({ variant = 'brush', size = 34, className = '' }: WordmarkProps) {
  const base = 'display-font font-black uppercase leading-none tracking-tight';

  if (variant === 'boxed') {
    return (
      <div className={className}>
        <CutBox cut={size * 0.34} border={2} corners="all" background="transparent">
          <div className="flex items-center justify-center gap-[0.28em] px-[0.55em] py-[0.3em]" style={{ fontSize: size }}>
            <span className={`${base} text-white`}>PC</span>
            <span className={base} style={{ color: GAMER_YELLOW }}>
              GAMER
            </span>
          </div>
        </CutBox>
      </div>
    );
  }

  if (variant === 'tag') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="mb-[0.18em]" style={{ color: GAMER_YELLOW }}>
          <IconControle size={size * 0.62} />
        </div>
        <div className="flex items-baseline gap-[0.26em]" style={{ fontSize: size }}>
          <span className={`${base} text-white`}>PC</span>
          <span className={base} style={{ color: GAMER_YELLOW }}>
            GAMER
          </span>
        </div>
        <div className="mt-[0.22em] h-[3px] w-full" style={{ background: GAMER_YELLOW }} />
      </div>
    );
  }

  if (variant === 'clean') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <div style={{ color: GAMER_YELLOW }}>
          <IconControle size={size * 0.6} />
        </div>
        <div className="mt-[0.12em] flex items-baseline gap-[0.26em]" style={{ fontSize: size }}>
          <span className={`${base} text-white`}>PC</span>
          <span className={base} style={{ color: GAMER_YELLOW }}>
            GAMER
          </span>
        </div>
        <div className="mt-[0.2em] h-[3px] w-full" style={{ background: GAMER_YELLOW }} />
      </div>
    );
  }

  const withCrown = variant === 'crown' || variant === 'crown-solid';
  const allYellow = variant === 'crown-solid';

  return (
    <div className={`relative ${className}`}>
      {withCrown && (
        <div className="mb-[0.1em] flex justify-center" style={{ color: GAMER_YELLOW }}>
          <Crown size={size * 0.72} />
        </div>
      )}
      <div className="relative" style={{ fontSize: size }}>
        {/* pincelada atrás do texto, deslocada de propósito pra parecer tinta */}
        <BrushSwipe
          style={{
            position: 'absolute',
            left: '-4%',
            top: '54%',
            width: '108%',
            height: '0.44em',
            opacity: 0.95,
            transform: 'rotate(-2.2deg)',
          }}
        />
        <div
          className="relative flex items-baseline justify-center gap-[0.22em]"
          style={{ transform: 'skewX(-11deg)' }}
        >
          <span className={base} style={{ color: allYellow ? GAMER_YELLOW : '#FFFFFF' }}>
            PC
          </span>
          <span className={base} style={{ color: allYellow ? '#FFFFFF' : GAMER_YELLOW }}>
            GAMER
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Rodapé de selos -----------------------------------------------------

interface BadgeRowProps {
  size?: number;
  className?: string;
}

/** Os 4 pictogramas do rodapé dos moldes: jogos, desempenho, garantia e qualidade. */
export function GamerBadgeRow({ size = 20, className = '' }: BadgeRowProps) {
  return (
    <div className={`flex items-center justify-between ${className}`} style={{ color: GAMER_YELLOW }}>
      <IconControle size={size} />
      <div className="h-5 w-px" style={{ background: GAMER_YELLOW_DIM }} />
      <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}>
        <path d="M3.5 17a9 9 0 1 1 17 0" />
        <path d="m12 13 4-3.5" />
        <circle cx="12" cy="13.6" r="1.3" fill="currentColor" stroke="none" />
      </svg>
      <div className="h-5 w-px" style={{ background: GAMER_YELLOW_DIM }} />
      <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}>
        <path d="M12 2.6 4.5 5.6v6c0 4.4 3.1 8.3 7.5 9.8 4.4-1.5 7.5-5.4 7.5-9.8v-6L12 2.6Z" />
        <path d="m8.8 11.8 2.3 2.3 4.1-4.4" />
      </svg>
      <div className="h-5 w-px" style={{ background: GAMER_YELLOW_DIM }} />
      <svg width={size} height={size} viewBox="0 0 24 24" {...svgBase}>
        <path d="m12 2.8 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.6l6.5-.9L12 2.8Z" />
      </svg>
    </div>
  );
}
