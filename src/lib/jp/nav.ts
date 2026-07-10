// Itens do menu lateral do painel /jp. Centralizado aqui para que novos
// módulos precisem apenas adicionar uma entrada nesta lista — tanto a
// Sidebar quanto páginas futuras podem reaproveitar essa fonte única.
import type { LucideIcon } from 'lucide-react';
import {
  LucideLayoutDashboard,
  LucideTag,
  LucideMonitor,
  LucideSettings,
} from 'lucide-react';
import { JP_PDV_URL } from './config';

export interface JpNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Link externo (abre em nova aba) em vez de rota interna do Next. */
  external?: boolean;
}

export const JP_NAV_ITEMS: JpNavItem[] = [
  { label: 'Dashboard', href: '/jp/dashboard', icon: LucideLayoutDashboard },
  { label: 'Etiquetas de Vitrine', href: '/jp/etiquetas', icon: LucideTag },
  { label: 'Abrir PDV', href: JP_PDV_URL, icon: LucideMonitor, external: true },
  { label: 'Configurações', href: '/jp/config', icon: LucideSettings },
];
