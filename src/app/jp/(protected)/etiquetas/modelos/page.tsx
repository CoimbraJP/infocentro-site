import type { Metadata } from 'next';
import EtiquetasModelosShowroom from '@/components/jp/etiquetas/EtiquetasModelosShowroom';

export const metadata: Metadata = { title: 'Modelos de Etiqueta | Painel Administrativo' };

export default function EtiquetasModelosPage() {
  return <EtiquetasModelosShowroom />;
}
