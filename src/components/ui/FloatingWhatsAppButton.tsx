'use client';
import { usePathname } from 'next/navigation';
import { LucideMessageCircle } from 'lucide-react';
import { WHATSAPP_DUVIDA } from '@/lib/site';

// Extraído do layout raiz para poder se esconder no painel interno (/jp),
// que não deve expor o CTA de WhatsApp voltado ao público. Nas páginas
// públicas o comportamento é idêntico ao anterior.
export default function FloatingWhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/jp')) return null;

  return (
    <a
      href={WHATSAPP_DUVIDA}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a INFO Centro no WhatsApp"
      className="fixed bottom-6 right-6 p-4 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform z-50 animate-pulse motion-reduce:animate-none border border-white/20"
    >
      <LucideMessageCircle size={32} />
    </a>
  );
}
