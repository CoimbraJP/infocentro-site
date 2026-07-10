import type { Metadata } from 'next';
import PageHeader from '@/components/jp/ui/PageHeader';

export const metadata: Metadata = { title: 'Configurações | Painel Administrativo' };

// Placeholder da página de configurações do painel — presente no menu desde
// já para deixar a navegação completa, sem lógica implementada ainda.
export default function ConfigPage() {
  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Preferências e ajustes do painel administrativo."
      />
      <div className="rounded-2xl border border-dashed border-white/10 bg-surface/40 p-12 text-center text-white/40">
        Em breve.
      </div>
    </div>
  );
}
