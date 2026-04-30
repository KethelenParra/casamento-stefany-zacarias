import React from 'react';
import { Plus, Play, Clock } from 'lucide-react';

const Recardo = ({ messages = [], familyVideos = [], onOpenModal }) => {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const hasVideos = Array.isArray(familyVideos) && familyVideos.length > 0;
  return (
    <div className="pt-16 md:pt-32 pb-24 px-4 max-w-6xl mx-auto animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col justify-center items-center text-center mb-6 md:mb-24 gap-5 md:gap-8 pt-4 md:pt-0">
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-2xl md:text-6xl font-serif text-[#721C24] uppercase tracking-widest">Recados de Carinho</h1>
          <p className="text-stone-500 text-xs md:text-lg uppercase tracking-[0.3em] font-bold">Memórias que guardaremos para sempre</p>
        </div>
        <button
          onClick={onOpenModal}
          className="bg-[#721C24] text-white w-3/4 md:w-auto px-6 py-2.5 md:px-12 md:py-5 text-[10px] md:text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#8B0000] transition shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={13} /> Deixar uma Mensagem
        </button>
      </div>
      <div className={hasVideos ? 'grid lg:grid-cols-3 gap-6 md:gap-12' : 'max-w-4xl mx-auto'}>
        {hasVideos && (
          <div className="lg:col-span-1 space-y-4 md:space-y-8">
            <h2 className="text-base md:text-lg font-serif border-b border-[#721C24]/10 pb-3 uppercase tracking-[0.2em] text-[#721C24]">Vídeos da Família</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-8">
              {familyVideos.map(v => (
                <div key={v.id} className="group cursor-pointer">
                  <div className="aspect-video rounded-sm overflow-hidden relative mb-4 shadow-xl border border-[#721C24]/5">
                    <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Thumbnail" />
                    <div className="absolute inset-0 bg-[#721C24]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <Play className="text-white" size={32} fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg text-[#721C24] font-bold">{v.author}</h3>
                  <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase font-bold">{v.relation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={hasVideos ? 'lg:col-span-2 space-y-4 md:space-y-10' : 'space-y-4 md:space-y-10'}>
          <h2 className="text-base md:text-lg font-serif border-b border-[#721C24]/10 pb-3 uppercase tracking-[0.2em] text-[#721C24]">Mural de Mensagens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {safeMessages.length > 0 ? safeMessages.map((m, i) => (
              <div key={m.id || i} className="bg-white p-4 md:p-8 space-y-3 md:space-y-4 hover:shadow-lg border border-[#721C24]/5 transition duration-500">
                <div className="flex justify-between items-start">
                  <h4 className="font-serif text-base md:text-xl text-[#721C24] font-bold">{m.author}</h4>
                  <Clock size={12} className="text-stone-300" />
                </div>
                {m.gift_name && (
                  <div className="text-[9px] uppercase tracking-[0.3em] font-black text-[#721C24]/40 border border-[#721C24]/10 px-2 py-1 inline-block">
                    Mimo: {m.gift_name}
                  </div>
                )}
                <p className="text-stone-600 leading-relaxed italic text-sm md:text-lg font-light line-clamp-6 break-words">"{m.text}"</p>
                <p className="text-[9px] text-stone-300 uppercase tracking-widest font-bold">
                  {m.created_at ? new Date(m.created_at).toLocaleDateString('pt-BR') : 'Agora'}
                </p>
              </div>
            )) : (
              <p className="text-stone-400 text-sm italic py-10 text-center col-span-full uppercase tracking-widest">Ainda não há recados. Seja o primeiro!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recardo;
