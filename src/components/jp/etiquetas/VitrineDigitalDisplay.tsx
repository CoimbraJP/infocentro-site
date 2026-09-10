'use client';
import { useEffect, useState } from 'react';
import { LucideImageOff } from 'lucide-react';
import { decodeVitrinePayload, type VitrineDigitalPayload } from '@/lib/jp/vitrine-digital';
import VitrineDigitalCard, {
  VITRINE_DIGITAL_CARD_WIDTH,
  VITRINE_DIGITAL_CARD_HEIGHT,
} from './VitrineDigitalCard';

// Tela cheia pensada pra ficar aberta o tempo todo num tablet/celular fixado
// do lado do notebook exposto na loja — sem sidebar, sem botões, sem nada do
// painel administrativo. Todo o conteúdo vem do "#" da própria URL (ver
// lib/jp/vitrine-digital.ts), então essa página nunca precisa buscar nada
// de servidor nem depender do armazenamento local do aparelho.
//
// O card em si (VitrineDigitalCard) tem tamanho fixo — aqui só calculamos um
// scale() pra ele preencher a tela real do aparelho, mantendo a exibição ao
// vivo sempre idêntica, pixel a pixel, à imagem baixável gerada no painel.
export default function VitrineDigitalDisplay() {
  const [payload, setPayload] = useState<VitrineDigitalPayload | null | undefined>(undefined);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    setPayload(hash ? decodeVitrinePayload(hash) : null);

    const recalcScale = () => {
      const next = Math.min(
        window.innerWidth / VITRINE_DIGITAL_CARD_WIDTH,
        window.innerHeight / VITRINE_DIGITAL_CARD_HEIGHT
      );
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    recalcScale();
    window.addEventListener('resize', recalcScale);
    return () => window.removeEventListener('resize', recalcScale);
  }, []);

  if (payload === undefined) {
    return <div className="min-h-screen bg-black" />;
  }

  if (payload === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center text-white/60">
        <LucideImageOff size={32} className="text-white/20" />
        <p>Link de exibição inválido ou incompleto.</p>
        <p className="text-sm text-white/30">Gere um novo link em Etiquetas de Vitrine → Vitrine Digital.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div style={{ transform: `scale(${scale})` }}>
        <VitrineDigitalCard payload={payload} />
      </div>
    </div>
  );
}
