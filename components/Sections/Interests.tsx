
import React from 'react';
import { INTERESTS } from '../../lib/data';
import { Interest } from '../../types';

const InterestCard: React.FC<{ interest: Interest }> = ({ interest }) => {
  return (
    <div className="group relative overflow-hidden bg-brand-light aspect-[4/5] border border-brand-dark/5 transition-all duration-500 hover:border-brand-accent/40 shadow-sm hover:shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots bg-[length:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity z-10 pointer-events-none"></div>
      
      {/* Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          src={interest.image} 
          alt={interest.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 brightness-[0.9] group-hover:brightness-[0.4]"
        />
        {/* Overlay transitions to dark on hover for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-light via-brand-light/20 to-transparent group-hover:from-brand-dark group-hover:via-brand-dark/40 transition-colors duration-500"></div>
      </div>

      {/* Frame Accents */}
      <div className="absolute top-0 left-0 w-0 h-[2px] bg-brand-accent group-hover:w-full transition-all duration-500"></div>
      <div className="absolute bottom-0 right-0 w-0 h-[2px] bg-brand-accent group-hover:w-full transition-all duration-500"></div>

      {/* Content */}
      <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
        <div className="overflow-hidden">
          <span className={`inline-block py-1 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-brand-dark border border-brand-dark/20 mb-4 transform -translate-x-full group-hover:translate-x-0 group-hover:text-white group-hover:border-white/20 transition-all duration-500`}>
            {interest.subtitle}
          </span>
        </div>
        <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none text-brand-dark group-hover:text-white transition-colors duration-500">{interest.title}</h3>
        <p className="text-sm text-brand-dark/60 leading-relaxed opacity-0 group-hover:opacity-100 group-hover:text-white/60 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 line-clamp-3">
          {interest.description}
        </p>
      </div>
    </div>
  );
};

const Interests: React.FC = () => {
  return (
    <section id="interessi" className="py-32 bg-brand-light relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-dark/5"></div>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="relative">
            <span className="text-brand-accent font-bold tracking-[0.5em] uppercase text-[10px] mb-4 block">Esplora</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-brand-dark">Interessi</h2>
          </div>
          <p className="text-brand-dark/30 text-xs md:text-sm max-w-xs font-light leading-relaxed uppercase tracking-[0.2em]">
            La fusione perfetta tra competizione atletica e narrativa visiva moderna.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-2">
          {INTERESTS.map((interest) => (
            <InterestCard key={interest.id} interest={interest} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Interests;
