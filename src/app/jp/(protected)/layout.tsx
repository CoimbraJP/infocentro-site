import PanelShell from '@/components/jp/layout/PanelShell';

// Grupo de rotas (protected): tudo aqui dentro passa pelo middleware de
// autenticação e recebe o shell padrão (sidebar + header). O nome do grupo
// entre parênteses não aparece na URL — dashboard continua em /jp/dashboard.
export default function JpProtectedLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell>{children}</PanelShell>;
}
