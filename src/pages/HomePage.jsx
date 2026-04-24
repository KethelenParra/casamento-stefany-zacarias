import React from 'react';
import { Play, Quote } from 'lucide-react';

const HomePage = () => (
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
            <p>Tudo começou com um olhar e uma certeza: a de que tínhamos encontrado um no outro o que o mundo raramente oferece. Entre sorrisos partilhados e sonhos construídos, cada passo levou-nos a este momento.</p>
            <div className="pt-2 md:pt-6">
              <Quote className="text-[#721C24]/10 mb-2 md:mb-4" size={36} />
              <p className="font-serif italic text-lg md:text-3xl text-[#721C24]">"O amor não consiste em olhar um para o outro, mas em olhar juntos na mesma direção."</p>
            </div>
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

        <div className="space-y-3 md:space-y-6">
          <h3 className="text-[14px] font-bold text-[#721C24] uppercase tracking-[0.4em] text-center mb-3 md:mb-8 font-sans">O Nosso Caminho Juntos</h3>
          <div className="group relative aspect-video bg-[#721C24] rounded-sm overflow-hidden shadow-2xl">
            <img src="sorrindo.jpeg" className="w-full h-full object-cover opacity-60" alt="Nós" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition duration-300">
                <Play size={40} className="text-white fill-white ml-2" />
              </div>
              <p className="mt-6 text-white font-serif text-2xl tracking-[0.2em] uppercase">Nós</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-10">
          <div className="space-y-4">
            <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.4em] text-center font-sans"> Do Noivo para Noiva</h3>
            <div className="group relative aspect-video bg-[#721C24] rounded-sm overflow-hidden shadow-xl">
              <img src="sorrindo.jpeg" className="w-full h-full object-cover opacity-60" alt="De Zacarias" />
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer"><Play size={32} className="text-white fill-white opacity-80" /></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.4em] text-center font-sans">Da Noiva para Noivo</h3>
            <div className="group relative aspect-video bg-[#721C24] rounded-sm overflow-hidden shadow-xl">
              <img src="sorrindo.jpeg" className="w-full h-full object-cover opacity-60" alt="De Stefany" />
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer"><Play size={32} className="text-white fill-white opacity-80" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
