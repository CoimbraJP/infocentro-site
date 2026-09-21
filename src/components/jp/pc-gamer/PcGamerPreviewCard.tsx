import type { PcGamerLabel } from '@/lib/jp/pc-gamer';
import { pcGamerToSampleData } from '@/lib/jp/pc-gamer-templates';
import type { PrintCellSize } from '@/lib/jp/print-layout';
import PrintFitStage from '@/components/jp/etiquetas/PrintFitStage';
import { PC_GAMER_TEMPLATES, DEFAULT_PC_GAMER_TEMPLATE_ID } from './templates/registry';

// Prévia do visual final da etiqueta impressa de PC Gamer. Mesma mecânica do
// módulo de notebooks: o PrintFitStage (reaproveitado de lá, é genérico) mede
// o tamanho natural do modelo e aplica um scale pra encaixar exatamente no
// slot da folha A4 — é o que garante 6 ou 9 por página sem depender de zoom
// da impressora.
//
// Diferente do módulo de notebooks, aqui não existe "layout padrão simples":
// se nenhum modelo foi escolhido, cai no primeiro modelo gamer. Um módulo com
// identidade visual própria não faz sentido cair num fallback sem ela.
interface PcGamerPreviewCardProps {
  pc: PcGamerLabel;
  templateId?: string | null;
  printCell: PrintCellSize;
}

export default function PcGamerPreviewCard({ pc, templateId, printCell }: PcGamerPreviewCardProps) {
  const template =
    PC_GAMER_TEMPLATES.find((t) => t.id === templateId) ??
    PC_GAMER_TEMPLATES.find((t) => t.id === DEFAULT_PC_GAMER_TEMPLATE_ID) ??
    PC_GAMER_TEMPLATES[0];

  const TemplateComponent = template.Component;

  return (
    <div className="print:break-inside-avoid">
      <PrintFitStage targetWidth={printCell.width} targetHeight={printCell.height} fontBoost={printCell.fontBoost}>
        <TemplateComponent data={pcGamerToSampleData(pc)} />
      </PrintFitStage>
    </div>
  );
}
