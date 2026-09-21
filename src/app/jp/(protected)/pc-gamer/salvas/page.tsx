import type { Metadata } from 'next';
import PcGamerSalvasApp from '@/components/jp/pc-gamer/PcGamerSalvasApp';

export const metadata: Metadata = { title: 'Etiquetas PC Gamer Salvas | Painel Administrativo' };

export default function PcGamerSalvasPage() {
  return <PcGamerSalvasApp />;
}
