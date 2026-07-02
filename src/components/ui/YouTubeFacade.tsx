'use client';
import { useState } from 'react';
import Image from 'next/image';
import { LucidePlay } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
}

// Fachada leve: mostra so a thumbnail e monta o iframe do YouTube apenas no
// clique. Evita carregar o player (JS pesado + cookies) para quem nao assiste.
export default function YouTubeFacade({ videoId, title }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        className="absolute inset-0 w-full h-full"
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Assistir: ${title}`}
      className="group/play absolute inset-0 w-full h-full cursor-pointer"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="288px"
        className="object-cover"
      />
      <span className="absolute inset-0 bg-black/30 transition-colors group-hover/play:bg-black/10" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-black shadow-lg glow-neon transition-transform group-hover/play:scale-110">
          <LucidePlay size={24} fill="currentColor" className="ml-0.5" />
        </span>
      </span>
    </button>
  );
}
