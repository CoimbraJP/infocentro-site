'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LucideX, LucideLogOut } from 'lucide-react';
import { JP_NAV_ITEMS } from '@/lib/jp/nav';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

// Menu lateral do painel. Reaproveitado tanto na versão fixa (desktop)
// quanto no drawer (mobile) para evitar duplicar a lista de navegação.
export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/jp/logout', { method: 'POST' });
    router.push('/jp');
    router.refresh();
  };

  const nav = (
    <>
      <div className="px-6 py-6">
        <span className="font-mono text-lg font-bold tracking-tighter">
          <span className="text-white">INFO</span> <span className="text-primary">Centro</span>
        </span>
        <p className="mt-1 text-xs uppercase tracking-widest text-white/40">Painel Administrativo</p>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Navegação do painel">
        {JP_NAV_ITEMS.map((item) => {
          const active = !item.external && pathname === item.href;
          const Icon = item.icon;
          const linkClass = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`;

          if (item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <Icon size={18} />
                {item.label}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} onClick={onClose} className={linkClass}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 px-3 py-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LucideLogOut size={18} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: fixa e sempre visível */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-r md:border-white/5 md:bg-[#0a0a0a] print:hidden">
        {nav}
      </aside>

      {/* Mobile: drawer sobreposto, aberto via hamburger do PanelHeader */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden print:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/5 bg-[#0a0a0a]">
            <button
              onClick={onClose}
              aria-label="Fechar menu"
              className="absolute right-4 top-6 p-2 text-white/60 hover:text-white"
            >
              <LucideX size={20} />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
