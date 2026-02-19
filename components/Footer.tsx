
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-brand-dark/5 bg-brand-light">
      <div className="container mx-auto px-6 text-center">
        <div className="text-2xl font-black tracking-tighter uppercase mb-4 text-brand-dark">
          La Farina Fabio
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-brand-dark/40 text-sm tracking-widest uppercase">
            &copy; {new Date().getFullYear()} &bull; Realizzato con cura
          </p>
          <div className="w-8 h-[2px] bg-brand-accent mt-4"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
