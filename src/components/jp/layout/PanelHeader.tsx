'use client';
import { LucideMenu } from 'lucide-react';

interface PanelHeaderProps {
  onMenuClick: () => void;
}

// Barra superior visível só no mobile (no desktop a Sidebar já fica fixa e
// visível, então repetir a marca ali seria redundante).
export default function PanelHeader({ onMenuClick }: PanelHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-surface/80 px-6 py-4 backdrop-blur-md md:hidden print:hidden">
      <span className="font-mono text-base font-bold tracking-tighter">
        <span className="text-white">INFO</span> <span className="text-primary">Centro</span>
      </span>
      <button
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
      >
        <LucideMenu size={22} />
      </button>
    </header>
  );
}
