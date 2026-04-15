import { RefObject, useEffect, useState } from 'react';

export function useScrollFrame(containerRef: RefObject<HTMLElement | null>, totalFrames: number, mode: 'sticky' | 'inline' = 'sticky') {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      
      let progress = 0;
      if (mode === 'sticky') {
        const scrollable = el.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        progress = scrollable > 0 ? Math.max(0, Math.min(scrolled / scrollable, 1)) : 0;
      } else {
        const scrollable = window.innerHeight + el.offsetHeight;
        const scrolled = window.innerHeight - rect.top;
        progress = Math.max(0, Math.min(scrolled / scrollable, 1));
      }
      
      setCurrentFrame(Math.floor(progress * (totalFrames - 1)));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // setTimeout to ensure layout is done before initially calculating scroll
    setTimeout(onScroll, 50);
    return () => window.removeEventListener('scroll', onScroll);
  }, [containerRef, totalFrames]);

  return currentFrame;
}
