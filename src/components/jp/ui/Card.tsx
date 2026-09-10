import { forwardRef, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Card base do painel: mesmo padrão visual do site (bg-surface, borda
// white/5, cantos arredondados — ver DESIGN.md). Serve de base para
// ToolCard e para blocos de conteúdo de páginas futuras. Encaminha ref e
// demais props de <div> (style, etc.) — necessário pra ser usado como item
// arrastável do dnd-kit (SortableSavedCard).
const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`bg-surface border border-white/5 rounded-2xl ${className}`} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
