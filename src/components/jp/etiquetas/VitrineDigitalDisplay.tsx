'use client';
import { useEffect, useState } from 'react';
import {
  LucideCpu,
  LucideMemoryStick,
  LucideHardDrive,
  LucideMonitor,
  LucideGamepad2,
  LucideCheckCircle2,
  LucideAlertTriangle,
  LucideImageOff,
} from 'lucide-react';
import { decodeVitrinePayload, type VitrineDigitalPayload } from '@/lib/jp/vitrine-digital';
import { formatCurrency, parseCurrencyInput, calculateInstallmentValue } from '@/lib/jp/etiquetas';

const LOGO_SRC = '/jp/info-centro-mark.png';

// Tela cheia pensada pra ficar aberta o tempo todo num tablet/celular fixado
// do lado do notebook exposto na loja — sem sidebar, sem botões, sem nada do
// painel administrativo. Todo o conteúdo vem do "#" da própria URL (ver
// lib/jp/vitrine-digital.ts), então essa página nunca precisa buscar nada
// de servidor nem depender do armazenamento local do aparelho.
export default function VitrineDigitalDisplay() {
  const [payload, setPayload] = useState<VitrineDigitalPayload | null | undefined>(undefined);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    setPayload(hash ? decodeVitrinePayload(hash) : null);
  }, []);

  if (payload === undefined) {
    return <div className="min-h-screen bg-black" />;
  }

  if (payload === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center text-white/60">
        <LucideImageOff size={32} className="text-white/20" />
        <p>Link de exibição inválido ou incompleto.</p>
        <p className="text-sm text-white/30">Gere um novo link em Etiquetas de Vitrine → Vitrine Digital.</p>
      </div>
    );
  }

  const valor = parseCurrencyInput(payload.valorAVista);
  const parcela = calculateInstallmentValue(valor);
  const isGood = !/ruim/i.test(payload.bateria);
  const specs: [typeof LucideCpu, string, string][] = [
    [LucideCpu, 'Processador', payload.processador],
    [LucideMemoryStick, 'Memória RAM', payload.memoriaRam],
    [LucideHardDrive, 'Armazenamento', payload.armazenamento],
    [LucideMonitor, 'Sistema', payload.sistemaOperacional],
  ];
  if (payload.placaVideo) specs.push([LucideGamepad2, 'Placa de Vídeo', payload.placaVideo]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0d] text-white">
      <div className="flex items-center gap-2.5 px-6 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_SRC} alt="" className="h-8 w-8 shrink-0 object-contain" />
        <div>
          <p className="text-sm font-extrabold leading-none">INFO CENTRO</p>
          <p className="mt-0.5 text-[10px] text-white/40">Assistência Técnica &amp; Vendas</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-4">
        {payload.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={payload.foto} alt={payload.marcaModelo} className="max-h-[42vh] w-auto object-contain" />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-white/5 text-white/20">
            <LucideImageOff size={40} />
          </div>
        )}
      </div>

      <div className="px-6">
        <h1 className="display-font text-2xl font-bold leading-snug [text-wrap:pretty]">{payload.marcaModelo}</h1>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
          {specs.map(([Icon, label, value]) => (
            <div key={label} className="flex items-start gap-2">
              <Icon size={18} className="mt-0.5 shrink-0 text-white/40" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-white/40">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {payload.bateria && (
          <div
            className={`mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              isGood ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-300'
            }`}
          >
            {isGood ? <LucideCheckCircle2 size={14} /> : <LucideAlertTriangle size={14} />}
            BATERIA {payload.bateria.toUpperCase()}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-white/10 px-6 py-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">À Vista</p>
          <p className="display-font text-4xl font-black text-primary">{formatCurrency(valor)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Parcelado</p>
          <p className="text-base font-bold text-white/80">12x de {formatCurrency(parcela)}</p>
        </div>
      </div>
    </div>
  );
}
