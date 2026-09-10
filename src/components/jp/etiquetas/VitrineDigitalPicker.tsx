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
} from 'lucide-react';
import Card from '@/components/jp/ui/Card';
import Button from '@/components/jp/ui/Button';
import { NotebookLabel, loadSavedLabels, formatCurrency, parseCurrencyInput } from '@/lib/jp/etiquetas';
import { getFotoModelo, setFotoModelo, compressImageFile } from '@/lib/jp/fotos-modelo';
import { buildVitrineDigitalUrl, type VitrineDigitalPayload } from '@/lib/jp/vitrine-digital';
import VitrineDigitalCard from './VitrineDigitalCard';

// Remove acentos (marcas diacríticas combinantes, U+0300-U+036F) depois de
// decompor o texto via NFD, pra virar um nome de arquivo seguro.
const DIACRITICS_REGEX = /[̀-ͯ]/g;

function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(DIACRITICS_REGEX, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'notebook'
  );
}

function toPayload(notebook: NotebookLabel, foto: string | null): VitrineDigitalPayload {
  return {
    marcaModelo: notebook.marcaModelo,
    processador: notebook.processador,
    memoriaRam: notebook.memoriaRam,
    armazenamento: notebook.armazenamento,
    sistemaOperacional: notebook.sistemaOperacional,
    bateria: notebook.bateria,
    placaVideo: notebook.placaVideo,
    valorAVista: notebook.valorAVista,
    foto,
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

// Gera a Vitrine Digital (etiqueta em formato de tela de celular, com foto)
// a partir de uma etiqueta já salva. A foto fica anexada por modelo
// (getFotoModelo/setFotoModelo) — anexa uma vez e qualquer notebook com esse
// mesmo nome já aproveita.
//
// A entrega principal é a IMAGEM (PNG) pra baixar e mandar direto pro
// cliente por WhatsApp — "Gerar Todos" baixa todas de uma vez, já
// compactadas num .zip. O link de exibição continua existindo à parte, pra
// quem quiser deixar aberto ao vivo num tablet fixado na loja.
export default function VitrineDigitalPicker() {
  const [saved, setSaved] = useState<NotebookLabel[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [error, setError] = useState('');

  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const notebooks = loadSavedLabels();
    setSaved(notebooks);
    const photoMap: Record<string, string> = {};
    notebooks.forEach((nb) => {
      const foto = getFotoModelo(nb.marcaModelo);
      if (foto) photoMap[nb.id] = foto;
    });
    setPhotos(photoMap);
    setHydrated(true);
  }, []);

  const handleUpload = async (notebook: NotebookLabel, file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploadingId(notebook.id);
    try {
      const compressed = await compressImageFile(file);
      setFotoModelo(notebook.marcaModelo, compressed);
      setPhotos((current) => ({ ...current, [notebook.id]: compressed }));
      setLinks((current) => {
        const next = { ...current };
        delete next[notebook.id];
        return next;
      });
    } catch {
      setError('Não foi possível processar essa imagem. Tente outro arquivo.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleGenerateLink = (notebook: NotebookLabel) => {
    const url = buildVitrineDigitalUrl(toPayload(notebook, photos[notebook.id] ?? null));
    setLinks((current) => ({ ...current, [notebook.id]: url }));
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

  const handleDownloadOne = async (notebook: NotebookLabel) => {
    const node = cardRefs.current.get(notebook.id);
    if (!node) return;
    setError('');
    setDownloadingId(notebook.id);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2 });
      triggerDownload(dataUrl, `etiqueta-${slugify(notebook.marcaModelo)}.png`);
    } catch {
      setError('Não foi possível gerar a imagem dessa etiqueta.');
    } finally {
      setDownloadingId(null);
    }
  };

  const withPhoto = saved.filter((nb) => photos[nb.id]);

  const handleGenerateAll = async () => {
    if (withPhoto.length === 0) return;
    setError('');
    setGeneratingAll(true);
    try {
      const zip = new JSZip();
      for (const notebook of withPhoto) {
        const node = cardRefs.current.get(notebook.id);
        if (!node) continue;
        const dataUrl = await toPng(node, { pixelRatio: 2 });
        const base64 = dataUrl.split(',')[1];
        zip.file(`etiqueta-${slugify(notebook.marcaModelo)}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(URL.createObjectURL(blob), 'etiquetas-vitrine-digital.zip');
    } catch {
      setError('Não foi possível gerar o pacote de imagens. Tente novamente.');
    } finally {
      setGeneratingAll(false);
    }
  };

  return (
    <div>
      <Link
        href="/jp/etiquetas"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
      >
        <LucideArrowLeft size={16} /> Voltar para o gerador
      </Link>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary">Etiquetas de Vitrine</p>
          <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Vitrine Digital</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            Etiqueta em formato de tela de celular, com foto do notebook. Anexe uma foto (já com fundo removido) por
            modelo e baixe a imagem pronta — pra mandar pro cliente por WhatsApp ou deixar salva num tablet.
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

      {!hydrated ? null : saved.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <LucideLibrary size={32} className="text-white/20" />
          <p className="text-white/60">Nenhuma etiqueta salva ainda.</p>
          <Link
            href="/jp/etiquetas/salvas"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-white"
          >
            Ir pra Etiquetas Salvas
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {saved.map((nb) => {
            const valor = parseCurrencyInput(nb.valorAVista);
            const foto = photos[nb.id];
            const link = links[nb.id];
            const isUploading = uploadingId === nb.id;
            const isDownloading = downloadingId === nb.id;
            return (
              <Card key={nb.id} className="flex flex-col gap-4 p-5">
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
                    <h3 className="display-font truncate text-base font-bold text-white">
                      {nb.marcaModelo || 'Sem nome'}
                    </h3>
                    {valor > 0 && <p className="text-sm font-semibold text-primary">{formatCurrency(valor)}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer">
                    <span className="flex items-center gap-2 rounded px-4 py-2.5 text-sm font-semibold text-white transition-colors bg-transparent border border-white/20 hover:bg-white/5">
                      {isUploading ? (
                        <LucideLoader2 size={16} className="animate-spin" />
                      ) : (
                        <LucideImagePlus size={16} />
                      )}
                      {foto ? 'Trocar foto' : 'Anexar foto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => handleUpload(nb, e.target.files?.[0])}
                    />
                  </label>

                  {foto && (
                    <Button
                      onClick={() => handleDownloadOne(nb)}
                      disabled={isDownloading}
                      className="flex items-center gap-2"
                    >
                      {isDownloading ? (
                        <LucideLoader2 size={16} className="animate-spin" />
                      ) : (
                        <LucideDownload size={16} />
                      )}
                      Baixar imagem
                    </Button>
                  )}

                  <Button variant="outline" onClick={() => handleGenerateLink(nb)} className="flex items-center gap-2">
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
                      onClick={() => handleCopyLink(nb.id)}
                      className="flex shrink-0 items-center gap-1.5 rounded-md bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
                    >
                      {copiedId === nb.id ? (
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
        {withPhoto.map((nb) => (
          <div
            key={nb.id}
            ref={(el) => {
              if (el) cardRefs.current.set(nb.id, el);
              else cardRefs.current.delete(nb.id);
            }}
          >
            <VitrineDigitalCard payload={toPayload(nb, photos[nb.id])} />
          </div>
        ))}
      </div>
    </div>
  );
}
