'use client';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#sobre', label: 'SOBRE' },
    { href: '#servicos', label: 'SERVIÇOS' },
    { href: '#videos', label: 'VÍDEOS' },
    { href: '#avaliacoes', label: 'AVALIAÇÕES' },
    { href: '#localizacao', label: 'LOCALIZAÇÃO' },
    { href: '#faq', label: 'FAQ' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-surface backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-mono text-lg font-bold tracking-tighter text-primary group transition-all">
          <span className="text-white">INFO</span> Centro
        </a>
        
        {/* Desktop */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium tracking-wider text-white/70 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5512982007553?text=Ol%C3%A1,%20gostaria%20de%20um%20or%C3%A7amento."
            target="_blank" rel="noopener noreferrer"
            className="ml-4 px-5 py-2.5 bg-primary text-black font-semibold text-sm rounded glow-neon hover:bg-[#cce600] transition-all"
          >
            FALAR NO WHATSAPP
          </a>
        </div>
        
        {/* Mobile toggle */}
        <button className="md:hidden flex flex-col gap-1.5 w-6" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`block h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#050505] px-6 py-6 flex flex-col gap-6 border-b border-white/10">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-sm font-bold tracking-wider text-white/70 hover:text-white">
              {l.label}
            </a>
          ))}
          <a
            href="https://wa.me/5512982007553?text=Ol%C3%A1,%20gostaria%20de%20um%20or%C3%A7amento."
            target="_blank" rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-center px-5 py-3 bg-primary text-black font-semibold text-sm rounded shadow-none w-full"
          >
            FALAR NO WHATSAPP
          </a>
        </div>
      )}
    </nav>
  );
}
