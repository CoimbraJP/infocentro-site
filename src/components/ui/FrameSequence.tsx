'use client';
import { useEffect, useRef } from 'react';
import { useScrollFrame } from '@/hooks/useScrollFrame';

interface FrameSequenceProps {
  framesPath: string;
  framePrefix?: string;
  zeroPad?: number;
  ext?: string;
  totalFrames: number;
  height?: string;
  children?: React.ReactNode;
  id?: string;
  mode?: 'sticky' | 'inline';
  canvasClassName?: string;
  removeWhiteBg?: boolean;
  scale?: number;
  offsetXPercent?: number;
  offsetYPercent?: number;
}

export default function FrameSequence({
  framesPath,
  framePrefix = 'frame_',
  zeroPad = 4,
  ext = 'webp',
  totalFrames,
  height = '300vh',
  children,
  id,
  mode = 'sticky',
  canvasClassName = '',
  removeWhiteBg = false,
  scale = 1,
  offsetXPercent = 0,
  offsetYPercent = 0,
}: FrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isReadyRef = useRef(false);

  const currentFrame = useScrollFrame(containerRef, totalFrames, mode);

  const getFrameUrl = (index: number) => {
    const padded = String(index + 1).padStart(zeroPad, '0');
    return `${framesPath}/${framePrefix}${padded}.${ext}`;
  };

  useEffect(() => {
    const images: HTMLImageElement[] = Array(totalFrames).fill(null).map(() => new Image());
    imagesRef.current = images;

    const BATCH1_END = Math.min(30, totalFrames);

    let loaded = 0;
    for (let i = 0; i < BATCH1_END; i++) {
      images[i].onload = () => {
        loaded++;
        if (loaded === 1) {
          syncCanvasSize();
          drawFrame(0);
        }
        if (loaded === BATCH1_END) {
          isReadyRef.current = true;
          drawFrame(currentFrame);
        }
      };
      images[i].src = getFrameUrl(i);
    }

    const loadRest = () => {
      for (let i = BATCH1_END; i < totalFrames; i++) {
        images[i].src = getFrameUrl(i);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadRest);
    } else {
      setTimeout(loadRest, 100);
    }
  }, [totalFrames, framesPath]);

  const syncCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;
    let drawW = 0, drawH = 0, offsetX = 0, offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawH = canvas.height;
      drawW = canvas.height * imgRatio;
      offsetX = (canvas.width - drawW) / 2;
    } else {
      drawW = canvas.width;
      drawH = canvas.width / imgRatio;
      offsetY = (canvas.height - drawH) / 2;
    }

    // Apply centering scaling and offsets
    const finalW = drawW * scale;
    const finalH = drawH * scale;
    const finalOffsetX = offsetX - (finalW - drawW) / 2 + (canvas.width * (offsetXPercent / 100));
    const finalOffsetY = offsetY - (finalH - drawH) / 2 + (canvas.height * (offsetYPercent / 100));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the main image
    ctx.drawImage(img, finalOffsetX, finalOffsetY, finalW, finalH);
    
    // Pixel processor: Remove White Background (Chroma-key white)
    if (removeWhiteBg) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 245 && g > 245 && b > 245) {
          data[i + 3] = 0; // Make pure white transparent
        } else if (r > 220 && g > 220 && b > 220) {
          // Soft blending magic to erase halos around white edges
          data[i + 3] = Math.max(0, (255 - r) * 5); 
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    
    // Add a dark overlay only if it's the hero mode
    if (mode === 'sticky') {
      ctx.fillStyle = "rgba(5, 5, 5, 0.45)"; // Dark transparent mask
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (!isReadyRef.current) return;
    requestAnimationFrame(() => {
      drawFrame(currentFrame);
      if (containerRef.current) {
        containerRef.current.style.setProperty('--scroll-progress', (currentFrame / Math.max(1, totalFrames - 1)).toString());
      }
    });
  }, [currentFrame, totalFrames]);

  useEffect(() => {
    const onResize = () => {
      syncCanvasSize();
      drawFrame(currentFrame);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentFrame]);

  if (mode === 'inline') {
    return (
      <div ref={containerRef} id={id} className="relative w-full h-full">
        <canvas ref={canvasRef} className={canvasClassName || "absolute inset-0 w-full h-full"} />
        {children}
      </div>
    );
  }

  return (
    <section ref={containerRef} id={id} style={{ height }} className="relative w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${canvasClassName}`} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 30%, transparent 70%, rgba(5,5,5,0.8) 100%)' }}
        />
        {children}
      </div>
    </section>
  );
}
