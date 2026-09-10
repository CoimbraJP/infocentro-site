import type { Metadata } from 'next';
import VitrineDigitalPicker from '@/components/jp/etiquetas/VitrineDigitalPicker';

export const metadata: Metadata = { title: 'Vitrine Digital | Painel Administrativo' };

export default function VitrineDigitalPage() {
  return <VitrineDigitalPicker />;
}
