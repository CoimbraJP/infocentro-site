# Design

## Visual Theme

Dark tech: fundo quase-preto (#050505) com grain SVG sutil (opacity 0.035) sobre toda a página, acento amarelo neon e glows. Uma seção "drenchada" no amarelo (#contato) inverte a paleta para o CTA final.

## Color Palette

Tokens em `src/app/globals.css` (CSS vars) mapeados no Tailwind (`tailwind.config.ts`):

| Token | Valor | Uso |
|---|---|---|
| `--color-black` / `black` | `#050505` | fundo global |
| `--color-primary` / `primary` | `#E5FF00` | acento neon: CTAs, kickers, ícones, glow |
| `--color-white` / `white` | `#F8F8F8` | texto |
| `--color-surface` / `surface` | `rgba(17,17,17,0.9)` | cards e navbar rolada |
| `--color-accent1` | `#333333` | reserva |
| Seções alternam | `#000` e `#0a0a0a` | ritmo entre seções |

Texto secundário via opacidade: `white/90` corpo destacado, `white/70` corpo, `white/60` apoio (piso de contraste AA — não usar abaixo disso em texto pequeno).

## Typography

- **Display / headings**: Space Grotesk (`--font-space-grotesk`, classe `.display-font`, aplicada a h1–h6 no CSS global).
- **Corpo**: Inter (`--font-inter`).
- **Logo**: font-mono, "INFO" branco + "Centro" amarelo.
- Escala: hero `text-5xl md:text-7xl`; títulos de seção `text-3xl md:text-5xl`; kickers uppercase `text-sm tracking-widest text-primary`.

## Components

- **FrameSequence** (`src/components/ui/FrameSequence.tsx`): canvas que anima 120 frames WebP por scroll; modos `sticky` (hero, 200vh) e `inline` (card da seção sobre). Frames em `public/frames/{loop,sobre}`; otimização via `scripts/optimize-frames.mjs`.
- **NavBar**: fixa, transparente → surface com blur após 40px de scroll; menu mobile hambúrguer.
- **YouTubeFacade**: thumbnail + play; iframe só no clique.
- **Reveal**: fade-up sutil na entrada da viewport (usar com parcimônia — hoje só nos cards de serviços com stagger e na seção qualidade).
- **Cards**: `bg-surface`, borda `white/5`, `rounded-xl`/`rounded-2xl`, hover com borda `primary/50`.
- **CTAs**: retângulo `rounded` (não pill), bg primary + texto preto, uppercase bold, `glow-neon`.

## Motion

- Scroll é o motor: sequência de frames, texto do hero com parallax (`--scroll-progress`), parallax-drop na imagem da seção sobre (com `animation-timeline: view()` quando suportado).
- Loops de identidade: `animate-neon-pulse` (título hero), `animate-scale-pulse` (CTA final), carrossel infinito de avaliações (40s, pausa no hover).
- **Regra**: todo loop infinito precisa estar coberto no bloco `prefers-reduced-motion` de `globals.css`; conteúdo nunca nasce invisível esperando animação.

## Layout

- Container `max-w-7xl px-6`; seções `py-24`/`py-32`.
- z-index semântico: conteúdo `z-10` → navbar/flutuante `z-50` → grain `z-60`. Não usar valores arbitrários acima disso.
- Âncoras com `scroll-margin-top: 4.5rem` (navbar fixa).
