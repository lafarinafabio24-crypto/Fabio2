
'use client';

import React, { useState, useRef, useEffect } from 'react';

type ViewState = 'login' | 'register' | 'dashboard';

interface Client {
  id: number;
  email: string;
  password: string;
  registeredAt: string;
}

interface VaultFile {
  name: string;
  type: string;
  data: string;
}

interface VaultMessage {
  id: number;
  sender: string;
  senderName: string;
  recipient?: string;
  content: string;
  service: string;
  attachments: VaultFile[];
  date: string;
  isReply?: boolean;
}

const ClientPortal: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [myMessages, setMyMessages] = useState<VaultMessage[]>([]);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [selectedService, setSelectedService] = useState('Creazione Logo');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const services = [
    { id: 'logo', label: 'Creazione Logo' },
    { id: 'post', label: 'Creazione Post' },
    { id: 'social', label: 'Social Media Management' },
    { id: 'strategy', label: 'Digital Strategy' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('active_client_session');
    if (saved) {
      try {
        const client = JSON.parse(saved);
        setCurrentClient(client);
        loadMyMessages(client.email);
        setView('dashboard');
      } catch (e) {
        localStorage.removeItem('active_client_session');
      }
    }
  }, []);

  const loadMyMessages = (email: string) => {
    try {
      const allRaw = localStorage.getItem('vault_messages');
      const allMessages: any[] = allRaw ? JSON.parse(allRaw) : [];
      
      const normalized = allMessages.map(m => ({
        ...m,
        attachments: m.attachments || (m.fileData ? [{ name: m.fileName, type: m.fileType, data: m.fileData }] : [])
      })).filter(m => 
        m.sender.toLowerCase() === email.toLowerCase() || 
        (m.recipient && m.recipient.toLowerCase() === email.toLowerCase())
      );
      
      normalized.sort((a, b) => b.id - a.id);
      setMyMessages(normalized);
    } catch (e) {
      console.error("Error loading messages", e);
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

  const downloadFile = (base64: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const rawClients = localStorage.getItem('registered_clients');
    const users: Client[] = rawClients ? JSON.parse(rawClients) : [];
    const exists = users.find(u => u.email.toLowerCase() === regEmail.toLowerCase());
    if (exists) {
      setError('Questa email è già registrata.');
      return;
    }
    const newUser: Client = { id: Date.now(), email: regEmail, password: regPassword, registeredAt: new Date().toLocaleString() };
    localStorage.setItem('registered_clients', JSON.stringify([newUser, ...users]));
    localStorage.setItem('active_client_session', JSON.stringify(newUser));
    setCurrentClient(newUser);
    loadMyMessages(newUser.email);
    setView('dashboard');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const rawClients = localStorage.getItem('registered_clients');
    const users: Client[] = rawClients ? JSON.parse(rawClients) : [];
    const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (user && user.password === loginPassword) {
      localStorage.setItem('active_client_session', JSON.stringify(user));
      setCurrentClient(user);
      loadMyMessages(user.email);
      setView('dashboard');
    } else {
      setError('Credenziali non valide.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('active_client_session');
    setCurrentClient(null);
    setView('login');
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;
    setIsSending(true);

    try {
      const attachmentPromises = files.map(async (f) => ({
        name: f.name,
        type: f.type,
        data: await fileToBase64(f)
      }));

      const resolvedAttachments = await Promise.all(attachmentPromises);

      const senderDisplayName = currentClient.email.split('@')[0];
      const newMessage: VaultMessage = {
        id: Date.now(),
        sender: currentClient.email,
        senderName: senderDisplayName,
        content: message,
        service: selectedService,
        attachments: resolvedAttachments,
        date: new Date().toLocaleString('it-IT'),
      };
      
      const rawMsg = localStorage.getItem('vault_messages');
      const messages = rawMsg ? JSON.parse(rawMsg) : [];
      localStorage.setItem('vault_messages', JSON.stringify([newMessage, ...messages]));
      
      alert("Richiesta inviata con successo!");
      setMessage('');
      setFiles([]);
      loadMyMessages(currentClient.email);
    } catch (err) {
      alert("Errore allegati.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="client-portal" className="py-32 bg-brand-light relative overflow-hidden border-t border-brand-dark/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-brand-accent font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Client Hub</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-brand-dark mb-6">Portale Clienti</h2>
          </div>

          <div className="bg-white shadow-2xl border border-brand-dark/5 overflow-hidden">
            {view !== 'dashboard' && (
              <div className="flex border-b border-brand-dark/5">
                <button onClick={() => setView('login')} className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${view === 'login' ? 'bg-brand-dark text-white' : 'bg-white'}`}>Accedi</button>
                <button onClick={() => setView('register')} className={`flex-1 py-6 text-xs font-black uppercase tracking-widest transition-all ${view === 'register' ? 'bg-brand-dark text-white' : 'bg-white'}`}>Registrati</button>
              </div>
            )}

            <div className="p-8 md:p-12">
              {view === 'login' && (
                <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto py-10">
                  <input type="email" required placeholder="EMAIL" className="w-full p-4 bg-brand-light/20 border border-brand-dark/10 font-bold text-xs uppercase outline-none focus:border-brand-accent" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                  <input type="password" required placeholder="PASSWORD" className="w-full p-4 bg-brand-light/20 border border-brand-dark/10 font-bold text-xs uppercase outline-none focus:border-brand-accent" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                  {error && <p className="text-[10px] text-brand-accent font-black uppercase text-center">{error}</p>}
                  <button type="submit" className="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs hover:bg-brand-accent transition-all">Entra</button>
                </form>
              )}

              {view === 'register' && (
                <form onSubmit={handleRegister} className="space-y-6 max-w-md mx-auto py-10">
                  <input type="email" placeholder="NUOVA EMAIL" required className="w-full p-4 bg-brand-light/20 border border-brand-dark/10 font-bold text-xs uppercase outline-none focus:border-brand-accent" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                  <input type="password" placeholder="PASSWORD" required className="w-full p-4 bg-brand-light/20 border border-brand-dark/10 font-bold text-xs uppercase outline-none focus:border-brand-accent" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                  {error && <p className="text-[10px] text-brand-accent font-black uppercase text-center">{error}</p>}
                  <button type="submit" className="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs hover:bg-brand-accent transition-all">Crea Account</button>
                </form>
              )}

              {view === 'dashboard' && currentClient && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-6">
                    <div className="flex justify-between items-center mb-8 border-b border-brand-dark/5 pb-4">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-brand-dark">Nuova Richiesta</h3>
                      <button onClick={handleLogout} className="text-[10px] font-black uppercase text-brand-accent hover:underline">Esci</button>
                    </div>

                    <form onSubmit={handleSendMessage} className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-brand-dark/40">Servizio</label>
                        <div className="grid grid-cols-2 gap-2">
                          {services.map(s => (
                            <button key={s.id} type="button" onClick={() => setSelectedService(s.label)} className={`p-4 text-[10px] font-bold uppercase border transition-all ${selectedService === s.label ? 'bg-brand-dark text-white border-brand-dark shadow-md' : 'bg-brand-light/20 text-brand-dark/60 border-brand-dark/5 hover:border-brand-dark/20'}`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-brand-dark/40">Dettagli</label>
                        <textarea placeholder="Descrivi il tuo progetto..." required rows={5} className="w-full p-4 bg-brand-light/20 border border-brand-dark/10 font-medium text-sm focus:border-brand-accent transition-colors outline-none" value={message} onChange={e => setMessage(e.target.value)} />
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-brand-dark/40">Allegati</label>
                         {files.length > 0 && (
                           <div className="grid grid-cols-1 gap-2 mb-4">
                             {files.map((f, idx) => (
                               <div key={idx} className="flex items-center justify-between p-3 bg-brand-light/40 border border-brand-dark/5 rounded">
                                 <span className="text-[10px] font-bold text-brand-dark truncate">{f.name}</span>
                                 <button type="button" onClick={() => removeFile(idx)} className="text-brand-accent">×</button>
                               </div>
                             ))}
                           </div>
                         )}
                        <div onClick={() => fileInputRef.current?.click()} className="relative border-2 border-dashed border-brand-dark/10 p-8 text-center cursor-pointer hover:border-brand-accent/40 bg-brand-light/5 group transition-all">
                          <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 group-hover:text-brand-dark">Aggiungi file</div>
                        </div>
                      </div>

                      <button type="submit" disabled={isSending} className="w-full py-5 bg-brand-accent text-white font-black uppercase tracking-widest text-xs disabled:opacity-50 shadow-lg">
                        {isSending ? 'Invio...' : 'Invia Proposta'}
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-6 lg:border-l border-brand-dark/5 lg:pl-12 pt-12 lg:pt-0">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-brand-dark mb-8 border-b border-brand-dark/5 pb-4">Conversazioni nel Vault</h3>
                    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
                      {myMessages.length === 0 ? (
                        <p className="text-xs text-brand-dark/30 uppercase font-bold text-center py-10">Nessun messaggio trovato.</p>
                      ) : (
                        myMessages.map(msg => (
                          <div key={msg.id} className={`p-6 border ${msg.isReply ? 'bg-brand-dark text-white border-brand-dark' : 'bg-brand-light/30 border-brand-dark/5'} transition-all`}>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className={`text-[10px] font-black uppercase text-brand-accent`}>{msg.date}</span>
                                <h4 className="text-sm font-black uppercase tracking-tighter mt-1">{msg.senderName}</h4>
                              </div>
                              <span className={`text-[8px] font-bold px-2 py-0.5 uppercase ${msg.isReply ? 'bg-white text-brand-dark' : 'bg-brand-dark text-white'}`}>
                                {msg.service}
                              </span>
                            </div>
                            <p className="text-xs font-medium mb-6 italic leading-relaxed whitespace-pre-wrap">"{msg.content}"</p>
                            
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {msg.attachments.map((att, attIdx) => (
                                  <button 
                                    key={attIdx}
                                    onClick={() => downloadFile(att.data, att.name)} 
                                    className={`text-[9px] font-black uppercase px-3 py-2 flex items-center gap-2 border ${msg.isReply ? 'bg-white text-brand-dark border-white hover:bg-brand-accent hover:text-white' : 'bg-white text-brand-dark border-brand-dark/10 hover:bg-brand-dark hover:text-white'} transition-all`}
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3"/></svg>
                                    {att.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientPortal;
