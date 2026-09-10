import type { Metadata } from 'next';
import EtiquetasSalvasApp from '@/components/jp/etiquetas/EtiquetasSalvasApp';

export const metadata: Metadata = { title: 'Etiquetas Salvas | Painel Administrativo' };

export default function EtiquetasSalvasPage() {
  return <EtiquetasSalvasApp />;
}
