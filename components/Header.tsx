
'use client';

import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 glass border-b border-brand-dark/10 shadow-sm' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-xl font-extrabold tracking-tighter uppercase group text-brand-dark">
          La Farina <span className="group-hover:text-brand-accent transition-colors">Fabio</span>
        </a>
        
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Portfolio Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
