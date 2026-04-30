import React from 'react';

const Navbar = ({ activePage, setActivePage }) => (
  <nav className="fixed top-0 left-0 right-0 bg-[#FDFCFB]/90 backdrop-blur-md z-50 border-b border-[#721C24]/10 h-16 md:h-20">
    <div className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">
      <span
        className="text-xl md:text-2xl font-serif tracking-widest text-[#721C24] uppercase cursor-pointer"
        onClick={() => setActivePage('home')}
        onKeyDown={(e) => e.key === 'Enter' && setActivePage('home')}
        role="button"
        tabIndex={0}
        aria-label="Ir ao início"
      >
        Z & S
      </span>
      <div className="hidden md:flex gap-8 text-sm font-bold tracking-[0.15em] uppercase text-[#721C24]/50">
        <button
          onClick={() => setActivePage('home')}
          className={activePage === 'home' ? 'text-[#721C24] border-b-2 border-[#721C24]' : 'hover:text-[#721C24] transition'}
        >
          Início
        </button>
        <button
          onClick={() => setActivePage('gifts')}
          className={activePage === 'gifts' ? 'text-[#721C24] border-b-2 border-[#721C24]' : 'hover:text-[#721C24] transition'}
        >
          Presentes
        </button>
        <button
          onClick={() => setActivePage('messages')}
          className={activePage === 'messages' ? 'text-[#721C24] border-b-2 border-[#721C24]' : 'hover:text-[#721C24] transition'}
        >
          Recados
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
