import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LucideGripVertical, LucidePencil, LucideTrash2, LucideCheck } from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import Button from '@/components/jp/ui/Button';
import NotebookCard from './NotebookCard';
import {
  NotebookLabel,
  formatCurrency,
  parseCurrencyInput,
  calculateInstallmentValue,
} from '@/lib/jp/etiquetas';

function formatSavedDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface SortableSavedCardProps {
  notebook: NotebookLabel;
  isEditing: boolean;
  isSelected: boolean;
  onToggleSelected: () => void;
  onEdit: () => void;
  onFinishEdit: () => void;
  onRemove: () => void;
  onChange: (patch: Partial<NotebookLabel>) => void;
}

// Card arrastável da página /jp/etiquetas/salvas — a alcinha (LucideGripVertical)
// é a única parte "pegável" pro drag, pra não atrapalhar cliques nos botões,
// checkbox ou nos campos do formulário quando em edição.
export default function SortableSavedCard({
  notebook,
  isEditing,
  isSelected,
  onToggleSelected,
  onEdit,
  onFinishEdit,
  onRemove,
  onChange,
}: SortableSavedCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: notebook.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="flex flex-col gap-3">
        <NotebookCard index={0} notebook={notebook} onChange={onChange} />
        <Button variant="outline" onClick={onFinishEdit} className="flex items-center justify-center gap-2 self-start">
          <LucideCheck size={16} /> Concluir edição
        </Button>
      </div>
    );
  }

  const valor = parseCurrencyInput(notebook.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  const specs = [notebook.processador, notebook.memoriaRam, notebook.armazenamento, notebook.placaVideo]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card ref={setNodeRef} style={style} className="flex items-start gap-2 p-5">
      <button
        {...attributes}
        {...listeners}
        aria-label="Arrastar pra reordenar"
        title="Arrastar pra reordenar"
        className="mt-1 shrink-0 cursor-grab touch-none rounded-lg p-1 text-white/20 transition-colors hover:bg-white/5 hover:text-white/50 active:cursor-grabbing"
      >
        <LucideGripVertical size={16} />
      </button>

      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelected}
        aria-label="Selecionar pra impressão"
        className="mt-1 h-4 w-4 shrink-0 accent-primary"
      />

      <div className="min-w-0 flex-1">
        <h3 className="display-font truncate text-base font-bold text-white">{notebook.marcaModelo || 'Sem nome'}</h3>
        {specs && <p className="mt-1 text-sm text-white/50">{specs}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
          {notebook.sistemaOperacional && <span>{notebook.sistemaOperacional}</span>}
          {notebook.bateria && (
            <span className={notebook.bateria === 'Boa' ? 'font-medium text-emerald-400' : 'font-medium text-red-400'}>
              Bateria {notebook.bateria}
            </span>
          )}
          <span>Salvo em {formatSavedDate(notebook.createdAt)}</span>
        </div>
        {valor > 0 && (
          <div className="mt-3 flex items-center gap-4">
            <p className="display-font text-lg font-bold text-primary">{formatCurrency(valor)}</p>
            <p className="text-xs text-white/40">12x de {formatCurrency(parcela)}</p>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <button
          onClick={onEdit}
          aria-label="Editar esta etiqueta"
          title="Editar"
          className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-primary"
        >
          <LucidePencil size={16} />
        </button>
        <button
          onClick={onRemove}
          aria-label="Apagar esta etiqueta salva"
          title="Apagar"
          className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LucideTrash2 size={16} />
        </button>
      </div>
    </Card>
  );
}
