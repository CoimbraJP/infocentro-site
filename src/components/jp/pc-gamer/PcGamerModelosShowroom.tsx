'use client';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { LucideArrowLeft, LucideCheckCircle2 } from 'lucide-react';
import Button from '@/components/jp/ui/Button';
import {
  PC_GAMER_SAMPLE_DATA,
  PC_GAMER_TEMPLATE_CATEGORIES,
  getSelectedPcGamerTemplateId,
  setSelectedPcGamerTemplateId,
} from '@/lib/jp/pc-gamer-templates';
import { PC_GAMER_TEMPLATES, DEFAULT_PC_GAMER_TEMPLATE_ID } from './templates/registry';

// Catálogo dos modelos de etiqueta IMPRESSA do módulo PC Gamer. A escolha
// fica salva em chave própria de localStorage e é o que o gerador usa na
// prévia e no "Gerar PDF" — trocar o modelo aqui não mexe no modelo escolhido
// pras etiquetas de notebook.

// Cada modelo tem tamanho físico fixo (340x340, pensado pra sair certinho na
// folha). O palco abaixo só encolhe a "foto" dele pra caber numa miniatura de
// tamanho uniforme, como vitrine de catálogo — o componente em si não muda.
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
    <div ref={containerRef} className="flex h-[300px] w-full items-center justify-center overflow-hidden">
      <div ref={contentRef} style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

export default function PcGamerModelosShowroom() {
  const [selectedId, setSelectedIdState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelectedIdState(getSelectedPcGamerTemplateId() ?? DEFAULT_PC_GAMER_TEMPLATE_ID);
    setHydrated(true);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedIdState(id);
    setSelectedPcGamerTemplateId(id);
  };

  const selectedTemplate = PC_GAMER_TEMPLATES.find((t) => t.id === selectedId);

  return (
    <div>
      <Link
        href="/jp/pc-gamer"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
      >
        <LucideArrowLeft size={16} /> Voltar para o gerador
      </Link>

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary">Etiquetas PC Gamer</p>
          <h1 className="display-font mt-1 text-3xl font-bold text-white md:text-4xl">Modelos de Impressão</h1>
          <p className="mt-2 max-w-2xl text-white/60">
            {PC_GAMER_TEMPLATES.length} modelos com os mesmos dados de exemplo ({PC_GAMER_SAMPLE_DATA.nome}). A
            diferença entre eles é só o layout. A escolha fica salva e é usada no gerador, tanto na prévia quanto no
            &quot;Gerar PDF&quot;.
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
        {PC_GAMER_TEMPLATE_CATEGORIES.map((category) => {
          const templatesInCategory = PC_GAMER_TEMPLATES.filter((t) => t.category === category);
          if (templatesInCategory.length === 0) return null;

          return (
            <section key={category}>
              <div className="mb-5 flex items-baseline gap-3 border-b border-white/10 pb-3">
                <h2 className="display-font text-lg font-bold text-white">{category}</h2>
                <span className="text-xs text-white/30">{templatesInCategory.length} modelos</span>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {templatesInCategory.map((template) => {
                  const isSelected = template.id === selectedId;
                  const TemplateComponent = template.Component;

                  return (
                    <div key={template.id} className="flex flex-col gap-4">
                      <div>
                        <h3 className="display-font text-base font-bold text-white">{template.name}</h3>
                        <p className="mt-0.5 text-xs text-white/50">{template.description}</p>
                      </div>

                      <div
                        className={`overflow-hidden rounded-xl p-4 transition-colors ${
                          isSelected ? 'bg-primary/10 ring-1 ring-primary/40' : 'bg-black/20'
                        }`}
                      >
                        <TemplateStage>
                          <TemplateComponent data={PC_GAMER_SAMPLE_DATA} />
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
