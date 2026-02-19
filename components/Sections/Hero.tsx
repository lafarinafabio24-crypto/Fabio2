
import React from 'react';
import { ABOUT_TEXT } from '../../lib/data';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-brand-light">
      {/* Background Textures */}
      <div className="absolute inset-0 bg-grid bg-grid-size opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-dots bg-dots-size pointer-events-none opacity-50"></div>
      
      {/* Background Accents */}
      <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-[50rem] h-[50rem] bg-brand-basket/5 rounded-full blur-[160px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 relative group">
            <span className="text-brand-accent font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs py-1 px-3 border border-brand-accent/30 bg-white/50">
              Portfolio Personale 2025
            </span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-accent"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-brand-accent"></div>
          </div>
          
          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tighter uppercase leading-[0.85] mb-10 text-brand-dark">
            <span className="block mb-2">La Farina</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-brand-dark via-brand-dark/80 to-brand-dark/40">Fabio</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-brand-dark/50 font-light max-w-2xl leading-relaxed mb-14 mx-auto font-sans tracking-wide">
            {ABOUT_TEXT.tagline}
          </p>
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-dark/10 to-transparent"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <div className="w-[1px] h-16 bg-gradient-to-b from-brand-accent to-transparent"></div>
        <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-brand-dark/60">Scorri</span>
      </div>
    </section>
  );
};

export default Hero;
