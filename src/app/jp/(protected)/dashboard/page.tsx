import type { Metadata } from 'next';
import { LucideTag, LucideMonitor, LucideBoxes } from 'lucide-react';
import ToolCard from '@/components/jp/ui/ToolCard';
import Reveal from '@/components/ui/Reveal';
import { JP_PDV_URL } from '@/lib/jp/config';

export const metadata: Metadata = { title: 'Dashboard | Painel Administrativo' };

// Lista de ferramentas do dashboard. Para adicionar um novo módulo no
// futuro, basta trocar um dos cards "Em breve" por uma entrada real aqui
// (e criar a página correspondente em /jp/(protected)/<modulo>).
const TOOLS = [
  {
    title: 'Etiquetas de Vitrine',
    description: 'Criar etiquetas profissionais para notebooks.',
    icon: LucideTag,
    href: '/jp/etiquetas',
  },
  {
    title: 'Abrir PDV',
    description: 'Abrir o sistema principal da loja.',
    icon: LucideMonitor,
    href: JP_PDV_URL,
    external: true,
  },
  {
    title: 'Em breve',
    description: 'Novo módulo em desenvolvimento.',
    icon: LucideBoxes,
    disabled: true,
  },
  {
    title: 'Em breve',
    description: 'Novo módulo em desenvolvimento.',
    icon: LucideBoxes,
    disabled: true,
  },
];

export default function JpDashboardPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest text-primary">Painel Administrativo</p>
        <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Info Centro</h1>
        <p className="mt-3 text-white/60">Ferramentas Internas</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {TOOLS.map((tool, index) => (
          <Reveal key={`${tool.title}-${index}`} delay={index * 80}>
            <ToolCard {...tool} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
