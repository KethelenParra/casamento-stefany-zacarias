import React from 'react';
import { Heart, Gift, MessageSquare } from 'lucide-react';

const TabBar = ({ activePage, setActivePage }) => (
  <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FDFCFB]/95 backdrop-blur-lg border-t border-[#721C24]/10 flex justify-around items-center h-16 z-[90] pb-1 text-[#721C24]/40">
    <button
      onClick={() => setActivePage('home')}
      className={`flex flex-col items-center gap-0.5 transition-all ${activePage === 'home' ? 'text-[#721C24] scale-110' : ''}`}
    >
      <Heart size={20} fill={activePage === 'home' ? 'currentColor' : 'none'} />
      <span className="text-[9px] font-bold uppercase">Início</span>
    </button>
    <button
      onClick={() => setActivePage('gifts')}
      className={`flex flex-col items-center gap-0.5 transition-all ${activePage === 'gifts' ? 'text-[#721C24] scale-110' : ''}`}
    >
      <Gift size={20} fill={activePage === 'gifts' ? 'currentColor' : 'none'} />
      <span className="text-[9px] font-bold uppercase">Mimos</span>
    </button>
    <button
      onClick={() => setActivePage('messages')}
      className={`flex flex-col items-center gap-0.5 transition-all ${activePage === 'messages' ? 'text-[#721C24] scale-110' : ''}`}
    >
      <MessageSquare size={20} fill={activePage === 'messages' ? 'currentColor' : 'none'} />
      <span className="text-[9px] font-bold uppercase">Mural</span>
    </button>
  </div>
);

export default TabBar;
