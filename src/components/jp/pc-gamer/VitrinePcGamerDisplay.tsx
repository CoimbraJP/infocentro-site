'use client';
import { useEffect, useState } from 'react';
import { LucideImageOff } from 'lucide-react';
import { decodeVitrinePcGamerPayload, type VitrinePcGamerPayload } from '@/lib/jp/vitrine-pc-gamer';
import VitrinePcGamerCard, {
  VITRINE_PC_GAMER_WIDTH,
  VITRINE_PC_GAMER_HEIGHT,
} from './VitrinePcGamerCard';

// Tela cheia pensada pra ficar aberta o tempo todo num tablet/celular fixado
// do lado da máquina exposta na loja — sem sidebar, sem botões, sem nada do
// painel. Todo o conteúdo vem do "#" da própria URL, então essa página nunca
// precisa buscar nada de servidor nem depender do armazenamento do aparelho.
//
// O cartão tem tamanho fixo; aqui só calculamos um scale() pra ele preencher
// a tela real, mantendo a exibição ao vivo idêntica, pixel a pixel, à imagem
// baixável gerada no painel.
export default function VitrinePcGamerDisplay() {
  const [payload, setPayload] = useState<VitrinePcGamerPayload | null | undefined>(undefined);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    setPayload(hash ? decodeVitrinePcGamerPayload(hash) : null);

    const recalcScale = () => {
      const next = Math.min(
        window.innerWidth / VITRINE_PC_GAMER_WIDTH,
        window.innerHeight / VITRINE_PC_GAMER_HEIGHT
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
        <p className="text-sm text-white/30">Gere um novo link em Etiquetas PC Gamer → Vitrine Digital.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div style={{ transform: `scale(${scale})` }}>
        <VitrinePcGamerCard payload={payload} />
      </div>
    </div>
  );
}
