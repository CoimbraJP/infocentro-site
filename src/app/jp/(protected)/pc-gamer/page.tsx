import type { Metadata } from 'next';
import PcGamerApp from '@/components/jp/pc-gamer/PcGamerApp';

export const metadata: Metadata = { title: 'Etiquetas PC Gamer | Painel Administrativo' };

export default function PcGamerPage() {
  return <PcGamerApp />;
}
