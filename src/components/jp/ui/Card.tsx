interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Card base do painel: mesmo padrão visual do site (bg-surface, borda
// white/5, cantos arredondados — ver DESIGN.md). Serve de base para
// ToolCard e para blocos de conteúdo de páginas futuras.
export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface border border-white/5 rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
