'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** atraso em ms, para escalonar itens de uma mesma grade */
  delay?: number;
}

// Fade-up sutil quando o bloco entra na viewport. O estado escondido so e
// aplicado depois do mount: sem JS (ou no HTML pre-renderizado) tudo fica
// visivel, entao nenhum conteudo depende da animacao para aparecer.
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const visible = !mounted || inView;

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
