import type { Metadata } from 'next';

// Layout raiz do módulo /jp. Nunca deve ser indexado por buscadores — o
// acesso é só por digitação manual da URL, sem link em nenhuma página
// pública do site.
export const metadata: Metadata = {
  title: 'Painel Administrativo | Info Centro',
  robots: { index: false, follow: false, nocache: true },
};

export default function JpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain min-h-screen bg-black text-white selection:bg-primary selection:text-black print:bg-white print:text-black">
      {children}
    </div>
  );
}
