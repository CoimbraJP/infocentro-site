'use client';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface PrintFitStageProps {
  children: ReactNode;
  targetWidth: number;
  targetHeight: number;
  /** Ex: 1.15 = fonte 15% maior antes de encolher pro slot. 1 = sem reforço. */
  fontBoost?: number;
}

// Mede o tamanho natural (sem nenhum transform) do modelo de etiqueta e
// aplica um transform: scale() só visual pra caber exatamente dentro de
// targetWidth x targetHeight — é isso que garante "6 por página" ou "9 por
// página" de verdade, sem depender do usuário mexer em zoom da impressora.
//
// fontBoost aumenta o font-size do conteúdo ANTES de medir: como a etapa
// final sempre encolhe pra caber no slot (nunca ultrapassa), o efeito
// líquido é texto proporcionalmente maior dentro do mesmo espaço físico,
// sem nunca estourar a margem da página.
export default function PrintFitStage({ children, targetWidth, targetHeight, fontBoost = 1 }: PrintFitStageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const recalc = () => {
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      if (!contentWidth || !contentHeight) return;
      const next = Math.min(targetWidth / contentWidth, targetHeight / contentHeight);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(content);
    return () => observer.disconnect();
  }, [targetWidth, targetHeight, fontBoost]);

  const boostedStyle: CSSProperties = fontBoost !== 1 ? { fontSize: `${fontBoost * 100}%` } : {};

  return (
    <div style={{ width: targetWidth, height: targetHeight }} className="flex items-center justify-center overflow-hidden">
      <div ref={contentRef} style={{ transform: `scale(${scale})`, ...boostedStyle }}>
        {children}
      </div>
    </div>
  );
}
