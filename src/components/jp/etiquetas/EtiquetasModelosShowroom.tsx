'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { LucideArrowLeft, LucideCheckCircle2 } from 'lucide-react';
import Button from '@/components/jp/ui/Button';
import {
  LABEL_SAMPLE_DATA,
  LABEL_TEMPLATE_CATEGORIES,
  getSelectedTemplateId,
  setSelectedTemplateId,
} from '@/lib/jp/label-templates';
import { LABEL_TEMPLATES } from './templates/registry';

// Showroom de modelos de etiqueta: mostra os 20+ designs organizados por
// categoria (como um catálogo de verdade, não uma grade única de cartões
// idênticos), todos com os mesmos dados de exemplo, e permite escolher um
// como padrão. A escolha é salva no localStorage — é o que o gerador
// (/jp/etiquetas) lê pra usar esse mesmo layout na prévia e no "Gerar PDF".

// Cada modelo de etiqueta tem um tamanho físico fixo em pixels (pensado pra
// sair certinho na impressão) — uns são retrato de 200px, outros paisagem de
// 360px, outros quadrados de 340px. Isso é correto e não pode mudar (é o que
// garante que a prévia e o PDF fiquem perfeitos). O problema era só a
// VITRINE do catálogo: um palco de altura fixa com scroll cortava ou
// deixava desproporcional quem não coubesse exatamente naquele tamanho.
//
// O TemplateStage aqui resolve isso só na exibição: mede o tamanho real do
// modelo (sem tocar nele) e aplica um CSS transform: scale() só nessa
// "foto" dele, pra caber inteiro dentro de uma caixa de tamanho uniforme,
// como uma miniatura de catálogo de e-commerce. O componente do modelo em si
// — e o que é usado no gerador/impressão — continua exatamente igual.
function TemplateStage({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const recalc = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      if (!contentWidth || !contentHeight || !containerWidth || !containerHeight) return;

      const nextScale = Math.min(containerWidth / contentWidth, containerHeight / contentHeight);
      setScale(Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1);
    };

    recalc();
    const observer = new ResizeObserver(recalc);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex h-[280px] w-full items-center justify-center overflow-hidden">
      <div ref={contentRef} style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

export default function EtiquetasModelosShowroom() {
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelectedIdState(getSelectedTemplateId());
    setHydrated(true);
  }, []);

  const handleSelect = (id: string) => {
    const next = id === selectedId ? null : id;
    setSelectedIdState(next);
    setSelectedTemplateId(next);
  };

  const selectedTemplate = LABEL_TEMPLATES.find((t) => t.id === selectedId);

  return (
    <div>
      <Link
        href="/jp/etiquetas"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
      >
        <LucideArrowLeft size={16} /> Voltar para o gerador
      </Link>

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary">Etiquetas de Vitrine</p>
          <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Catálogo de Modelos</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            {LABEL_TEMPLATES.length} propostas de design com os mesmos dados de exemplo ({LABEL_SAMPLE_DATA.marcaModelo}).
            A diferença entre elas é só o layout — escolha a que vai virar o padrão do sistema. A escolha fica salva e
            é usada automaticamente no gerador, tanto na prévia quanto no botão &quot;Gerar PDF&quot;.
          </p>
        </div>

        {hydrated && selectedTemplate && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm text-primary">
            <LucideCheckCircle2 size={16} />
            Selecionado: <span className="font-semibold">{selectedTemplate.name}</span>
          </div>
        )}
      </div>

      <div className="space-y-14">
        {LABEL_TEMPLATE_CATEGORIES.map((category) => {
          const templatesInCategory = LABEL_TEMPLATES.filter((t) => t.category === category);
          if (templatesInCategory.length === 0) return null;

          return (
            <section key={category}>
              <div className="mb-5 flex items-baseline gap-3 border-b border-white/10 pb-3">
                <h2 className="display-font text-lg font-bold text-white">{category}</h2>
                <span className="text-xs text-white/30">{templatesInCategory.length} modelos</span>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
                {templatesInCategory.map((template) => {
                  const isSelected = template.id === selectedId;
                  const TemplateComponent = template.Component;
                  const globalIndex = LABEL_TEMPLATES.findIndex((t) => t.id === template.id);

                  return (
                    <div key={template.id} className="flex flex-col gap-4">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-widest text-white/30">
                          Modelo {String(globalIndex + 1).padStart(2, '0')}
                        </p>
                        <h3 className="display-font text-base font-bold text-white">{template.name}</h3>
                        <p className="mt-0.5 text-xs text-white/50">{template.description}</p>
                      </div>

                      {/* "Palco" onde o modelo aparece exatamente como sairia impresso — sem
                          embrulhar num segundo card, pra etiqueta ser o único elemento com
                          presença de "objeto" na grade. O TemplateStage só encolhe/aumenta a
                          exibição pra caber na caixa; o modelo em si não muda. */}
                      <div
                        className={`overflow-hidden rounded-xl p-4 transition-colors ${
                          isSelected ? 'bg-primary/10 ring-1 ring-primary/40' : 'bg-black/20'
                        }`}
                      >
                        <TemplateStage>
                          <TemplateComponent data={LABEL_SAMPLE_DATA} />
                        </TemplateStage>
                      </div>

                      <Button
                        variant={isSelected ? 'primary' : 'outline'}
                        onClick={() => handleSelect(template.id)}
                        className="flex items-center justify-center gap-2"
                      >
                        {isSelected ? (
                          <>
                            <LucideCheckCircle2 size={16} /> Modelo Selecionado
                          </>
                        ) : (
                          'Selecionar Modelo'
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
