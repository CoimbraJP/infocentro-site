interface PageHeaderProps {
  title: string;
  description?: string;
}

// Cabeçalho padrão para páginas internas do painel (etiquetas, config e
// futuros módulos). Mantém título e descrição consistentes sem duplicar
// marcação em cada página nova.
export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="display-font text-2xl md:text-3xl font-bold text-white">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-white/60">{description}</p>}
    </div>
  );
}
