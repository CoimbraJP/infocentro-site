import type { Metadata } from 'next';
import EtiquetasVitrineApp from '@/components/jp/etiquetas/EtiquetasVitrineApp';

export const metadata: Metadata = { title: 'Etiquetas de Vitrine | Painel Administrativo' };

export default function EtiquetasPage() {
  return <EtiquetasVitrineApp />;
}
