import React, { useEffect, useRef, useState } from 'react';
import { Gift, CheckCircle, RefreshCw, PackagePlus, QrCode } from 'lucide-react';

const GiftCard = ({ gift, onSelectGift, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 2) * 80}ms` }}
      className={`bg-white group overflow-hidden border flex flex-col relative transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${gift.reserved ? 'border-stone-200 opacity-80' : 'border-[#721C24]/10 hover:shadow-xl'}
      `}
    >
      {gift.reserved && (
        <div className="absolute top-2 left-2 z-20 bg-[#721C24] text-white px-2 py-0.5 flex items-center gap-1 shadow-md">
          <CheckCircle size={9} className="shrink-0" />
          <span className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold whitespace-nowrap">Já escolhido</span>
        </div>
      )}

      <div className={`h-36 md:h-44 flex items-center justify-center p-3 relative overflow-hidden ${gift.reserved ? 'bg-stone-100' : 'bg-[#FDFCFB]'}`}>
        {gift.image_url
          ? <img
              src={gift.image_url}
              alt={gift.name}
              className={`max-h-full max-w-full object-contain transition-transform duration-700 ${gift.reserved ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}
            />
          : <Gift size={32} className={`md:w-12 md:h-12 ${gift.reserved ? 'text-stone-300' : 'text-[#721C24]/20'}`} />
        }
      </div>

      <div className="p-3 md:p-5 space-y-2 flex-grow flex flex-col justify-between border-t border-[#721C24]/5">
        <div>
          <p className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-stone-400 mb-0.5 font-bold">{gift.category}</p>
          <h3 className={`text-sm md:text-lg font-serif leading-tight ${gift.reserved ? 'text-stone-400' : 'text-[#721C24]'}`}>{gift.name}</h3>
          <p className="text-stone-400 text-[9px] md:text-xs leading-relaxed mt-1 font-light max-h-14 overflow-y-auto pr-1 md:max-h-16 md:pr-0">
            {gift.description}
          </p>
        </div>
        <button
          onClick={() => !gift.reserved && onSelectGift(gift)}
          disabled={gift.reserved}
          className={`w-full py-2 md:py-3 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold transition-all mt-2 ${
            gift.reserved
              ? 'bg-stone-100 text-stone-300 cursor-not-allowed border border-stone-200'
              : 'bg-[#721C24] text-white hover:bg-[#8B0000] shadow-sm cursor-pointer'
          }`}
        >
          {gift.reserved ? 'Já Presenteado' : 'Presentear'}
        </button>
      </div>
    </div>
  );
};

const ListaPresente = ({ gifts = [], onSelectGift, onDeleteGift, onExchange, onCustomGift, onPix }) => {
  const safeGifts = Array.isArray(gifts) ? gifts : [];
  const [filtroAtivo, setFiltroAtivo] = useState('Todos');

  const categorias = [
    'Todos',
    'Já escolhidos',
    ...Array.from(new Set(safeGifts.map((g) => g.category).filter(Boolean))),
  ];

  const giftsExibidos = (() => {
    if (filtroAtivo === 'Todos') return safeGifts;
    if (filtroAtivo === 'Já escolhidos') return safeGifts.filter((g) => g.reserved);
    return safeGifts.filter((g) => g.category === filtroAtivo);
  })();

  return (
    <div className="pt-16 md:pt-32 pb-24 px-4 max-w-6xl mx-auto bg-[#FDFCFB] font-sans">
      <div className="text-center space-y-3 mb-6 md:mb-12 pt-4 md:pt-0 animate-in fade-in duration-700">
        <h1 className="text-2xl md:text-6xl font-serif text-[#721C24] uppercase tracking-widest">Mimos para o Casal</h1>
        <div className="w-16 h-[1px] bg-[#721C24]/20 mx-auto" />
        <p className="text-stone-500 max-w-md mx-auto text-sm md:text-lg font-light italic">Selecionámos alguns itens que nos ajudarão a construir o nosso novo lar.</p>
        <div className="mt-2 flex flex-col sm:flex-row flex-wrap gap-2 justify-center">
          <button
            onClick={onExchange}
            className="inline-flex items-center justify-center gap-2 border border-[#721C24]/30 text-[#721C24] px-5 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#721C24]/5 transition-all duration-300"
          >
            <RefreshCw size={12} /> Trocar meu Presente
          </button>
          <button
            onClick={onCustomGift}
            className="inline-flex items-center justify-center gap-2 border border-[#721C24]/30 text-[#721C24] px-5 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#721C24]/5 transition-all duration-300"
          >
            <PackagePlus size={12} /> Presente fora da lista
          </button>
          <button
            onClick={onPix}
            className="inline-flex items-center justify-center gap-2 border border-[#721C24]/30 text-[#721C24] px-5 py-2 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#721C24]/5 transition-all duration-300"
          >
            <QrCode size={12} /> Enviar Pix
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6 md:mb-10 animate-in fade-in duration-700">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltroAtivo(cat)}
            className={`px-3 py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold border transition-all duration-300 ${
              filtroAtivo === cat
                ? 'bg-[#721C24] text-white border-[#721C24]'
                : 'bg-white text-[#721C24]/60 border-[#721C24]/20 hover:border-[#721C24]/60 hover:text-[#721C24]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
        {giftsExibidos.length === 0 ? (
          <p className="col-span-full text-center text-stone-400 text-sm py-12 italic">
            Nenhum presente neste filtro.
          </p>
        ) : (
          giftsExibidos.map((gift, i) => (
            <GiftCard key={gift.id} gift={gift} onSelectGift={onSelectGift} index={i} />
          ))
        )}
      </div>
    </div>
  );
};

export default ListaPresente;
