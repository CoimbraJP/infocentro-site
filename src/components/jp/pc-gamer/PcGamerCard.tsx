import { LucideTrash2, LucideBookmarkPlus, LucideBookmarkCheck } from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import { JP_INPUT_CLASS } from '@/lib/jp/ui';
import {
  PcGamerLabel,
  formatCurrency,
  parseCurrencyInput,
  calculateInstallmentValue,
  getPcGamerDaysUntilExpiry,
} from '@/lib/jp/pc-gamer';

interface PcGamerCardProps {
  index: number;
  pc: PcGamerLabel;
  onChange: (patch: Partial<PcGamerLabel>) => void;
  /** Ausente quando é o último card restante — sempre sobra pelo menos um. */
  onRemove?: () => void;
  /** Copia este PC pra biblioteca permanente (/jp/pc-gamer/salvas). */
  onSave?: () => void;
  /** true por alguns segundos logo depois de salvar, só pra dar feedback visual. */
  justSaved?: boolean;
  /** Esconde o contador de expiração (na biblioteca salva nada expira). */
  hideExpiry?: boolean;
}

const inputClass = `${JP_INPUT_CLASS} w-full px-3 py-2.5`;
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50';

// Formulário de um PC Gamer. Os 5 campos de peça são os mesmos 5 ícones dos
// moldes (processador, memória, SSD, HD e placa de vídeo); "jogos" é a barra
// larga com ícone de controle. Nenhum campo guarda estado próprio — tudo sobe
// via onChange, mantendo persistência e expiração centralizadas no PcGamerApp.
export default function PcGamerCard({
  index,
  pc,
  onChange,
  onRemove,
  onSave,
  justSaved,
  hideExpiry,
}: PcGamerCardProps) {
  const valor = parseCurrencyInput(pc.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  const diasRestantes = getPcGamerDaysUntilExpiry(pc.createdAt);

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="display-font text-base font-bold text-white">PC Gamer {String(index + 1).padStart(2, '0')}</h3>
        <div className="flex items-center gap-3">
          {!hideExpiry && <span className="text-xs text-white/30">Expira em {diasRestantes}d</span>}
          {onSave && (
            <button
              onClick={onSave}
              aria-label="Salvar este PC na biblioteca"
              title="Salvar na biblioteca de etiquetas"
              className={`rounded-lg p-1.5 transition-colors ${
                justSaved ? 'text-primary' : 'text-white/30 hover:bg-white/5 hover:text-primary'
              }`}
            >
              {justSaved ? <LucideBookmarkCheck size={16} /> : <LucideBookmarkPlus size={16} />}
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label="Remover este PC"
              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LucideTrash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Nome da Máquina</label>
          <input
            className={inputClass}
            placeholder="Ex: PC Gamer Ryzen 5 + RTX 3060"
            value={pc.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Processador</label>
          <input
            className={inputClass}
            placeholder="Ex: AMD Ryzen 5 5600"
            value={pc.processador}
            onChange={(e) => onChange({ processador: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Memória RAM</label>
          <input
            className={inputClass}
            placeholder="Ex: 16GB DDR4 3200MHz"
            value={pc.memoriaRam}
            onChange={(e) => onChange({ memoriaRam: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>SSD</label>
          <input
            className={inputClass}
            placeholder="Ex: SSD NVMe 512GB"
            value={pc.ssd}
            onChange={(e) => onChange({ ssd: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>HD</label>
          <input
            className={inputClass}
            placeholder="Ex: HD 1TB"
            value={pc.hd}
            onChange={(e) => onChange({ hd: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Placa de Vídeo</label>
          <input
            className={inputClass}
            placeholder="Ex: RTX 3060 12GB"
            value={pc.placaVideo}
            onChange={(e) => onChange({ placaVideo: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Jogos que roda</label>
          <input
            className={inputClass}
            placeholder="Ex: Fortnite · GTA V · Valorant · CS2"
            value={pc.jogos}
            onChange={(e) => onChange({ jogos: e.target.value })}
          />
          <p className="mt-1.5 text-[11px] text-white/30">
            Aparece na barra com o ícone de controle, logo acima do preço.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Valor à Vista</label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-black/40">R$</span>
            <input
              className={`${JP_INPUT_CLASS} w-full py-2.5 pl-9 pr-3`}
              inputMode="decimal"
              placeholder="0,00"
              value={pc.valorAVista}
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
