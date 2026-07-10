import type { NotebookLabel } from '@/lib/jp/etiquetas';
import { formatCurrency, parseCurrencyInput, calculateInstallmentValue } from '@/lib/jp/etiquetas';
import { notebookToLabelSampleData } from '@/lib/jp/label-templates';
import type { PrintCellSize } from '@/lib/jp/print-layout';
import { LABEL_TEMPLATES } from './templates/registry';
import PrintFitStage from './PrintFitStage';

// Prévia do visual final da etiqueta impressa. Se o usuário já escolheu um
// modelo em /jp/etiquetas/modelos (templateId, vindo do localStorage via
// EtiquetasVitrineApp), renderiza exatamente aquele design com os dados reais
// do formulário. Sem escolha feita, cai no layout padrão simples abaixo. Este
// é o mesmo componente usado tanto na prévia em tela quanto na impressão real
// (botão "Gerar PDF" ativa o modo prévia e chama window.print()).
//
// printCell (vindo de computePrintCellSize, em EtiquetasVitrineApp) define o
// tamanho exato do "slot" da etiqueta na página A4 — é o que garante 6 ou 9
// por página de verdade, encolhendo/aumentando a etiqueta via PrintFitStage
// pra caber certinho, sem depender de zoom da impressora.
interface EtiquetaPreviewCardProps {
  notebook: NotebookLabel;
  templateId?: string | null;
  printCell: PrintCellSize;
}

export default function EtiquetaPreviewCard({ notebook, templateId, printCell }: EtiquetaPreviewCardProps) {
  const selectedTemplate = templateId ? LABEL_TEMPLATES.find((t) => t.id === templateId) : undefined;

  if (selectedTemplate) {
    const TemplateComponent = selectedTemplate.Component;
    return (
      <div className="print:break-inside-avoid">
        <PrintFitStage targetWidth={printCell.width} targetHeight={printCell.height} fontBoost={printCell.fontBoost}>
          <TemplateComponent data={notebookToLabelSampleData(notebook)} />
        </PrintFitStage>
      </div>
    );
  }

  const valor = parseCurrencyInput(notebook.valorAVista);
  const parcela = calculateInstallmentValue(valor);

  const specs = [
    notebook.processador,
    notebook.memoriaRam,
    notebook.armazenamento,
    notebook.sistemaOperacional,
    notebook.tela,
    notebook.bateria && `Bateria ${notebook.bateria}`,
    notebook.placaVideo,
  ].filter(Boolean);

  return (
    <div className="print:break-inside-avoid">
      <PrintFitStage targetWidth={printCell.width} targetHeight={printCell.height} fontBoost={printCell.fontBoost}>
        <div className="flex w-[320px] flex-col justify-between rounded-2xl border border-black/10 bg-white p-6 text-black shadow-xl print:rounded-none print:border-black/20 print:shadow-none">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-black/40">Info Centro</p>
            <h3 className="display-font mt-1 text-xl font-bold leading-tight">
              {notebook.marcaModelo || 'Marca / Modelo não informado'}
            </h3>
            <ul className="mt-3 space-y-1 text-sm text-black/70">
              {specs.length > 0 ? (
                specs.map((spec, i) => <li key={i}>{spec}</li>)
              ) : (
                <li className="text-black/30">Sem especificações preenchidas</li>
              )}
            </ul>
          </div>

          <div className="mt-6 border-t border-black/10 pt-4">
            <p className="text-2xl font-bold text-black">{valor > 0 ? formatCurrency(valor) : 'R$ --'}</p>
            <p className="text-xs text-black/50">à vista</p>
            {valor > 0 && <p className="mt-1 text-sm font-medium text-black/70">ou 12x de {formatCurrency(parcela)}</p>}
          </div>
        </div>
      </PrintFitStage>
    </div>
  );
}
