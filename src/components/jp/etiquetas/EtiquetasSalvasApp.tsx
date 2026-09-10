'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import {
  LucideArrowLeft,
  LucideLibrary,
  LucideBookmarkPlus,
  LucideSmartphone,
  LucideFileDown,
  LucideEye,
} from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import Button from '@/components/jp/ui/Button';
import EtiquetaPreviewCard from './EtiquetaPreviewCard';
import SortableSavedCard from './SortableSavedCard';
import { NotebookLabel, loadSavedLabels, saveSavedLabels, removeSavedLabel } from '@/lib/jp/etiquetas';
import { getSelectedTemplateId } from '@/lib/jp/label-templates';
import { LabelsPerPage, computePrintCellSize, getLabelsPerPage } from '@/lib/jp/print-layout';

// Biblioteca permanente de etiquetas: tudo que o usuário salvou a partir do
// gerador (/jp/etiquetas), independente do rascunho de trabalho de lá — não
// expira sozinho, só some se apagado aqui manualmente. Também dá pra editar
// (reaproveita o mesmo formulário do gerador, salvando no lugar) e imprimir
// (reaproveita o mesmo card de impressão e o modelo/densidade escolhidos lá).
export default function EtiquetasSalvasApp() {
  const [saved, setSaved] = useState<NotebookLabel[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<LabelsPerPage>(6);

  useEffect(() => {
    const notebooks = loadSavedLabels();
    setSaved(notebooks);
    setSelectedIds(new Set(notebooks.map((nb) => nb.id)));
    setTemplateId(getSelectedTemplateId());
    setPerPage(getLabelsPerPage());
    setHydrated(true);
  }, []);

  const handleRemove = (id: string, marcaModelo: string) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Apagar "${marcaModelo || 'este notebook'}" da biblioteca? Essa ação não pode ser desfeita.`)
    ) {
      return;
    }
    setSaved(removeSavedLabel(id));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    if (editingId === id) setEditingId(null);
  };

  const handleFieldChange = (id: string, patch: Partial<NotebookLabel>) => {
    setSaved((current) => {
      const updated = current.map((nb) => (nb.id === id ? { ...nb, ...patch } : nb));
      saveSavedLabels(updated);
      return updated;
    });
  };

  const handleToggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = saved.length > 0 && selectedIds.size === saved.length;
  const handleToggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(saved.map((nb) => nb.id)));
  };

  const handleGeneratePdf = () => {
    setPreviewMode(true);
    window.setTimeout(() => window.print(), 100);
  };

  // PointerSensor cobre mouse/trackpad; TouchSensor com um pequeno delay
  // evita que arrastar acidentalmente atrapalhe o scroll normal da página no
  // celular (só inicia o drag depois de ~200ms segurando no mesmo lugar).
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSaved((current) => {
      const oldIndex = current.findIndex((nb) => nb.id === active.id);
      const newIndex = current.findIndex((nb) => nb.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return current;
      const reordered = arrayMove(current, oldIndex, newIndex);
      saveSavedLabels(reordered);
      return reordered;
    });
  };

  const selectedNotebooks = useMemo(() => saved.filter((nb) => selectedIds.has(nb.id)), [saved, selectedIds]);
  const printCell = useMemo(() => computePrintCellSize(perPage), [perPage]);
  const gridColsClasses = printCell.cols === 3 ? 'sm:grid-cols-3 print:grid-cols-3' : 'sm:grid-cols-2 print:grid-cols-2';

  if (previewMode) {
    return (
      <div>
        <button
          onClick={() => setPreviewMode(false)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white print:hidden"
        >
          <LucideArrowLeft size={16} /> Voltar pras etiquetas salvas
        </button>
        <div className={`grid grid-cols-1 gap-6 ${gridColsClasses} print:gap-4`}>
          {selectedNotebooks.map((nb) => (
            <EtiquetaPreviewCard key={nb.id} notebook={nb} templateId={templateId} printCell={printCell} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/jp/etiquetas"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
      >
        <LucideArrowLeft size={16} /> Voltar para o gerador
      </Link>

      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-primary">Etiquetas de Vitrine</p>
        <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Etiquetas Salvas</h1>
        <p className="mt-2 max-w-xl text-white/60">
          Notebooks que você guardou na biblioteca a partir do gerador. Diferente do formulário de trabalho, nada
          aqui expira sozinho — só some se você apagar. Edite ou imprima direto por aqui.
        </p>
        <Link
          href="/jp/etiquetas/vitrine-digital"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
        >
          <LucideSmartphone size={15} /> Gerar etiqueta com foto pra tablet/celular
        </Link>
      </div>

      {!hydrated ? null : saved.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <LucideLibrary size={32} className="text-white/20" />
          <p className="text-white/60">Nenhuma etiqueta salva ainda.</p>
          <Link
            href="/jp/etiquetas"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
          >
            <LucideBookmarkPlus size={15} /> Ir pro gerador e salvar uma
          </Link>
        </Card>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleToggleSelectAll}
              className="text-sm font-medium text-white/60 hover:text-white"
            >
              {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
            </button>
            <Button
              onClick={handleGeneratePdf}
              disabled={selectedNotebooks.length === 0}
              className="flex items-center gap-2"
            >
              <LucideFileDown size={18} /> Gerar PDF ({selectedNotebooks.length})
            </Button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={saved.map((nb) => nb.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {saved.map((nb) => (
                  <SortableSavedCard
                    key={nb.id}
                    notebook={nb}
                    isEditing={editingId === nb.id}
                    isSelected={selectedIds.has(nb.id)}
                    onToggleSelected={() => handleToggleSelected(nb.id)}
                    onEdit={() => setEditingId(nb.id)}
                    onFinishEdit={() => setEditingId(null)}
                    onRemove={() => handleRemove(nb.id, nb.marcaModelo)}
                    onChange={(patch) => handleFieldChange(nb.id, patch)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-white/30">
            <LucideEye size={13} /> Segure a alcinha à esquerda de cada etiqueta pra arrastar e reordenar. Modelo e
            etiquetas-por-página usados na impressão são os mesmos escolhidos no gerador.
          </p>
        </>
      )}
    </div>
  );
}
