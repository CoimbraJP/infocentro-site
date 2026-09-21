'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  LucidePlus,
  LucideEye,
  LucideFileDown,
  LucideEraser,
  LucideArrowLeft,
  LucideLayoutTemplate,
  LucideListPlus,
  LucideBookmarkPlus,
  LucideLibrary,
  LucideSmartphone,
} from 'lucide-react';
import Button from '@/components/jp/ui/Button';
import { JP_INPUT_CLASS } from '@/lib/jp/ui';
import PcGamerCard from './PcGamerCard';
import PcGamerPreviewCard from './PcGamerPreviewCard';
import {
  PcGamerLabel,
  createEmptyPcGamer,
  loadStoredPcGamers,
  saveStoredPcGamers,
  addPcGamersToLibrary,
  getPcGamerLabelsPerPage,
  setPcGamerLabelsPerPage,
} from '@/lib/jp/pc-gamer';
import { createPresetPcGamers } from '@/lib/jp/preset-pc-gamer';
import { getSelectedPcGamerTemplateId } from '@/lib/jp/pc-gamer-templates';
import { LabelsPerPage, computePrintCellSize } from '@/lib/jp/print-layout';
import { PC_GAMER_TEMPLATES, DEFAULT_PC_GAMER_TEMPLATE_ID } from './templates/registry';

// Orquestrador do módulo Etiquetas PC Gamer. É o gêmeo do módulo de
// notebooks (mesmas funções: criar em lote, carregar exemplos, salvar na
// biblioteca, visualizar e gerar PDF) com dados e identidade visual próprios
// — chaves de localStorage separadas, então os dois módulos nunca se
// atrapalham.
//
// "Gerar PDF" não usa lib de PDF: muda pro modo prévia e chama
// window.print(), onde o destino "Salvar como PDF" do navegador faz o
// arquivo. O CSS de impressão (globals.css) esconde sidebar/header/botões e
// força as cores de fundo a saírem no papel (print-color-adjust: exact) — sem
// isso, uma etiqueta preta com amarelo sairia quase branca.
export default function PcGamerApp() {
  const [pcs, setPcs] = useState<PcGamerLabel[]>([]);
  const [countInput, setCountInput] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<LabelsPerPage>(6);
  const [justSavedIds, setJustSavedIds] = useState<Set<string>>(new Set());
  const [savedAllFeedback, setSavedAllFeedback] = useState(false);

  useEffect(() => {
    const stored = loadStoredPcGamers();
    setPcs(stored.length > 0 ? stored : [createEmptyPcGamer()]);
    setTemplateId(getSelectedPcGamerTemplateId());
    setPerPage(getPcGamerLabelsPerPage());
    setHydrated(true);
  }, []);

  // Reflete a troca de modelo feita em outra aba assim que esta volta ao foco.
  useEffect(() => {
    const handleFocus = () => setTemplateId(getSelectedPcGamerTemplateId());
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (pcs.length > 0) setCountInput(pcs.length);
  }, [pcs.length]);

  // Só persiste depois da carga inicial, pra não sobrescrever o storage com [].
  useEffect(() => {
    if (!hydrated) return;
    saveStoredPcGamers(pcs);
  }, [pcs, hydrated]);

  const handleCreate = () => {
    const targetCount = Math.max(1, countInput);
    setPcs((current) => {
      if (targetCount === current.length) return current;
      if (targetCount > current.length) {
        const toAdd = Array.from({ length: targetCount - current.length }, () => createEmptyPcGamer());
        return [...current, ...toAdd];
      }
      return current.slice(0, targetCount);
    });
    setPreviewMode(false);
  };

  const handleUpdate = (id: string, patch: Partial<PcGamerLabel>) => {
    setPcs((current) => current.map((pc) => (pc.id === id ? { ...pc, ...patch } : pc)));
  };

  const handleRemove = (id: string) => {
    setPcs((current) => {
      const filtered = current.filter((pc) => pc.id !== id);
      return filtered.length > 0 ? filtered : [createEmptyPcGamer()];
    });
  };

  const handleClear = () => {
    if (typeof window !== 'undefined' && !window.confirm('Isso vai apagar todos os formulários preenchidos. Continuar?')) {
      return;
    }
    setPcs([createEmptyPcGamer()]);
    setPreviewMode(false);
  };

  const handleLoadPresets = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Isso vai substituir os formulários atuais pelas 3 montagens de exemplo. Continuar?')
    ) {
      return;
    }
    setPcs(createPresetPcGamers());
    setPreviewMode(false);
  };

  const flashSaved = (ids: string[]) => {
    setJustSavedIds(new Set(ids));
    window.setTimeout(() => setJustSavedIds(new Set()), 2000);
  };

  const handleSaveOne = (id: string) => {
    const pc = pcs.find((item) => item.id === id);
    if (!pc) return;
    addPcGamersToLibrary([pc]);
    flashSaved([id]);
  };

  const handleSaveAll = () => {
    addPcGamersToLibrary(pcs);
    flashSaved(pcs.map((pc) => pc.id));
    setSavedAllFeedback(true);
    window.setTimeout(() => setSavedAllFeedback(false), 2000);
  };

  const handleGeneratePdf = () => {
    setPreviewMode(true);
    window.setTimeout(() => window.print(), 100);
  };

  const handleSetPerPage = (value: LabelsPerPage) => {
    setPerPage(value);
    setPcGamerLabelsPerPage(value);
  };

  const currentTemplateName =
    PC_GAMER_TEMPLATES.find((t) => t.id === templateId)?.name ??
    PC_GAMER_TEMPLATES.find((t) => t.id === DEFAULT_PC_GAMER_TEMPLATE_ID)?.name;
  const printCell = useMemo(() => computePrintCellSize(perPage), [perPage]);
  // Classes literais: o Tailwind só gera CSS pro que aparece por extenso.
  const gridColsClasses = printCell.cols === 3 ? 'sm:grid-cols-3 print:grid-cols-3' : 'sm:grid-cols-2 print:grid-cols-2';

  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 print:hidden md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary">Etiquetas PC Gamer</p>
          <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Gerador PC Gamer</h1>
          <p className="mt-2 max-w-xl text-white/60">
            Etiquetas das máquinas gamer montadas na loja. Este formulário é um rascunho de trabalho e some sozinho em
            30 dias — clique em <LucideBookmarkPlus size={13} className="-mt-0.5 inline" /> ou em &quot;Salvar
            Todas&quot; pra guardar de vez na biblioteca.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Link
              href="/jp/pc-gamer/modelos"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
            >
              <LucideLayoutTemplate size={15} /> Ver modelos
            </Link>
            <Link
              href="/jp/pc-gamer/salvas"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
            >
              <LucideLibrary size={15} /> Etiquetas salvas
            </Link>
            <Link
              href="/jp/pc-gamer/vitrine-digital"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
            >
              <LucideSmartphone size={15} /> Vitrine digital
            </Link>
            {hydrated && (
              <p className="text-xs text-white/40">
                Modelo atual: <span className="font-medium text-white/70">{currentTemplateName}</span>
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Etiquetas por página:</span>
              <div className="flex overflow-hidden rounded-md border border-white/15">
                {([6, 9] as LabelsPerPage[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSetPerPage(value)}
                    className={`px-2.5 py-1 font-semibold transition-colors ${
                      perPage === value ? 'bg-primary text-black' : 'bg-transparent text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {!previewMode && (
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="quantidade-pc" className="mb-2 block text-sm font-medium text-white/70">
                Quantidade de PCs
              </label>
              <input
                id="quantidade-pc"
                type="number"
                min={1}
                value={countInput}
                onChange={(e) => setCountInput(Math.max(1, Number(e.target.value) || 1))}
                className={`${JP_INPUT_CLASS} w-28 px-3 py-2.5`}
              />
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <LucidePlus size={18} /> Criar
            </Button>
            <Button variant="outline" onClick={handleLoadPresets} className="flex items-center gap-2">
              <LucideListPlus size={18} /> Carregar Exemplos
            </Button>
          </div>
        )}
      </div>

      {previewMode ? (
        <div>
          <button
            onClick={() => setPreviewMode(false)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white print:hidden"
          >
            <LucideArrowLeft size={16} /> Voltar para edição
          </button>
          <div className={`grid grid-cols-1 gap-6 ${gridColsClasses} print:gap-4`}>
            {pcs.map((pc) => (
              <PcGamerPreviewCard key={pc.id} pc={pc} templateId={templateId} printCell={printCell} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {pcs.map((pc, index) => (
            <PcGamerCard
              key={pc.id}
              index={index}
              pc={pc}
              onChange={(patch) => handleUpdate(pc.id, patch)}
              onRemove={pcs.length > 1 ? () => handleRemove(pc.id) : undefined}
              onSave={() => handleSaveOne(pc.id)}
              justSaved={justSavedIds.has(pc.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-8 print:hidden sm:flex-row sm:flex-wrap">
        <Button
          variant="outline"
          onClick={() => setPreviewMode((v) => !v)}
          className="flex items-center justify-center gap-2"
        >
          <LucideEye size={18} /> {previewMode ? 'Editar Formulários' : 'Visualizar Etiquetas'}
        </Button>
        <Button onClick={handleGeneratePdf} className="flex items-center justify-center gap-2">
          <LucideFileDown size={18} /> Gerar PDF
        </Button>
        <Button variant="outline" onClick={handleSaveAll} className="flex items-center justify-center gap-2">
          <LucideBookmarkPlus size={18} /> {savedAllFeedback ? 'Salvo!' : 'Salvar Todas'}
        </Button>
        <Link
          href="/jp/pc-gamer/salvas"
          className="flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LucideLibrary size={18} /> Etiquetas Salvas
        </Link>
        <Link
          href="/jp/pc-gamer/modelos"
          className="flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LucideLayoutTemplate size={18} /> Modelos
        </Link>
        <Button variant="danger" onClick={handleClear} className="flex items-center justify-center gap-2">
          <LucideEraser size={18} /> Limpar Formulários
        </Button>
      </div>

      <p className="mt-3 text-xs text-white/30 print:hidden">
        &quot;Gerar PDF&quot; abre a janela de impressão do navegador — escolha &quot;Salvar como PDF&quot; no destino
        da impressão.
      </p>
    </div>
  );
}
