import type { Metadata } from 'next';
import VitrinePcGamerPicker from '@/components/jp/pc-gamer/VitrinePcGamerPicker';

export const metadata: Metadata = { title: 'Vitrine Digital PC Gamer | Painel Administrativo' };

export default function VitrinePcGamerPage() {
  return <VitrinePcGamerPicker />;
}
