
'use client';

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
  const [personalFiles, setPersonalFiles] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  const [replyTo, setReplyTo] = useState<VaultMessage | null>(null);
  const [newMessageTo, setNewMessageTo] = useState<RegisteredClient | null>(null);
  const [responseContent, setResponseContent] = useState('');
  const [responseFiles, setResponseFiles] = useState<File[]>([]);
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const responseFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 3000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadData = () => {
    try {
      const stored = localStorage.getItem('vault_messages');
      const raw = stored ? JSON.parse(stored) : [];
      
      const normalized = raw.map((m: any) => ({
        ...m,
        attachments: m.attachments || []
      })).sort((a: any, b: any) => b.id - a.id);
      
      setMessages(normalized);
      
      const clientsRaw = localStorage.getItem('registered_clients');
      setClients(clientsRaw ? JSON.parse(clientsRaw) : []);
      
      const personalRaw = localStorage.getItem('personal_vault_files');
      setPersonalFiles(personalRaw ? JSON.parse(personalRaw) : []);
    } catch (e) {
      console.error("Vault Data Error:", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'fabio.la.farina@outlook.it' && password === 'password123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Credenziali Amministratore Errate.');
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
    if (!targetEmail || !responseContent.trim()) return;

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
        service: replyTo ? `Risposta a: ${replyTo.service}` : 'Comunicazione Fabio',
        attachments: resolvedAttachments,
        date: new Date().toLocaleString('it-IT'),
        isReply: true
      };

      const existing = JSON.parse(localStorage.getItem('vault_messages') || '[]');
      localStorage.setItem('vault_messages', JSON.stringify([newMessage, ...existing]));

      setResponseContent('');
      setResponseFiles([]);
      setReplyTo(null);
      setNewMessageTo(null);
      loadData();
      alert("Risposta inviata al cliente!");
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

  const deleteMessage = (id: number) => {
    if (confirm('Eliminare questo messaggio permanentemente?')) {
      const updated = messages.filter(m => m.id !== id);
      localStorage.setItem('vault_messages', JSON.stringify(updated));
      loadData();
    }
  };

  return (
    <section id="vault" className="py-24 bg-brand-dark relative overflow-hidden text-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-brand-accent animate-pulse'}`}></div>
              <span className="text-brand-accent font-black tracking-[0.5em] uppercase text-[10px]">Vault Secured v8.0</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">Admin Control Panel</h2>
          </div>
          
          {isAuthenticated && (
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => setActiveTab('messages')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-brand-accent text-white' : 'text-white/40'}`}>Posta</button>
              <button onClick={() => setActiveTab('clients')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'clients' ? 'bg-brand-accent text-white' : 'text-white/40'}`}>Clienti</button>
              <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-white/10 text-white/20 text-[10px] font-black uppercase hover:border-white/40">Logout</button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="max-w-xl mx-auto py-20">
            <div className="bg-[#1a2421] border border-white/5 p-12 shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="EMAIL ADMIN" className="w-full bg-transparent border border-white/10 p-4 text-white font-bold text-xs uppercase outline-none focus:border-brand-accent" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="PASSWORD" className="w-full bg-transparent border border-white/10 p-4 text-white font-bold text-xs uppercase outline-none focus:border-brand-accent" required />
                {error && <div className="text-[10px] text-brand-accent font-black uppercase text-center animate-pulse">{error}</div>}
                <button type="submit" className="w-full py-5 bg-brand-accent text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-dark transition-all">Accedi al Vault</button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Modal per Risposta */}
            {(replyTo || newMessageTo) && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-md">
                <div className="w-full max-w-2xl bg-white text-brand-dark p-8 border border-brand-accent shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black uppercase">Risposta per: {replyTo ? replyTo.sender : newMessageTo?.email}</h3>
                    <button onClick={() => {setReplyTo(null); setNewMessageTo(null);}} className="text-2xl">&times;</button>
                  </div>
                  <form onSubmit={handleSendResponse} className="space-y-6">
                    <textarea 
                      required 
                      rows={6} 
                      value={responseContent} 
                      onChange={e => setResponseContent(e.target.value)} 
                      placeholder="Scrivi qui la tua risposta..."
                      className="w-full p-4 border border-brand-dark/10 outline-none focus:border-brand-accent"
                    />
                    <div>
                        <input type="file" multiple ref={responseFileInputRef} onChange={e => setResponseFiles(Array.from(e.target.files || []))} className="hidden" />
                        <button type="button" onClick={() => responseFileInputRef.current?.click()} className="text-[10px] font-bold uppercase underline">Allega File</button>
                        <div className="mt-2 text-[10px] opacity-60 uppercase">{responseFiles.length} file selezionati</div>
                    </div>
                    <button type="submit" disabled={isSendingResponse} className="w-full py-4 bg-brand-accent text-white font-black uppercase text-xs">
                        {isSendingResponse ? 'Invio...' : 'Invia Messaggio'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                {messages.length === 0 ? (
                  <p className="text-center py-20 text-white/20 uppercase font-black">Nessun messaggio nel Vault</p>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`p-6 border border-white/5 bg-white/[0.02] flex flex-col md:flex-row gap-6 hover:bg-white/[0.04] transition-all ${msg.isReply ? 'border-l-4 border-l-brand-accent' : ''}`}>
                      <div className="md:w-1/4">
                        <span className="text-[10px] text-brand-accent font-black uppercase">{msg.date}</span>
                        <h4 className="text-lg font-black uppercase mt-1">{msg.senderName}</h4>
                        <span className="text-[10px] opacity-40 block truncate">{msg.sender}</span>
                        <div className="mt-2 text-[9px] font-bold bg-white/10 px-2 py-1 inline-block uppercase">{msg.service}</div>
                      </div>
                      <div className="flex-1 bg-black/20 p-5 rounded italic text-sm text-white/80">
                        "{msg.content}"
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.attachments.map((att, i) => (
                            <button key={i} onClick={() => downloadFile(att.data, att.name)} className="text-[9px] bg-white text-brand-dark px-2 py-1 uppercase font-bold">File {i+1}</button>
                          ))}
                        </div>
                      </div>
                      <div className="md:w-32 flex md:flex-col gap-2">
                        {!msg.isReply && (
                          <button onClick={() => setReplyTo(msg)} className="flex-1 py-2 bg-brand-accent text-white text-[9px] font-black uppercase">Rispondi</button>
                        )}
                        <button onClick={() => deleteMessage(msg.id)} className="flex-1 py-2 border border-white/10 text-[9px] font-black uppercase">Elimina</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clients.map(c => (
                  <div key={c.id} className="p-6 border border-white/5 bg-white/[0.02] group">
                    <span className="text-[9px] text-brand-accent font-black uppercase">{c.registeredAt}</span>
                    <h4 className="text-xl font-black uppercase mt-1">{c.email.split('@')[0]}</h4>
                    <p className="text-[10px] opacity-40 mb-4">{c.email}</p>
                    <button onClick={() => setNewMessageTo(c)} className="w-full py-3 bg-white text-brand-dark text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all">Contatta</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PrivateArea;
