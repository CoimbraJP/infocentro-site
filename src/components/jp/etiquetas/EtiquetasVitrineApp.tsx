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
} from 'lucide-react';
import Button from '@/components/jp/ui/Button';
import { JP_INPUT_CLASS } from '@/lib/jp/ui';
import NotebookCard from './NotebookCard';
import EtiquetaPreviewCard from './EtiquetaPreviewCard';
import { NotebookLabel, createEmptyNotebook, loadStoredNotebooks, saveStoredNotebooks } from '@/lib/jp/etiquetas';
import { createPresetNotebooks } from '@/lib/jp/preset-notebooks';
import { getSelectedTemplateId } from '@/lib/jp/label-templates';
import {
  LabelsPerPage,
  computePrintCellSize,
  getLabelsPerPage,
  setLabelsPerPage,
} from '@/lib/jp/print-layout';
import { LABEL_TEMPLATES } from './templates/registry';

// Orquestrador do módulo Etiquetas de Vitrine: guarda a lista de notebooks,
// persiste no localStorage (com expiração automática de 30 dias) e liga o
// formulário aos botões do rodapé.
//
// "Gerar PDF" não usa nenhuma lib de PDF: ele muda pro modo prévia (o mesmo
// visual do botão "Visualizar Etiquetas") e chama window.print(). O diálogo
// de impressão do navegador tem a opção "Salvar como PDF" como destino, que é
// exatamente como qualquer app web de verdade gera PDF sem depender de
// canvas/servidor. O CSS de impressão (globals.css + classes print: nos
// componentes do painel) esconde sidebar/header/botões, deixando só a grade
// de etiquetas.
//
// O modelo visual usado na prévia/PDF é o que foi escolhido em
// /jp/etiquetas/modelos (salvo no localStorage) — carregado aqui e repassado
// pra EtiquetaPreviewCard, que é quem sabe renderizar cada template com os
// dados reais do formulário.
//
// "Etiquetas por página" (6 ou 9) controla o tamanho do slot que cada
// etiqueta ocupa na página impressa — ver src/lib/jp/print-layout.ts pro
// cálculo. 6 é o padrão (o usuário só conseguia isso manualmente com 96% de
// zoom nas propriedades da impressora); 9 é mais denso, então a fonte é
// reforçada um pouco (fontBoost) pra continuar legível.
export default function EtiquetasVitrineApp() {
  const [notebooks, setNotebooks] = useState<NotebookLabel[]>([]);
  const [countInput, setCountInput] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [perPage, setPerPage] = useState<LabelsPerPage>(6);

  // Carrega do localStorage na montagem; loadStoredNotebooks já descarta
  // qualquer etiqueta com mais de 30 dias antes de devolver a lista.
  useEffect(() => {
    const stored = loadStoredNotebooks();
    setNotebooks(stored.length > 0 ? stored : [createEmptyNotebook()]);
    setTemplateId(getSelectedTemplateId());
    setPerPage(getLabelsPerPage());
    setHydrated(true);
  }, []);

  // Se o usuário for até /jp/etiquetas/modelos e escolher outro modelo numa
  // outra aba, refletir a mudança assim que esta aba voltar a ficar visível.
  useEffect(() => {
    const handleFocus = () => setTemplateId(getSelectedTemplateId());
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Mantém o campo de quantidade sempre alinhado ao número real de cards.
  useEffect(() => {
    if (notebooks.length > 0) setCountInput(notebooks.length);
  }, [notebooks.length]);

  // Persiste qualquer alteração — só depois da carga inicial, pra não
  // sobrescrever o storage com [] antes do efeito acima rodar.
  useEffect(() => {
    if (!hydrated) return;
    saveStoredNotebooks(notebooks);
  }, [notebooks, hydrated]);

  const handleCreate = () => {
    const targetCount = Math.max(1, countInput);
    setNotebooks((current) => {
      if (targetCount === current.length) return current;
      if (targetCount > current.length) {
        const toAdd = Array.from({ length: targetCount - current.length }, () => createEmptyNotebook());
        return [...current, ...toAdd];
      }
      return current.slice(0, targetCount);
    });
    setPreviewMode(false);
  };

  const handleUpdate = (id: string, patch: Partial<NotebookLabel>) => {
    setNotebooks((current) => current.map((nb) => (nb.id === id ? { ...nb, ...patch } : nb)));
  };

  const handleRemove = (id: string) => {
    setNotebooks((current) => {
      const filtered = current.filter((nb) => nb.id !== id);
      return filtered.length > 0 ? filtered : [createEmptyNotebook()];
    });
  };

  const handleClear = () => {
    if (typeof window !== 'undefined' && !window.confirm('Isso vai apagar todos os formulários preenchidos. Continuar?')) {
      return;
    }
    setNotebooks([createEmptyNotebook()]);
    setPreviewMode(false);
  };

  const handleLoadPresets = () => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Isso vai substituir os formulários atuais pelos 12 modelos que você passou. Continuar?')
    ) {
      return;
    }
    setNotebooks(createPresetNotebooks());
    setPreviewMode(false);
  };

  const handleGeneratePdf = () => {
    setPreviewMode(true);
    // Pequeno atraso pra garantir que a grade de prévia já renderizou antes
    // de abrir o diálogo de impressão do navegador.
    window.setTimeout(() => window.print(), 100);
  };

  const handleSetPerPage = (value: LabelsPerPage) => {
    setPerPage(value);
    setLabelsPerPage(value);
  };

  const currentTemplateName = templateId ? LABEL_TEMPLATES.find((t) => t.id === templateId)?.name : undefined;
  const printCell = useMemo(() => computePrintCellSize(perPage), [perPage]);
  // Classes completas e literais (não interpoladas) — o Tailwind só gera CSS
  // pra classes que aparecem por extenso no código-fonte, então montar
  // "sm:${x}" em runtime não funcionaria.
  const gridColsClasses = printCell.cols === 3 ? 'sm:grid-cols-3 print:grid-cols-3' : 'sm:grid-cols-2 print:grid-cols-2';

  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 print:hidden md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary">Etiquetas de Vitrine</p>
          <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Gerador de Etiquetas</h1>
          <p className="mt-2 max-w-xl text-white/60">
            Crie etiquetas de preço para os notebooks expostos na vitrine. As etiquetas ficam guardadas por 30 dias
            e somem automaticamente depois disso.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <Link
              href="/jp/etiquetas/modelos"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
            >
              <LucideLayoutTemplate size={15} /> Ver modelos de etiqueta
            </Link>
            {hydrated && (
              <p className="text-xs text-white/40">
                Modelo atual: <span className="font-medium text-white/70">{currentTemplateName ?? 'Padrão do sistema'}</span>
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
              <label htmlFor="quantidade" className="mb-2 block text-sm font-medium text-white/70">
                Quantidade de notebooks
              </label>
              <input
                id="quantidade"
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
          <div className={`grid grid-cols-1 gap-6 ${gridColsClasses} print:gap-6`}>
            {notebooks.map((nb) => (
              <EtiquetaPreviewCard key={nb.id} notebook={nb} templateId={templateId} printCell={printCell} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {notebooks.map((nb, index) => (
            <NotebookCard
              key={nb.id}
              index={index}
              notebook={nb}
              onChange={(patch) => handleUpdate(nb.id, patch)}
              onRemove={notebooks.length > 1 ? () => handleRemove(nb.id) : undefined}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-8 print:hidden sm:flex-row sm:flex-wrap">
        <Button variant="outline" onClick={() => setPreviewMode((v) => !v)} className="flex items-center justify-center gap-2">
          <LucideEye size={18} /> {previewMode ? 'Editar Formulários' : 'Visualizar Etiquetas'}
        </Button>
        <Button onClick={handleGeneratePdf} className="flex items-center justify-center gap-2">
          <LucideFileDown size={18} /> Gerar PDF
        </Button>
        <Link
          href="/jp/etiquetas/modelos"
          className="flex items-center justify-center gap-2 rounded px-5 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LucideLayoutTemplate size={18} /> Modelos
        </Link>
        <Button variant="danger" onClick={handleClear} className="flex items-center justify-center gap-2">
          <LucideEraser size={18} /> Limpar Formulários
        </Button>
      </div>

      <p className="mt-3 text-xs text-white/30 print:hidden">
        &quot;Gerar PDF&quot; abre a janela de impressão do navegador — escolha &quot;Salvar como PDF&quot; no destino da impressão.
      </p>
    </div>
  );
}
