
import React, { useState, useRef } from 'react';

const Contact: React.FC = () => {
  const [selectedService, setSelectedService] = useState('Creazione Post');
  const [formData, setFormData] = useState({ name: '', email: '', description: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const services = [
    { id: 'logo', label: 'Creazione Logo', emoji: '🎨' },
    { id: 'post', label: 'Creazione Post', emoji: '📱' },
    { id: 'social', label: 'Social Media Management', emoji: '🚀' },
    { id: 'strategy', label: 'Digital Strategy', emoji: '📊' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Conversione file in Base64 per il Vault (Sincronizzato)
      const attachmentPromises = files.map(async (f) => ({
        name: f.name,
        type: f.type,
        data: await fileToBase64(f)
      }));

      const resolvedAttachments = await Promise.all(attachmentPromises);

      // Struttura messaggio robusta per il Vault di Fabio
      const newRequest = {
        id: Date.now(),
        date: new Date().toLocaleString('it-IT'),
        sender: formData.email.trim(),
        senderName: formData.name.trim(),
        content: formData.description.trim(),
        service: selectedService,
        attachments: resolvedAttachments,
        isReply: false
      };

      // Aggiornamento atomico del localStorage
      const existingMessages = JSON.parse(localStorage.getItem('vault_messages') || '[]');
      const updatedMessages = [newRequest, ...existingMessages];
      localStorage.setItem('vault_messages', JSON.stringify(updatedMessages));

      alert("Richiesta archiviata con successo nel Vault di Fabio. Riceverai risposta presto!");
      setFormData({ name: '', email: '', description: '' });
      setFiles([]);
    } catch (err) {
      alert("Errore tecnico durante l'invio. Riprova.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contatti" className="py-40 relative overflow-hidden bg-brand-light">
      <div className="absolute inset-0 bg-grid bg-grid-size opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-[1px] bg-brand-accent"></div>
            <span className="text-brand-accent font-black tracking-[0.5em] uppercase text-[10px]">Secure Vault Send</span>
            <div className="w-10 h-[1px] bg-brand-accent"></div>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none text-brand-dark">
            Direct <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-dark/30">Pipeline</span>
          </h2>
          <p className="text-lg text-brand-dark/50 max-w-xl mx-auto font-light leading-relaxed">
            Invia la tua proposta direttamente nel sistema protetto di Fabio. <br />
            Nessun intermediario, solo pixel e strategia.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.3em] mb-6">
              01 // Seleziona il Servizio
            </div>
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.label)}
                  className={`group relative p-6 text-left transition-all duration-500 overflow-hidden border ${
                    selectedService === service.label 
                    ? 'bg-brand-dark border-brand-dark text-white shadow-2xl scale-[1.02]' 
                    : 'bg-white/50 border-brand-dark/5 text-brand-dark hover:border-brand-dark/20'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-4">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{service.emoji}</span>
                      <span className="font-black uppercase tracking-[0.2em] text-xs">{service.label}</span>
                    </span>
                    {selectedService === service.label && (
                      <div className="w-2 h-2 bg-brand-accent shadow-[0_0_10px_rgba(230,57,70,0.8)] animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.3em] mb-6">
              02 // Modulo di Comunicazione
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-brand-dark/40 mb-2 ml-1">Il tuo Nome</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Esempio: Marco Rossi"
                    className="w-full bg-white/50 border border-brand-dark/10 p-4 text-brand-dark outline-none focus:border-brand-accent transition-all font-bold text-sm shadow-sm"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-brand-dark/40 mb-2 ml-1">Email Privata</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@provider.com"
                    className="w-full bg-white/50 border border-brand-dark/10 p-4 text-brand-dark outline-none focus:border-brand-accent transition-all font-bold text-sm shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-brand-dark/40 mb-2 ml-1">Messaggio per il Vault</label>
                <textarea 
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder={`Descrivi cosa hai in mente per: ${selectedService}...`}
                  className="w-full bg-white/50 border border-brand-dark/10 p-4 text-brand-dark outline-none focus:border-brand-accent transition-all font-medium text-sm resize-none shadow-sm"
                ></textarea>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase text-brand-dark/40 mb-2 ml-1">Documentazione / Briefing</label>
                
                {files.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 gap-2">
                    {files.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/80 border border-brand-dark/5 rounded-sm group shadow-md animate-in slide-in-from-left-2">
                        <span className="text-[10px] font-bold text-brand-dark uppercase truncate max-w-[80%]">{f.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)}
                          className="text-brand-accent p-1 hover:bg-brand-accent hover:text-white rounded-full transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full cursor-pointer border-2 border-dashed border-brand-dark/10 hover:border-brand-accent hover:bg-white/50 p-10 text-center transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-10 h-10 text-brand-dark/10 group-hover:text-brand-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40 group-hover:text-brand-dark">
                      Trascina o clicca per allegare file
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-brand-dark text-white font-black uppercase tracking-[0.5em] text-xs transition-all hover:bg-brand-accent hover:shadow-[0_20px_40px_rgba(230,57,70,0.3)] shadow-2xl disabled:opacity-50"
              >
                {isSubmitting ? 'Inviando al Vault...' : 'Archivia Richiesta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
