import type { Metadata } from 'next';
import PcGamerModelosShowroom from '@/components/jp/pc-gamer/PcGamerModelosShowroom';

export const metadata: Metadata = { title: 'Modelos PC Gamer | Painel Administrativo' };

export default function PcGamerModelosPage() {
  return <PcGamerModelosShowroom />;
}
