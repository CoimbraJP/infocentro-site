'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import {
  LucideArrowLeft,
  LucideImagePlus,
  LucideLink,
  LucideCheck,
  LucideLibrary,
  LucideSmartphone,
  LucideLoader2,
  LucideDownload,
  LucideDownloadCloud,
  LucideCheckCircle2,
} from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import Button from '@/components/jp/ui/Button';
import { PcGamerLabel, loadSavedPcGamers, formatCurrency, parseCurrencyInput } from '@/lib/jp/pc-gamer';
import { getFotoPcGamer, setFotoPcGamer, compressImageFile } from '@/lib/jp/fotos-pc-gamer';
import {
  buildVitrinePcGamerUrl,
  getVitrinePcGamerModelo,
  setVitrinePcGamerModelo,
  type VitrinePcGamerPayload,
} from '@/lib/jp/vitrine-pc-gamer';
import VitrinePcGamerCard, {
  VITRINE_PC_GAMER_MODELOS,
  DEFAULT_VITRINE_PC_GAMER_MODELO,
  VITRINE_PC_GAMER_WIDTH,
  VITRINE_PC_GAMER_HEIGHT,
} from './VitrinePcGamerCard';

// Remove acentos (marcas diacríticas combinantes, U+0300-U+036F) depois de
// decompor o texto via NFD, pra virar um nome de arquivo seguro.
const DIACRITICS_REGEX = /[̀-ͯ]/g;

/** Redução das miniaturas do seletor de modelo (480x960 -> 105x210). */
const THUMB_SCALE = 210 / VITRINE_PC_GAMER_HEIGHT;

function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(DIACRITICS_REGEX, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'pc-gamer'
  );
}

function toPayload(pc: PcGamerLabel, foto: string | null, modeloId: string): VitrinePcGamerPayload {
  return {
    nome: pc.nome,
    processador: pc.processador,
    memoriaRam: pc.memoriaRam,
    ssd: pc.ssd,
    hd: pc.hd,
    placaVideo: pc.placaVideo,
    jogos: pc.jogos,
    valorAVista: pc.valorAVista,
    foto,
    modeloId,
  };
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Gera a Vitrine Digital PC Gamer (etiqueta em formato de tela de celular,
// com foto) a partir das máquinas já salvas. A foto fica anexada por nome de
// máquina, então anexa uma vez e qualquer etiqueta com esse mesmo nome já
// aproveita.
//
// A entrega principal é a IMAGEM (PNG) pra baixar e mandar direto pro cliente
// por WhatsApp — "Gerar Todos" baixa todas de uma vez num .zip. O link de
// exibição é o extra, pra deixar rodando ao vivo num tablet na loja.
export default function VitrinePcGamerPicker() {
  const [saved, setSaved] = useState<PcGamerLabel[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [modeloId, setModeloId] = useState(DEFAULT_VITRINE_PC_GAMER_MODELO);
  const [error, setError] = useState('');

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const pcs = loadSavedPcGamers();
    setSaved(pcs);
    const photoMap: Record<string, string> = {};
    pcs.forEach((pc) => {
      const foto = getFotoPcGamer(pc.nome);
      if (foto) photoMap[pc.id] = foto;
    });
    setPhotos(photoMap);
    setModeloId(getVitrinePcGamerModelo() ?? DEFAULT_VITRINE_PC_GAMER_MODELO);
    setHydrated(true);
  }, []);

  const handleSelectModelo = (id: string) => {
    setModeloId(id);
    setVitrinePcGamerModelo(id);
    setLinks({});
  };

  const handleUpload = async (pc: PcGamerLabel, file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploadingId(pc.id);
    try {
      const compressed = await compressImageFile(file);
      setFotoPcGamer(pc.nome, compressed);
      setPhotos((current) => ({ ...current, [pc.id]: compressed }));
      setLinks((current) => {
        const next = { ...current };
        delete next[pc.id];
        return next;
      });
    } catch {
      setError('Não foi possível processar essa imagem. Tente outro arquivo.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleGenerateLink = (pc: PcGamerLabel) => {
    const url = buildVitrinePcGamerUrl(toPayload(pc, photos[pc.id] ?? null, modeloId));
    setLinks((current) => ({ ...current, [pc.id]: url }));
  };

  const handleCopyLink = async (id: string) => {
    const url = links[id];
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError('Não foi possível copiar automaticamente — selecione e copie o link manualmente.');
    }
  };

  const handleDownloadOne = async (pc: PcGamerLabel) => {
    const node = cardRefs.current.get(pc.id);
    if (!node) return;
    setError('');
    setDownloadingId(pc.id);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      triggerDownload(dataUrl, `pc-gamer-${slugify(pc.nome)}.png`);
    } catch {
      setError('Não foi possível gerar a imagem dessa etiqueta.');
    } finally {
      setDownloadingId(null);
    }
  };

  const withPhoto = saved.filter((pc) => photos[pc.id]);

  const handleGenerateAll = async () => {
    if (withPhoto.length === 0) return;
    setError('');
    setGeneratingAll(true);
    try {
      const zip = new JSZip();
      for (const pc of withPhoto) {
        const node = cardRefs.current.get(pc.id);
        if (!node) continue;
        const dataUrl = await toPng(node, { pixelRatio: 2 });
        const base64 = dataUrl.split(',')[1];
        zip.file(`pc-gamer-${slugify(pc.nome)}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(URL.createObjectURL(blob), 'etiquetas-pc-gamer.zip');
    } catch {
      setError('Não foi possível gerar o pacote de imagens. Tente novamente.');
    } finally {
      setGeneratingAll(false);
    }
  };

  // Máquina de exemplo pras miniaturas do seletor de modelo — usa a primeira
  // salva (com foto, se houver) pra o usuário ver o modelo com dado real.
  const amostra: VitrinePcGamerPayload = saved[0]
    ? toPayload(saved[0], photos[saved[0].id] ?? null, modeloId)
    : {
        nome: 'PC Gamer Ryzen 5 5600',
        processador: 'AMD Ryzen 5 5600',
        memoriaRam: '16GB DDR4',
        ssd: 'SSD NVMe 512GB',
        hd: 'HD 1TB',
        placaVideo: 'RTX 3060 12GB',
        jogos: 'Fortnite · GTA V · Valorant · CS2',
        valorAVista: '4499,00',
        foto: null,
      };

  return (
    <div>
      <Link
        href="/jp/pc-gamer"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
      >
        <LucideArrowLeft size={16} /> Voltar para o gerador
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary">Etiquetas PC Gamer</p>
          <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Vitrine Digital</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            Etiqueta em formato de tela de celular, com foto da máquina. Anexe uma foto (já com fundo removido) por PC
            e baixe a imagem pronta — pra mandar pro cliente por WhatsApp ou deixar num tablet na loja.
          </p>
        </div>
        {withPhoto.length > 0 && (
          <Button onClick={handleGenerateAll} disabled={generatingAll} className="flex shrink-0 items-center gap-2">
            {generatingAll ? <LucideLoader2 size={18} className="animate-spin" /> : <LucideDownloadCloud size={18} />}
            Gerar Todos ({withPhoto.length})
          </Button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {/* Seletor de modelo: vale pro lote inteiro, inclusive pro "Gerar Todos". */}
      <section className="mb-10">
        <div className="mb-4 flex items-baseline gap-3 border-b border-white/10 pb-3">
          <h2 className="display-font text-lg font-bold text-white">Modelo do cartão</h2>
          <span className="text-xs text-white/30">{VITRINE_PC_GAMER_MODELOS.length} modelos</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {VITRINE_PC_GAMER_MODELOS.map((modelo) => {
            const isSelected = modelo.id === modeloId;
            return (
              <button
                key={modelo.id}
                type="button"
                onClick={() => handleSelectModelo(modelo.id)}
                className={`flex flex-col gap-2 rounded-xl p-2.5 text-left transition-colors ${
                  isSelected ? 'bg-primary/10 ring-1 ring-primary/40' : 'bg-black/20 hover:bg-white/5'
                }`}
              >
                <div className="flex w-full items-center justify-center">
                  {/* A miniatura tem que reservar o tamanho JÁ reduzido: transform
                      só muda o desenho, não o espaço que o elemento ocupa no
                      layout — sem esta caixa, o cartão de 480x960 empurraria a
                      grade inteira. */}
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ width: VITRINE_PC_GAMER_WIDTH * THUMB_SCALE, height: VITRINE_PC_GAMER_HEIGHT * THUMB_SCALE }}
                  >
                    <div
                      className="absolute left-0 top-0"
                      style={{ transform: `scale(${THUMB_SCALE})`, transformOrigin: 'top left' }}
                    >
                      <VitrinePcGamerCard payload={amostra} modeloId={modelo.id} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                    {isSelected && <LucideCheckCircle2 size={14} className="text-primary" />}
                    {modelo.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/40">{modelo.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {!hydrated ? null : saved.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <LucideLibrary size={32} className="text-white/20" />
          <p className="text-white/60">Nenhuma etiqueta de PC Gamer salva ainda.</p>
          <Link
            href="/jp/pc-gamer/salvas"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
          >
            Ir pra Etiquetas Salvas
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {saved.map((pc) => {
            const valor = parseCurrencyInput(pc.valorAVista);
            const foto = photos[pc.id];
            const link = links[pc.id];
            const isUploading = uploadingId === pc.id;
            const isDownloading = downloadingId === pc.id;
            return (
              <Card key={pc.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5">
                    {foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={foto} alt="" className="h-full w-full object-contain" />
                    ) : (
                      <LucideImagePlus size={22} className="text-white/20" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="display-font truncate text-base font-bold text-white">{pc.nome || 'Sem nome'}</h3>
                    {valor > 0 && <p className="text-sm font-semibold text-primary">{formatCurrency(valor)}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer">
                    <span className="flex items-center gap-2 rounded border border-white/20 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5">
                      {isUploading ? <LucideLoader2 size={16} className="animate-spin" /> : <LucideImagePlus size={16} />}
                      {foto ? 'Trocar foto' : 'Anexar foto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => handleUpload(pc, e.target.files?.[0])}
                    />
                  </label>

                  {foto && (
                    <Button onClick={() => handleDownloadOne(pc)} disabled={isDownloading} className="flex items-center gap-2">
                      {isDownloading ? <LucideLoader2 size={16} className="animate-spin" /> : <LucideDownload size={16} />}
                      Baixar imagem
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => handleGenerateLink(pc)} className="flex items-center gap-2">
                    <LucideSmartphone size={16} /> Link de exibição
                  </Button>
                </div>

                {link && (
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 p-2">
                    <input
                      readOnly
                      value={link}
                      onFocus={(e) => e.currentTarget.select()}
                      className="min-w-0 flex-1 truncate bg-transparent px-2 text-xs text-white/70 outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink(pc.id)}
                      className="flex shrink-0 items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      {copiedId === pc.id ? (
                        <>
                          <LucideCheck size={13} /> Copiado
                        </>
                      ) : (
                        <>
                          <LucideLink size={13} /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Fora da tela de propósito — existe só pra servir de fonte pro html-to-image gerar o PNG. */}
      <div aria-hidden style={{ position: 'fixed', top: 0, left: -99999, pointerEvents: 'none' }}>
        {withPhoto.map((pc) => (
          <div
            key={pc.id}
            ref={(el) => {
              if (el) cardRefs.current.set(pc.id, el);
              else cardRefs.current.delete(pc.id);
            }}
          >
            <VitrinePcGamerCard payload={toPayload(pc, photos[pc.id], modeloId)} modeloId={modeloId} />
          </div>
        ))}
      </div>
    </div>
  );
}
