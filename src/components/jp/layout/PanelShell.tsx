'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import PanelHeader from './PanelHeader';

// Casco (shell) das páginas autenticadas do painel: Sidebar + header mobile +
// área de conteúdo. Qualquer página nova dentro de /jp/(protected) recebe
// esse layout automaticamente, sem precisar remontar sidebar/header.
export default function PanelShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="md:pl-64 print:pl-0">
        <PanelHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-6xl px-6 py-10 md:py-12 print:max-w-none print:p-0">{children}</main>
      </div>
    </div>
  );
}
