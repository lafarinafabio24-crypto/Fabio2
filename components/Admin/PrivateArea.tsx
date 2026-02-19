
import React, { useState, useEffect, useRef } from 'react';

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

interface PersonalFile {
  id: number;
  name: string;
  type: string;
  data: string;
  date: string;
}

interface RegisteredClient {
  id: number;
  email: string;
  registeredAt: string;
}

const PrivateArea: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'clients' | 'personal'>('messages');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<VaultMessage[]>([]);
  const [clients, setClients] = useState<RegisteredClient[]>([]);
  const [personalFiles, setPersonalFiles] = useState<PersonalFile[]>([]);
  const [error, setError] = useState('');
  
  const [replyTo, setReplyTo] = useState<VaultMessage | null>(null);
  const [newMessageTo, setNewMessageTo] = useState<RegisteredClient | null>(null);
  const [responseContent, setResponseContent] = useState('');
  const [responseFiles, setResponseFiles] = useState<File[]>([]);
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const responseFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      // Auto-refresh ogni 30 secondi per simulare arrivo real-time
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadData = () => {
    const rawMessages: any[] = JSON.parse(localStorage.getItem('vault_messages') || '[]');
    // Normalizzazione sicura per ogni messaggio
    const normalizedMessages = rawMessages.map(m => ({
      ...m,
      attachments: m.attachments || (m.fileData ? [{ name: m.fileName, type: m.fileType, data: m.fileData }] : [])
    }));
    
    // Ordina per ID decrescente (più recenti in alto)
    normalizedMessages.sort((a, b) => b.id - a.id);
    
    setMessages(normalizedMessages);
    setClients(JSON.parse(localStorage.getItem('registered_clients') || '[]'));
    setPersonalFiles(JSON.parse(localStorage.getItem('personal_vault_files') || '[]'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'fabio.la.farina@outlook.it' && password === 'password123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Chiave non valida.');
      setTimeout(() => setError(''), 3000);
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

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = replyTo ? replyTo.sender : newMessageTo?.email;
    if (!targetEmail) return;

    setIsSendingResponse(true);
    try {
      const attachmentPromises = responseFiles.map(async (f) => ({
        name: f.name,
        type: f.type,
        data: await fileToBase64(f)
      }));

      const resolvedAttachments = await Promise.all(attachmentPromises);

      const newMessage: VaultMessage = {
        id: Date.now(),
        sender: 'fabio.la.farina@outlook.it',
        senderName: 'Fabio (Admin)',
        recipient: targetEmail,
        content: responseContent,
        service: replyTo ? `Risposta a: ${replyTo.service}` : 'Comunicazione Vault',
        attachments: resolvedAttachments,
        date: new Date().toLocaleString('it-IT'),
        isReply: true
      };

      const existingMessages = JSON.parse(localStorage.getItem('vault_messages') || '[]');
      const updatedMessages = [newMessage, ...existingMessages];
      localStorage.setItem('vault_messages', JSON.stringify(updatedMessages));

      setResponseContent('');
      setResponseFiles([]);
      setReplyTo(null);
      setNewMessageTo(null);
      loadData(); // Ricarica immediata
      alert("Messaggio inviato correttamente!");
    } catch (err) {
      alert("Errore nell'invio della risposta.");
    } finally {
      setIsSendingResponse(false);
    }
  };

  const downloadFile = (base64: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="vault" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-brand-accent animate-pulse'}`}></div>
              <span className="text-brand-accent font-black tracking-[0.5em] uppercase text-[10px]">Vault Protocol v7.2</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Fabio Vault</h2>
          </div>
          
          {isAuthenticated && (
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
              <button onClick={() => { loadData(); setActiveTab('messages'); }} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-brand-accent text-white' : 'text-white/40'}`}>Posta ({messages.length})</button>
              <button onClick={() => setActiveTab('clients')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clients' ? 'bg-brand-accent text-white' : 'text-white/40'}`}>Clienti</button>
              <button onClick={() => setActiveTab('personal')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'personal' ? 'bg-brand-accent text-white' : 'text-white/40'}`}>Asset Privati</button>
              <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-white/10 text-white/20 text-[10px] font-black uppercase hover:border-white/40 transition-all">Logout</button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="max-w-xl mx-auto py-10">
            <div className="bg-[#1a2421] border border-white/5 p-12 shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Admin ID</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="FABIO.LA.FARINA@OUTLOOK.IT" className="w-full bg-transparent border border-white/10 p-4 text-white font-bold text-xs uppercase outline-none focus:border-brand-accent" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Security Key</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-transparent border border-white/10 p-4 text-white font-bold text-xs uppercase outline-none focus:border-brand-accent" required />
                </div>
                {error && <div className="text-[10px] text-brand-accent font-black uppercase text-center tracking-widest animate-bounce">{error}</div>}
                <button type="submit" className="w-full py-5 bg-brand-accent text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-dark transition-all">Sblocca Vault</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Modal Invio Risposta */}
            {(replyTo || newMessageTo) && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-xl">
                <div className="w-full max-w-2xl bg-white p-8 md:p-12 border border-brand-dark shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-8 border-b border-brand-dark/5 pb-4">
                    <div>
                      <span className="text-brand-accent text-[9px] font-black uppercase tracking-widest">Risposta Ufficiale</span>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-brand-dark">
                        A: {replyTo ? replyTo.sender : newMessageTo?.email}
                      </h3>
                    </div>
                    <button onClick={() => {setReplyTo(null); setNewMessageTo(null);}} className="text-brand-dark/40 hover:text-brand-accent text-3xl font-light">×</button>
                  </div>
                  <form onSubmit={handleSendResponse} className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-brand-dark/40 mb-2">Testo Messaggio</label>
                      <textarea 
                        required
                        rows={6}
                        value={responseContent}
                        onChange={(e) => setResponseContent(e.target.value)}
                        placeholder="Comunica qui le tue decisioni o feedback..."
                        className="w-full p-4 bg-brand-light/20 border border-brand-dark/10 font-medium text-sm outline-none focus:border-brand-accent resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-brand-dark/40 mb-2">Allegati Risposta ({responseFiles.length})</label>
                      <input type="file" multiple ref={responseFileInputRef} onChange={(e) => setResponseFiles(Array.from(e.target.files || []))} className="hidden" />
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {responseFiles.map((f, i) => (
                          <div key={i} className="px-3 py-1.5 bg-brand-dark text-white text-[9px] font-bold uppercase flex items-center gap-2 rounded-sm shadow-sm">
                            <span className="truncate max-w-[120px]">{f.name}</span>
                            <button type="button" onClick={() => setResponseFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-brand-accent hover:text-white">×</button>
                          </div>
                        ))}
                      </div>
                      
                      <button type="button" onClick={() => responseFileInputRef.current?.click()} className="w-full py-4 border-2 border-dashed border-brand-dark/10 text-brand-dark/40 text-[10px] font-black uppercase hover:border-brand-accent hover:text-brand-accent transition-all">
                        Seleziona Asset da allegare
                      </button>
                    </div>
                    <button type="submit" disabled={isSendingResponse} className="w-full py-5 bg-brand-dark text-white font-black uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-brand-accent transition-all shadow-xl">
                      {isSendingResponse ? 'Invio in corso...' : 'Invia Messaggio Verificato'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Totale messaggi: {messages.length}</span>
                  <button onClick={loadData} className="text-[9px] font-black uppercase text-brand-accent border border-brand-accent/20 px-3 py-1 hover:bg-brand-accent hover:text-white transition-all">Aggiorna Posta</button>
                </div>
                
                {messages.length === 0 ? (
                  <div className="py-32 text-center border border-dashed border-white/5 rounded-lg">
                    <p className="text-white/20 uppercase font-black tracking-[0.5em]">Nessuna attività registrata</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`bg-white/[0.02] border border-white/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:bg-white/[0.04] transition-all relative group ${msg.isReply ? 'bg-brand-accent/5 border-l-4 border-l-brand-accent' : ''}`}>
                      <div className="md:w-1/4">
                        <span className="text-[10px] text-brand-accent font-black uppercase block mb-1">{msg.date}</span>
                        <div className={`inline-block px-3 py-1 rounded-sm ${msg.isReply ? 'bg-white text-brand-dark' : 'bg-brand-accent text-white'} text-[8px] font-black uppercase mb-3 shadow-sm`}>
                          {msg.isReply ? 'SENT BY FABIO' : msg.service}
                        </div>
                        <h4 className="text-xl font-black uppercase text-white truncate group-hover:text-brand-accent transition-colors">{msg.senderName}</h4>
                        <span className="text-[10px] text-white/30 truncate block mb-4">{msg.sender}</span>
                        {msg.recipient && <div className="text-[9px] font-bold text-brand-accent/60 uppercase">Destinatario: {msg.recipient}</div>}
                      </div>
                      
                      <div className="flex-1 bg-black/20 p-6 md:p-8 rounded border border-white/5 relative shadow-inner">
                        <p className="text-sm md:text-base text-white/70 font-light leading-relaxed whitespace-pre-wrap italic">
                          "{msg.content}"
                        </p>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                            {msg.attachments.map((att, attIdx) => (
                              <button key={attIdx} onClick={() => downloadFile(att.data, att.name)} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 text-[10px] font-black uppercase text-white/60 hover:bg-white hover:text-brand-dark transition-all group/file truncate">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3"/></svg>
                                {att.name}
                              </button>
                            ))}
                          </div>
                        )}

                        {!msg.isReply && (
                          <div className="mt-8 flex gap-4">
                            <button onClick={() => setReplyTo(msg)} className="bg-brand-accent text-white px-6 py-2.5 text-[10px] font-black uppercase hover:bg-white hover:text-brand-dark transition-all flex items-center gap-2 shadow-lg">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                              Rispondi ora
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <button onClick={() => { if(confirm('Eliminare definitivamente?')) {
                        const updated = messages.filter(m => m.id !== msg.id);
                        localStorage.setItem('vault_messages', JSON.stringify(updated));
                        loadData();
                      }}} className="md:w-12 py-4 md:py-0 flex items-center justify-center border border-white/5 text-white/10 hover:bg-brand-accent hover:text-white transition-all opacity-0 group-hover:opacity-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.length === 0 ? (
                  <p className="col-span-full py-20 text-center text-white/10 uppercase font-black tracking-widest">Nessun cliente registrato</p>
                ) : (
                  clients.map(client => (
                    <div key={client.id} className="bg-white/[0.02] border border-white/5 p-8 group hover:border-brand-accent/40 transition-all shadow-xl">
                      <span className="text-[9px] font-bold text-brand-accent uppercase mb-3 block opacity-50 tracking-widest">{client.registeredAt}</span>
                      <h4 className="text-2xl font-black uppercase text-white mb-2 group-hover:text-brand-accent transition-colors">{client.email.split('@')[0]}</h4>
                      <p className="text-[10px] text-white/40 font-bold uppercase truncate mb-8 tracking-widest">{client.email}</p>
                      <button onClick={() => setNewMessageTo(client)} className="w-full py-4 bg-brand-accent text-white text-[11px] font-black uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                        Scrivi al Cliente
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-white/[0.03] p-10 border border-white/10 gap-8">
                  <div>
                    <h3 className="text-3xl font-black uppercase text-white mb-1">Archivio Asset</h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em]">Repository Documenti Personali Fabio</p>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto bg-brand-accent text-white px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-white hover:text-brand-dark transition-all shadow-[0_10px_30px_rgba(230,57,70,0.3)]">
                    {isUploading ? 'Salvataggio in corso...' : 'Aggiungi Nuovo Asset'}
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" multiple onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;
                    setIsUploading(true);
                    try {
                      const uploadPromises = files.map(async (file) => {
                        const base64 = await fileToBase64(file);
                        return { id: Date.now() + Math.random(), name: file.name, type: file.type, data: base64, date: new Date().toLocaleString() };
                      });
                      const newFiles = await Promise.all(uploadPromises);
                      const existing = JSON.parse(localStorage.getItem('personal_vault_files') || '[]');
                      localStorage.setItem('personal_vault_files', JSON.stringify([...newFiles, ...existing]));
                      loadData();
                    } finally { setIsUploading(false); }
                  }} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {personalFiles.map(file => (
                    <div key={file.id} className="bg-white/[0.02] border border-white/5 p-6 group hover:bg-white/[0.05] transition-all">
                      <div className="text-[9px] text-brand-accent font-black uppercase mb-3 tracking-widest">{file.date}</div>
                      <h4 className="text-xs font-black text-white truncate mb-8 uppercase tracking-[0.1em]">{file.name}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => downloadFile(file.data, file.name)} className="flex-1 py-3 bg-white text-brand-dark text-[9px] font-black uppercase hover:bg-brand-accent hover:text-white transition-all shadow-md">Scarica</button>
                        <button onClick={() => { if(confirm('Eliminare permanentemente questo asset?')) {
                          const updated = personalFiles.filter(f => f.id !== file.id);
                          localStorage.setItem('personal_vault_files', JSON.stringify(updated));
                          loadData();
                        }}} className="w-12 py-3 border border-brand-accent/30 text-brand-accent flex items-center justify-center hover:bg-brand-accent hover:text-white transition-all">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PrivateArea;
