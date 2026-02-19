'use client';

import React, { useState, useRef, useEffect } from 'react';

const Contact: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedService, setSelectedService] = useState('Creazione Post');
  const [formData, setFormData] = useState({ name: '', email: '', description: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const attachmentPromises = files.map(async (f) => ({
        name: f.name,
        type: f.type,
        data: await fileToBase64(f)
      }));

      const resolvedAttachments = await Promise.all(attachmentPromises);

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

      const existingMessages = JSON.parse(localStorage.getItem('vault_messages') || '[]');
      const updatedMessages = [newRequest, ...existingMessages];
      localStorage.setItem('vault_messages', JSON.stringify(updatedMessages));

      alert("Richiesta archiviata con successo nel Vault di Fabio.");
      setFormData({ name: '', email: '', description: '' });
      setFiles([]);
    } catch (err) {
      alert("Errore tecnico durante l'invio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <section id="contatti" className="py-40 relative overflow-hidden bg-brand-light">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none"></div>
      
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
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.label)}
                  className={`group relative p-6 text-left transition-all duration-500 overflow-hidden border ${
                    selectedService === service.label 
                    ? 'bg-brand-dark border-brand-dark text-white shadow-2xl scale-[1.02]' 
                    : 'bg-white/50 border-brand-dark/5 text-brand-dark hover:border-brand-dark/20'
                  }`}
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-4">
                      <span className="text-2xl">{service.emoji}</span>
                      <span className="font-black uppercase tracking-[0.2em] text-xs">{service.label}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Il tuo Nome" className="w-full bg-white/50 border border-brand-dark/10 p-4 text-brand-dark outline-none focus:border-brand-accent font-bold text-sm" />
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email Privata" className="w-full bg-white/50 border border-brand-dark/10 p-4 text-brand-dark outline-none focus:border-brand-accent font-bold text-sm" />
              </div>
              <textarea name="description" required value={formData.description} onChange={handleInputChange} rows={5} placeholder="Messaggio per il Vault..." className="w-full bg-white/50 border border-brand-dark/10 p-4 text-brand-dark outline-none focus:border-brand-accent font-medium text-sm resize-none"></textarea>
              
              <div onClick={() => fileInputRef.current?.click()} className="w-full cursor-pointer border-2 border-dashed border-brand-dark/10 hover:border-brand-accent p-6 text-center transition-all">
                <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} className="hidden" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40">Allegati (opzionale)</span>
                {files.length > 0 && <p className="mt-2 text-[10px] font-bold text-brand-accent">{files.length} file selezionati</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-brand-dark text-white font-black uppercase tracking-[0.5em] text-xs transition-all hover:bg-brand-accent disabled:opacity-50">
                {isSubmitting ? 'Inviando...' : 'Archivia Richiesta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;