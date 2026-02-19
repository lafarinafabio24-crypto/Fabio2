
'use client';

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
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
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
    if (isSubmitting) return;
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

      const existingRaw = localStorage.getItem('vault_messages');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('vault_messages', JSON.stringify([newRequest, ...existing]));

      alert("Richiesta inviata con successo al Vault di Fabio!");
      setFormData({ name: '', email: '', description: '' });
      setFiles([]);
    } catch (err) {
      alert("Errore nell'invio. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contatti" className="py-32 relative bg-brand-light">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-brand-accent font-black tracking-widest uppercase text-[10px] mb-4 block">Direct Access</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-brand-dark mb-4">Pipeline Vault</h2>
            <p className="text-brand-dark/40 uppercase tracking-widest text-[10px]">Invia la tua proposta direttamente nell'area protetta</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-3">
             <div className="text-[10px] font-black uppercase text-brand-dark/30 mb-4">Servizio</div>
             {services.map(s => (
                <button 
                    key={s.id} 
                    onClick={() => setSelectedService(s.label)}
                    className={`w-full p-6 text-left border transition-all ${selectedService === s.label ? 'bg-brand-dark text-white border-brand-dark scale-105 shadow-xl' : 'bg-white border-brand-dark/5 text-brand-dark hover:border-brand-accent'}`}
                >
                    <span className="text-xl mr-4">{s.emoji}</span>
                    <span className="font-black uppercase text-xs tracking-widest">{s.label}</span>
                </button>
             ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" required placeholder="NOME" value={formData.name} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-dark/5 font-bold text-xs uppercase outline-none focus:border-brand-accent" />
                <input type="email" name="email" required placeholder="EMAIL" value={formData.email} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-dark/5 font-bold text-xs uppercase outline-none focus:border-brand-accent" />
            </div>
            <textarea name="description" required rows={5} placeholder="RACCONTAMI IL PROGETTO..." value={formData.description} onChange={handleInputChange} className="w-full p-4 bg-white border border-brand-dark/5 font-medium text-sm outline-none focus:border-brand-accent resize-none" />
            
            <div onClick={() => fileInputRef.current?.click()} className="p-8 border-2 border-dashed border-brand-dark/10 text-center cursor-pointer hover:bg-white transition-all group">
                <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <span className="text-[10px] font-bold text-brand-dark/40 uppercase group-hover:text-brand-accent">Aggiungi Allegati ({files.length})</span>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs hover:bg-brand-accent transition-all">
                {isSubmitting ? 'Archiviazione...' : 'Invia al Vault'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
