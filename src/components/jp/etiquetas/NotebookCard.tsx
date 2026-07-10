import { LucideTrash2 } from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import { JP_INPUT_CLASS } from '@/lib/jp/ui';
import {
  NotebookLabel,
  SISTEMA_OPERACIONAL_OPTIONS,
  TELA_OPTIONS,
  BATERIA_OPTIONS,
  formatCurrency,
  parseCurrencyInput,
  calculateInstallmentValue,
  getDaysUntilExpiry,
} from '@/lib/jp/etiquetas';

interface NotebookCardProps {
  index: number;
  notebook: NotebookLabel;
  onChange: (patch: Partial<NotebookLabel>) => void;
  /** Ausente quando é o último card restante — sempre sobra pelo menos um. */
  onRemove?: () => void;
}

const inputClass = `${JP_INPUT_CLASS} w-full px-3 py-2.5`;
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50';

// Formulário de um notebook. Cada campo é controlado pelo estado do
// EtiquetasVitrineApp (via onChange) — este componente não guarda estado
// próprio, o que mantém a persistência/expiração centralizada num só lugar.
export default function NotebookCard({ index, notebook, onChange, onRemove }: NotebookCardProps) {
  const valor = parseCurrencyInput(notebook.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  const diasRestantes = getDaysUntilExpiry(notebook.createdAt);

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="display-font text-base font-bold text-white">
          Notebook {String(index + 1).padStart(2, '0')}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30">Expira em {diasRestantes}d</span>
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label="Remover este notebook"
              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LucideTrash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Marca / Modelo</label>
          <input
            className={inputClass}
            placeholder="Ex: Dell Inspiron 15"
            value={notebook.marcaModelo}
            onChange={(e) => onChange({ marcaModelo: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Processador</label>
          <input
            className={inputClass}
            placeholder="Ex: Intel Core i5 11ª geração"
            value={notebook.processador}
            onChange={(e) => onChange({ processador: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Memória RAM</label>
          <input
            className={inputClass}
            placeholder="Ex: 8GB DDR4"
            value={notebook.memoriaRam}
            onChange={(e) => onChange({ memoriaRam: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Disco (HD/SSD)</label>
          <input
            className={inputClass}
            placeholder="Ex: SSD 256GB"
            value={notebook.armazenamento}
            onChange={(e) => onChange({ armazenamento: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Placa de Vídeo (opcional)</label>
          <input
            className={inputClass}
            placeholder="Ex: GTX 1650"
            value={notebook.placaVideo}
            onChange={(e) => onChange({ placaVideo: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Sistema Operacional</label>
          <select
            className={inputClass}
            value={notebook.sistemaOperacional}
            onChange={(e) => onChange({ sistemaOperacional: e.target.value })}
          >
            {SISTEMA_OPERACIONAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Tela</label>
          <select
            className={inputClass}
            value={notebook.tela}
            onChange={(e) => onChange({ tela: e.target.value })}
          >
            {TELA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Bateria</label>
          <div className="flex gap-2">
            {BATERIA_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ bateria: option })}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  notebook.bateria === option
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Valor à Vista</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/40">
              R$
            </span>
            <input
              className={`${JP_INPUT_CLASS} w-full pl-9 pr-3 py-2.5`}
              inputMode="decimal"
              placeholder="0,00"
              value={notebook.valorAVista}
              onChange={(e) => onChange({ valorAVista: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Cálculo automático: atualiza a cada tecla digitada no valor à vista. */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        {valor > 0 ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">À vista</p>
              <p className="display-font text-lg font-bold text-primary">{formatCurrency(valor)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-white/50">12x com juros (15%)</p>
              <p className="text-sm font-semibold text-white">{formatCurrency(parcela)}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-white/40">Preencha o valor à vista para calcular o parcelamento.</p>
        )}
      </div>
    </Card>
  );
}
