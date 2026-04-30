import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const WeddingPhotoCarousel = ({ photos = [] }) => {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  const scrollTo = useCallback((i) => {
    const el = listRef.current;
    if (!el || !photos.length) return;
    const clamped = Math.max(0, Math.min(i, photos.length - 1));
    const slide = el.children[clamped];
    if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setIndex(clamped);
  }, [photos.length]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const cr = child.getBoundingClientRect();
        const cMid = cr.left + cr.width / 2;
        const d = Math.abs(cMid - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [photos.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (lightbox !== null) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setLightbox(null);
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setLightbox((i) => (i === null ? i : Math.max(0, i - 1)));
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setLightbox((i) => (i === null ? i : Math.min(photos.length - 1, i + 1)));
          return;
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollTo(index - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollTo(index + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, scrollTo, lightbox, photos.length]);

  useEffect(() => {
    if (lightbox === null) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const openLightbox = useCallback((i) => {
    setLightbox(Math.max(0, Math.min(i, photos.length - 1)));
  }, [photos.length]);

  if (!photos.length) return null;

  const lbPhoto = lightbox !== null ? photos[lightbox] : null;

  return (
    <div className="relative">
      <div
        ref={listRef}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Memórias em fotos"
        className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1 md:px-0"
      >
        {photos.map((photo, i) => (
          <div
            key={`${photo.src}-${i}`}
            className="snap-center shrink-0 w-[min(88vw,520px)] md:w-[min(72vw,560px)] rounded-sm overflow-hidden shadow-xl border border-[#721C24]/10 bg-[#721C24]/5"
          >
            <button
              type="button"
              onClick={() => openLightbox(i)}
              className="block w-full text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#721C24] focus-visible:ring-offset-2"
              aria-label={`Ampliar foto ${i + 1}`}
            >
              <div className="aspect-[4/5] md:aspect-[3/4]">
                <img
                  src={photo.src}
                  alt={photo.alt || `Foto ${i + 1} do álbum`}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          type="button"
          aria-label="Foto anterior"
          onClick={() => scrollTo(index - 1)}
          disabled={index <= 0}
          className="p-2 rounded-full border border-[#721C24]/20 text-[#721C24] hover:bg-[#721C24]/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft size={28} strokeWidth={1.5} />
        </button>
        <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] font-bold text-stone-500 tabular-nums">
          {index + 1} / {photos.length}
        </p>
        <button
          type="button"
          aria-label="Próxima foto"
          onClick={() => scrollTo(index + 1)}
          disabled={index >= photos.length - 1}
          className="p-2 rounded-full border border-[#721C24]/20 text-[#721C24] hover:bg-[#721C24]/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight size={28} strokeWidth={1.5} />
        </button>
      </div>

      {lbPhoto && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-3 md:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Foto em tamanho grande"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#1c1917]/85 backdrop-blur-sm"
            aria-label="Fechar"
            onClick={() => setLightbox(null)}
          />
          <div className="relative z-10 flex max-h-[min(92vh,1200px)] w-full max-w-[min(96vw,1400px)] flex-col items-center gap-3">
            <div className="flex w-full items-center justify-end gap-2">
              <p className="mr-auto text-[11px] uppercase tracking-[0.35em] font-bold text-white/80 tabular-nums">
                {lightbox + 1} / {photos.length}
              </p>
              <button
                type="button"
                aria-label="Foto anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((j) => Math.max(0, j - 1));
                }}
                disabled={lightbox <= 0}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((j) => Math.min(photos.length - 1, j + 1));
                }}
                disabled={lightbox >= photos.length - 1}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={22} />
              </button>
              <button
                type="button"
                aria-label="Fechar"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(null);
                }}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X size={22} />
              </button>
            </div>
            <div
              className="relative w-full flex-1 min-h-0 flex items-center justify-center rounded-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lbPhoto.src}
                alt={lbPhoto.alt || `Foto ${lightbox + 1}`}
                className="max-h-[min(85vh,1100px)] max-w-full object-contain"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingPhotoCarousel;
