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
  LucideDownload,
} from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import Button from '@/components/jp/ui/Button';
import PcGamerPreviewCard from './PcGamerPreviewCard';
import SortablePcGamerCard from './SortablePcGamerCard';
import {
  PcGamerLabel,
  loadSavedPcGamers,
  saveSavedPcGamers,
  removeSavedPcGamer,
  getPcGamerLabelsPerPage,
} from '@/lib/jp/pc-gamer';
import { getSelectedPcGamerTemplateId } from '@/lib/jp/pc-gamer-templates';
import { LabelsPerPage, computePrintCellSize } from '@/lib/jp/print-layout';

// Biblioteca permanente das etiquetas de PC Gamer: tudo que o usuário salvou
// no gerador (/jp/pc-gamer), independente do rascunho de trabalho de lá — não
// expira sozinho, só some se apagado aqui. Dá pra editar no lugar, imprimir
// (mesmo modelo/densidade escolhidos no gerador), reordenar arrastando e
// baixar um backup em JSON.
export default function PcGamerSalvasApp() {
  const [saved, setSaved] = useState<PcGamerLabel[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<LabelsPerPage>(6);

  useEffect(() => {
    const pcs = loadSavedPcGamers();
    setSaved(pcs);
    setSelectedIds(new Set(pcs.map((pc) => pc.id)));
    setTemplateId(getSelectedPcGamerTemplateId());
    setPerPage(getPcGamerLabelsPerPage());
    setHydrated(true);
  }, []);

  const handleRemove = (id: string, nome: string) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Apagar "${nome || 'este PC'}" da biblioteca? Essa ação não pode ser desfeita.`)
    ) {
      return;
    }
    setSaved(removeSavedPcGamer(id));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    if (editingId === id) setEditingId(null);
  };

  const handleFieldChange = (id: string, patch: Partial<PcGamerLabel>) => {
    setSaved((current) => {
      const updated = current.map((pc) => (pc.id === id ? { ...pc, ...patch } : pc));
      saveSavedPcGamers(updated);
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
    setSelectedIds(allSelected ? new Set() : new Set(saved.map((pc) => pc.id)));
  };

  const handleGeneratePdf = () => {
    setPreviewMode(true);
    window.setTimeout(() => window.print(), 100);
  };

  // Backup em JSON de tudo que está salvo NESTE navegador — é a única forma
  // de tirar os dados daqui pra fora, já que ficam só no localStorage.
  const handleExportBackup = () => {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pc-gamer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // PointerSensor cobre mouse/trackpad; TouchSensor com um pequeno delay evita
  // que arrastar sem querer atrapalhe o scroll normal no celular.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSaved((current) => {
      const oldIndex = current.findIndex((pc) => pc.id === active.id);
      const newIndex = current.findIndex((pc) => pc.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return current;
      const reordered = arrayMove(current, oldIndex, newIndex);
      saveSavedPcGamers(reordered);
      return reordered;
    });
  };

  const selectedPcs = useMemo(() => saved.filter((pc) => selectedIds.has(pc.id)), [saved, selectedIds]);
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
          {selectedPcs.map((pc) => (
            <PcGamerPreviewCard key={pc.id} pc={pc} templateId={templateId} printCell={printCell} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/jp/pc-gamer"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
      >
        <LucideArrowLeft size={16} /> Voltar para o gerador
      </Link>

      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest text-primary">Etiquetas PC Gamer</p>
        <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Etiquetas Salvas</h1>
        <p className="mt-2 max-w-xl text-white/60">
          Máquinas que você guardou na biblioteca a partir do gerador. Diferente do formulário de trabalho, nada aqui
          expira sozinho — só some se você apagar. Edite ou imprima direto por aqui.
        </p>
        <Link
          href="/jp/pc-gamer/vitrine-digital"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
        >
          <LucideSmartphone size={15} /> Gerar etiqueta com foto pra celular/tablet
        </Link>
      </div>

      {!hydrated ? null : saved.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <LucideLibrary size={32} className="text-white/20" />
          <p className="text-white/60">Nenhuma etiqueta de PC Gamer salva ainda.</p>
          <Link
            href="/jp/pc-gamer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
          >
            <LucideBookmarkPlus size={15} /> Ir pro gerador e salvar uma
          </Link>
        </Card>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button onClick={handleToggleSelectAll} className="text-sm font-medium text-white/60 hover:text-white">
              {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={handleExportBackup} className="flex items-center gap-2">
                <LucideDownload size={18} /> Baixar backup (JSON)
              </Button>
              <Button onClick={handleGeneratePdf} disabled={selectedPcs.length === 0} className="flex items-center gap-2">
                <LucideFileDown size={18} /> Gerar PDF ({selectedPcs.length})
              </Button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={saved.map((pc) => pc.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {saved.map((pc) => (
                  <SortablePcGamerCard
                    key={pc.id}
                    pc={pc}
                    isEditing={editingId === pc.id}
                    isSelected={selectedIds.has(pc.id)}
                    onToggleSelected={() => handleToggleSelected(pc.id)}
                    onEdit={() => setEditingId(pc.id)}
                    onFinishEdit={() => setEditingId(null)}
                    onRemove={() => handleRemove(pc.id, pc.nome)}
                    onChange={(patch) => handleFieldChange(pc.id, patch)}
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
