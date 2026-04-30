import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { HOME_MOMENT_VIDEOS, WEDDING_ALBUM_PHOTOS } from '../data/constants';
import WeddingPhotoCarousel from '../components/WeddingPhotoCarousel';

/** Extrai o ID do vídeo a partir de vários formatos de URL do YouTube. */
const youtubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  let embed = trimmed;
  if (!trimmed.includes('youtube.com/embed/')) {
    const be = trimmed.match(/youtu\.be\/([^/?]+)/);
    if (be) embed = `https://www.youtube.com/embed/${be[1]}`;
    else {
      const watch = trimmed.match(/[?&]v=([^&]+)/);
      if (watch) embed = `https://www.youtube.com/embed/${watch[1]}`;
      else {
        const shorts = trimmed.match(/youtube\.com\/shorts\/([^/?]+)/);
        if (shorts) embed = `https://www.youtube.com/embed/${shorts[1]}`;
        else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) embed = `https://www.youtube.com/embed/${trimmed}`;
        else return '';
      }
    }
  }
  try {
    const path = new URL(embed).pathname;
    const m = path.match(/\/embed\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  } catch {
    return '';
  }
};

/**
 * URL do iframe. controls=0 esconde parte dos controlos (Shorts ainda pode mostrar logo/barra).
 * Não é possível remover por completo a UI do YouTube dentro do iframe.
 */
const youtubeIframeSrc = (videoId, autoplay) => {
  const u = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  u.searchParams.set('rel', '0');
  u.searchParams.set('modestbranding', '1');
  u.searchParams.set('playsinline', '1');
  u.searchParams.set('controls', '0');
  if (autoplay) u.searchParams.set('autoplay', '1');
  return u.toString();
};

const PosterThumb = ({ videoId, onFallback }) => {
  const base = `https://i.ytimg.com/vi/${videoId}`;
  const [src, setSrc] = useState(`${base}/maxresdefault.jpg`);

  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => {
        if (src.includes('maxres')) setSrc(`${base}/hqdefault.jpg`);
        else if (src.includes('hqdefault')) setSrc(`${base}/mqdefault.jpg`);
        else onFallback?.();
      }}
    />
  );
};

/** Vídeo em `public/` sem UI nativa: um toque = play/pause; só aparece ícone de play quando está pausado. */
const MomentLocalVideoBlock = ({ videoKey, title, subtitle, orientation, fileUrl, posterUrl, isActive, onRequestPlay }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(true);
  const isPortrait = orientation === 'portrait';

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => setPaused(v.paused);
    const handlePlay = () => {
      sync();
      onRequestPlay(videoKey);
    };
    v.addEventListener('play', sync);
    v.addEventListener('play', handlePlay);
    v.addEventListener('pause', sync);
    return () => {
      v.removeEventListener('play', sync);
      v.removeEventListener('play', handlePlay);
      v.removeEventListener('pause', sync);
    };
  }, [onRequestPlay, videoKey]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!isActive && !v.paused) v.pause();
  }, [isActive]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      onRequestPlay(videoKey);
      void v.play();
    }
    else v.pause();
  };

  return (
    <div className="space-y-3 text-center">
      <div>
        <h4 className="font-serif text-xl md:text-2xl text-[#721C24]">{title}</h4>
        {subtitle && <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 font-bold mt-1">{subtitle}</p>}
      </div>
      <div
        className={[
          'relative mx-auto overflow-hidden rounded-sm shadow-2xl bg-black cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#721C24] focus-visible:ring-offset-2',
          isPortrait ? 'aspect-[9/16] w-full max-w-[min(100%,340px)]' : 'aspect-video w-full max-w-4xl',
        ].join(' ')}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={paused ? 'Reproduzir vídeo' : 'Pausar vídeo'}
      >
        <video
          ref={videoRef}
          src={fileUrl}
          poster={posterUrl?.trim() ? posterUrl.trim() : undefined}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          preload="metadata"
        />
        {paused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25 pointer-events-none">
            <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md">
              <Play className="ml-1 text-white fill-white" size={36} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const MomentYoutubeBlock = ({ videoKey, title, subtitle, orientation, embedUrl, isActive, onRequestPlay }) => {
  const videoId = youtubeVideoId(embedUrl);
  const [posterFailed, setPosterFailed] = useState(false);

  const isPortrait = orientation === 'portrait';

  let inner = null;
  if (!embedUrl?.trim()) {
    inner = (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#721C24]/[0.07] p-6 text-center">
        <p className="font-serif text-lg text-[#721C24]">{title}</p>
        <p className="mt-2 text-xs text-stone-500 leading-relaxed max-w-xs">
          Este vídeo será adicionado aqui em breve.
        </p>
      </div>
    );
  } else if (!videoId) {
    inner = (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 p-6 text-center">
        <p className="font-serif text-[#721C24]">{title}</p>
        <p className="mt-2 text-xs text-stone-500">Não conseguimos ler este link do YouTube. Usa o link normal do vídeo ou o ID.</p>
      </div>
    );
  } else if (isActive) {
    inner = (
      <iframe
        title={title}
        src={youtubeIframeSrc(videoId, true)}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  } else {
    inner = (
      <>
        {!posterFailed ? (
          <PosterThumb videoId={videoId} onFallback={() => setPosterFailed(true)} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#721C24]/40 to-stone-900/80" aria-hidden />
        )}
        <div className="absolute inset-0 bg-[#721C24]/25" aria-hidden />
        <button
          type="button"
          onClick={() => onRequestPlay(videoKey)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#721C24]/50"
        >
          <span className="sr-only">Reproduzir vídeo</span>
          <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md transition group-hover:bg-white/25 group-hover:scale-105">
            <Play className="ml-1 text-white fill-white" size={36} />
          </span>
          <span className="px-4 text-center font-serif text-lg md:text-xl tracking-[0.15em] uppercase text-white drop-shadow-md">
            Ver vídeo
          </span>
        </button>
      </>
    );
  }

  return (
    <div className="space-y-3 text-center">
      <div>
        <h4 className="font-serif text-xl md:text-2xl text-[#721C24]">{title}</h4>
        {subtitle && <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-stone-500 font-bold mt-1">{subtitle}</p>}
      </div>
      <div
        className={[
          'relative mx-auto overflow-hidden rounded-sm shadow-2xl bg-black',
          isPortrait ? 'aspect-[9/16] w-full max-w-[min(100%,340px)]' : 'aspect-video w-full max-w-4xl',
        ].join(' ')}
      >
        {inner}
      </div>
    </div>
  );
};

/** Se `fileUrl` estiver preenchido (MP4 em `public/`), usa leitor limpo; senão YouTube. */
const MomentVideoBlock = (props) =>
  props.fileUrl?.trim() ? <MomentLocalVideoBlock {...props} /> : <MomentYoutubeBlock {...props} />;

const HomePage = () => {
  const [activeVideoKey, setActiveVideoKey] = useState(null);

  return (
    <div className="pt-16 md:pt-20 animate-in fade-in duration-700 bg-[#FDFCFB] font-sans">
    <section className="relative h-[55vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#721C24]/30 z-10" />
      <img src="testagrudada.jpeg" className="absolute inset-0 w-full h-full object-cover" alt="Zacarias e Stefany" />
      <div className="relative z-20 text-center text-white px-4 space-y-4 md:space-y-6">
        <p className="text-sm md:text-lg tracking-[0.2em] uppercase font-light drop-shadow-md">A nossa jornada começa agora</p>
        <h1 className="text-4xl md:text-7xl font-serif leading-tight drop-shadow-lg text-white">Zacarias & Stefany</h1>
        <p className="text-base md:text-xl tracking-[0.3em] font-light uppercase border-t border-b border-white/40 py-3 inline-block">31 de Maio de 2026</p>
      </div>
    </section>

    <section className="max-w-5xl mx-auto py-8 md:py-32 px-5">
      <div className="grid md:grid-cols-2 gap-6 md:gap-20 items-center">
        <div className="space-y-4 md:space-y-8">
          <div className="space-y-1 md:space-y-2">
            <span className="text-[#721C24] uppercase tracking-[0.3em] text-[10px] font-bold font-sans">Z & S</span>
            <h2 className="text-3xl md:text-6xl font-serif text-[#721C24] leading-tight">Nossa História</h2>
          </div>
          <div className="space-y-3 md:space-y-6 text-stone-600 leading-relaxed text-base md:text-lg font-light font-sans">
            <p>
              Tudo começou com um simples olhar. Um amor que nasceu em cima do altar: dois jovens cheios do Espírito Santo se encontraram e logo se apaixonaram.
            </p>
            <p>
              Nossa história de amor começou há exatos 14 meses — um propósito que, no início, parecia impossível. Muitas adversidades surgiram, mas o Senhor tinha um plano para nós, Stefany e Zacarias: idades diferentes, personalidades diferentes, mas os dois tinham algo em comum — uma missão, um propósito. Uma frase que já ouvimos muito é: que Deus une propósitos.
            </p>
            <p>
              Passamos por guerras e preconceitos; profecias da carne vieram para tentar nos separar, mas o nosso amor só cresceu a cada dia — um amor que nasceu de uma amizade linda e sincera e de um enorme desejo de fazer a vontade de Deus. A Palavra de Deus diz, em 1 Coríntios 13:4–7:
            </p>
            <blockquote className="border-l-4 border-[#721C24]/25 pl-4 md:pl-6 my-4 md:my-6 font-serif italic text-[#721C24]/95 text-base md:text-lg">
              &ldquo;O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor. O amor não se alegra com a injustiça, mas se alegra com a verdade. Tudo sofre, tudo crê, tudo espera, tudo suporta.&rdquo;
            </blockquote>
            <p>
              Hoje, depois de tudo o que passamos, estamos contemplando a bondade de Deus e a sua fidelidade. Olhando para trás, somos gratos por tudo o que vivemos, pois valeu a pena: cada oração, cada jejum que fizemos um pelo outro. Hoje o Senhor tem-nos honrado grandemente.
            </p>
            <p>
              Daqui a poucos dias diremos sim um ao outro no altar do Senhor. Estamos prontos para viver tudo aquilo que o Senhor já preparou para nós — porque &ldquo;dele, e por ele, e para ele são todas as coisas; glória a ele eternamente. Amém&rdquo; (Romanos 11:36).
            </p>
            <p className="pt-1">
              Amamos-Te, Senhor. Obrigado por nos escolher para viver esse lindo propósito. ❤️
            </p>
          </div>
        </div>
        <div className="relative p-1 border border-[#721C24]/10">
          <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl relative z-10">
            <img src="beijonatesta.jpeg" className="w-full h-full object-cover" alt="Casal" />
          </div>
          <div className="absolute -top-4 -right-4 w-full h-full bg-[#721C24]/5 -z-10" />
        </div>
      </div>
    </section>

    <section className="bg-[#721C24]/5 py-8 md:py-32 px-5">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-16">
        <div className="text-center space-y-2 md:space-y-4">
          <h2 className="text-2xl md:text-5xl font-serif text-[#721C24] uppercase tracking-wide">Momentos Eternizados</h2>
          <div className="w-16 h-[1px] bg-[#721C24]/20 mx-auto" />
        </div>

        <div className="space-y-8 md:space-y-14">
          <h3 className="text-[14px] font-bold text-[#721C24] uppercase tracking-[0.4em] text-center mb-3 md:mb-10 font-sans">O Nosso Caminho Juntos</h3>
          <div className="space-y-12 md:space-y-16">
            {HOME_MOMENT_VIDEOS[0] && (
              <MomentVideoBlock
                {...HOME_MOMENT_VIDEOS[0]}
                videoKey={HOME_MOMENT_VIDEOS[0].id ?? `moment-0`}
                isActive={activeVideoKey === (HOME_MOMENT_VIDEOS[0].id ?? 'moment-0')}
                onRequestPlay={setActiveVideoKey}
              />
            )}
            <div className="grid md:grid-cols-2 gap-10 md:gap-12 max-w-5xl mx-auto items-start justify-items-center">
              {HOME_MOMENT_VIDEOS.slice(1).map((v, i) => {
                const videoKey = v.id ?? `moment-${i + 1}`;
                return (
                  <MomentVideoBlock
                    key={videoKey}
                    {...v}
                    videoKey={videoKey}
                    isActive={activeVideoKey === videoKey}
                    onRequestPlay={setActiveVideoKey}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-10 pt-4 md:pt-8">
          <h3 className="text-[14px] font-bold text-[#721C24] uppercase tracking-[0.4em] text-center font-sans">Memórias em fotos</h3>
          <WeddingPhotoCarousel photos={WEDDING_ALBUM_PHOTOS} />
        </div>
      </div>
    </section>
    </div>
  );
};

export default HomePage;
