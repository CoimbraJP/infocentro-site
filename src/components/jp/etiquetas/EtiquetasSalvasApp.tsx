'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LucideArrowLeft,
  LucideTrash2,
  LucideLibrary,
  LucideBookmarkPlus,
  LucideSmartphone,
  LucidePencil,
  LucideCheck,
  LucideFileDown,
  LucideEye,
} from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import Button from '@/components/jp/ui/Button';
import NotebookCard from './NotebookCard';
import EtiquetaPreviewCard from './EtiquetaPreviewCard';
import {
  NotebookLabel,
  loadSavedLabels,
  saveSavedLabels,
  removeSavedLabel,
  formatCurrency,
  parseCurrencyInput,
  calculateInstallmentValue,
} from '@/lib/jp/etiquetas';
import { getSelectedTemplateId } from '@/lib/jp/label-templates';
import { LabelsPerPage, computePrintCellSize, getLabelsPerPage } from '@/lib/jp/print-layout';

function formatSavedDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {saved.map((nb) => {
              if (editingId === nb.id) {
                return (
                  <div key={nb.id} className="flex flex-col gap-3">
                    <NotebookCard
                      index={0}
                      notebook={nb}
                      onChange={(patch) => handleFieldChange(nb.id, patch)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="flex items-center justify-center gap-2 self-start"
                    >
                      <LucideCheck size={16} /> Concluir edição
                    </Button>
                  </div>
                );
              }

              const valor = parseCurrencyInput(nb.valorAVista);
              const parcela = calculateInstallmentValue(valor);
              const specs = [nb.processador, nb.memoriaRam, nb.armazenamento, nb.placaVideo]
                .filter(Boolean)
                .join(' · ');
              return (
                <Card key={nb.id} className="flex items-start gap-3 p-5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(nb.id)}
                    onChange={() => handleToggleSelected(nb.id)}
                    aria-label="Selecionar pra impressão"
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="display-font truncate text-base font-bold text-white">
                      {nb.marcaModelo || 'Sem nome'}
                    </h3>
                    {specs && <p className="mt-1 text-sm text-white/50">{specs}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                      {nb.sistemaOperacional && <span>{nb.sistemaOperacional}</span>}
                      {nb.bateria && (
                        <span
                          className={nb.bateria === 'Boa' ? 'font-medium text-emerald-400' : 'font-medium text-red-400'}
                        >
                          Bateria {nb.bateria}
                        </span>
                      )}
                      <span>Salvo em {formatSavedDate(nb.createdAt)}</span>
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
                      onClick={() => setEditingId(nb.id)}
                      aria-label="Editar esta etiqueta"
                      title="Editar"
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-primary"
                    >
                      <LucidePencil size={16} />
                    </button>
                    <button
                      onClick={() => handleRemove(nb.id, nb.marcaModelo)}
                      aria-label="Apagar esta etiqueta salva"
                      title="Apagar"
                      className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <LucideTrash2 size={16} />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-white/30">
            <LucideEye size={13} /> Modelo e etiquetas-por-página usados na impressão são os mesmos escolhidos no
            gerador.
          </p>
        </>
      )}
    </div>
  );
}
