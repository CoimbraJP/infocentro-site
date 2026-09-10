'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LucideArrowLeft, LucideTrash2, LucideLibrary, LucideBookmarkPlus, LucideSmartphone } from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import {
  NotebookLabel,
  loadSavedLabels,
  removeSavedLabel,
  formatCurrency,
  parseCurrencyInput,
  calculateInstallmentValue,
} from '@/lib/jp/etiquetas';

function formatSavedDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Biblioteca permanente de etiquetas: tudo que o usuário salvou a partir do
// gerador (/jp/etiquetas), independente do rascunho de trabalho de lá — não
// expira sozinho, só some se apagado aqui manualmente.
export default function EtiquetasSalvasApp() {
  const [saved, setSaved] = useState<NotebookLabel[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(loadSavedLabels());
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
  };

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
          aqui expira sozinho — só some se você apagar.
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {saved.map((nb) => {
            const valor = parseCurrencyInput(nb.valorAVista);
            const parcela = calculateInstallmentValue(valor);
            const specs = [nb.processador, nb.memoriaRam, nb.armazenamento, nb.placaVideo].filter(Boolean).join(' · ');
            return (
              <Card key={nb.id} className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0">
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
                <button
                  onClick={() => handleRemove(nb.id, nb.marcaModelo)}
                  aria-label="Apagar esta etiqueta salva"
                  title="Apagar"
                  className="shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <LucideTrash2 size={16} />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
