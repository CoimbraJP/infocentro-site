import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { LucideArrowRight } from 'lucide-react';
import Card from './Card';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  external?: boolean;
  disabled?: boolean;
}

// Card clicável do dashboard. Três estados: link interno (Next Link), link
// externo (abre em nova aba, ex: PDV) e desabilitado ("Em breve" — sem link).
export default function ToolCard({ title, description, icon: Icon, href, external, disabled }: ToolCardProps) {
  const body = (
    <Card
      className={`group relative flex h-full flex-col gap-4 p-6 transition-all ${
        disabled
          ? 'opacity-50'
          : 'cursor-pointer hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xl'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary">
          <Icon size={24} />
        </span>
        {disabled && (
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/50">
            Em breve
          </span>
        )}
      </div>

      <div>
        <h3 className="display-font text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/60">{description}</p>
      </div>

      {!disabled && (
        <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all group-hover:gap-2 group-hover:opacity-100">
          Abrir <LucideArrowRight size={16} />
        </span>
      )}
    </Card>
  );

  if (disabled || !href) {
    return <div aria-disabled="true">{body}</div>;
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  );
}
