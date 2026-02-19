
import React from 'react';

const About: React.FC = () => {
  const profileImageId = '1emqoY6L_Su2A27NgMLPbDQ3Tp43nLUnb';
  const imageUrl = `https://lh3.googleusercontent.com/d/${profileImageId}`;

  return (
    <section id="about" className="py-40 relative overflow-hidden bg-brand-light">
      <div className="absolute inset-0 bg-dots bg-[length:32px_32px] opacity-[0.06] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Image Sidebar */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32">
              <div className="relative group">
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-brand-accent z-20"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-brand-accent z-20"></div>
                
                <div className="aspect-[3/4] bg-brand-dark/5 overflow-hidden border border-brand-dark/10 relative shadow-2xl">
                  <img 
                    src={imageUrl} 
                    alt="Ritratto di La Farina Fabio"
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-accent/30 shadow-[0_0_10px_rgba(230,57,70,0.5)] opacity-0 group-hover:animate-[scan_3s_linear_infinite]"></div>
                </div>

                <div className="absolute top-10 -right-4 bg-brand-dark border border-white/20 py-2 px-6 backdrop-blur-md z-20 transform rotate-90 origin-right shadow-lg">
                  <span className="text-[10px] tracking-[0.5em] font-bold uppercase text-white/60 italic">
                    CORE SYSTEM
                  </span>
                </div>
              </div>
              
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 bg-brand-accent group-hover:scale-150 transition-transform"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Efficiency Focus</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-2 h-2 bg-brand-dark group-hover:scale-150 transition-transform"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40">Continuous Study</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="lg:col-span-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-12 bg-brand-accent"></div>
                <span className="text-brand-accent font-black tracking-[0.5em] uppercase text-xs">Genesi Professionale</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.85] text-brand-dark">
                REALTÀ E <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark via-brand-dark/60 to-brand-dark/20">FORMAZIONE</span>
              </h2>

              <p className="text-2xl md:text-3xl text-brand-dark font-light leading-snug mb-16 border-l-4 border-brand-accent/50 pl-8 italic">
                "Il mio background non è costruito su carta patinata, ma su turni in fabbrica e studio costante. Un mix di pragmatismo operaio e visione digitale."
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Manual Experience */}
                <div className="relative p-8 bg-white/40 border border-brand-dark/5 backdrop-blur-sm group hover:border-brand-accent/30 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🛠️</span>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-brand-dark">Esperienza sul Campo</h3>
                  </div>
                  <h4 className="text-brand-accent font-bold uppercase text-[10px] tracking-[0.2em] mb-4">Lavoro Operativo</h4>
                  <p className="text-sm text-brand-dark/60 leading-relaxed font-light">
                    Dalle linee di produzione in fabbrica alle consegne come fattorino. Esperienze concrete che mi hanno insegnato la disciplina, la gestione della fatica e la capacità di risolvere problemi in tempo reale. Non temo il lavoro sporco o i ritmi serrati: lì si impara la vera adattabilità.
                  </p>
                </div>

                {/* Digital Evolution */}
                <div className="relative p-8 bg-brand-dark border border-brand-dark text-white group hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🧠</span>
                    <h3 className="text-xl font-black uppercase tracking-tighter">Evoluzione Digitale</h3>
                  </div>
                  <h4 className="text-brand-accent font-bold uppercase text-[10px] tracking-[0.2em] mb-4">AI & Social Media</h4>
                  <p className="text-sm text-white/60 leading-relaxed font-light">
                    Formazione dedicata all'Intelligenza Artificiale e al Social Media Management. Studio come integrare le nuove tecnologie nei processi di comunicazione per ottimizzare i risultati. È il ponte tra la concretezza del lavoro manuale e le potenzialità del digitale.
                  </p>
                </div>
              </div>

              {/* Decorative timeline or status bar */}
              <div className="mt-20 p-6 border-y border-brand-dark/5 flex flex-wrap gap-8 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark/40">Status: Evolving</span>
                </div>
                <div className="flex gap-6">
                  {['Fabbrica', 'Logistica', 'Digital Marketing', 'AI Solutions'].map((milestone, idx) => (
                    <div key={milestone} className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-brand-dark/20">0{idx+1}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
};

export default About;
