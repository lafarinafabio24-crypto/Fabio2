
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

const PrivateArea: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'clients'>('messages');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<VaultMessage[]>([]);
  const [error, setError] = useState('');
  
  const [replyTo, setReplyTo] = useState<VaultMessage | null>(null);
  const [responseContent, setResponseContent] = useState('');
  const [isSendingResponse, setIsSendingResponse] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 2000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadData = () => {
    try {
      const stored = localStorage.getItem('vault_messages');
      const raw = stored ? JSON.parse(stored) : [];
      setMessages(raw.sort((a: any, b: any) => b.id - a.id));
    } catch (e) {
      console.error("Vault Error:", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'fabio.la.farina@outlook.it' && password === 'password123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Credenziali Errate.');
    }
  };

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTo || !responseContent.trim()) return;

    setIsSendingResponse(true);
    try {
      const newMessage: VaultMessage = {
        id: Date.now(),
        sender: 'fabio.la.farina@outlook.it',
        senderName: 'Fabio (Admin)',
        recipient: replyTo.sender,
        content: responseContent,
        service: `Risposta a: ${replyTo.service}`,
        attachments: [],
        date: new Date().toLocaleString('it-IT'),
        isReply: true
      };

      const existing = JSON.parse(localStorage.getItem('vault_messages') || '[]');
      localStorage.setItem('vault_messages', JSON.stringify([newMessage, ...existing]));

      setResponseContent('');
      setReplyTo(null);
      loadData();
      alert("Risposta inviata!");
    } finally {
      setIsSendingResponse(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 bg-brand-dark">
        <div className="container mx-auto px-6 max-w-md">
          <div className="bg-white/5 p-8 border border-white/10">
            <h2 className="text-white text-xl font-black uppercase mb-6 text-center">Admin Vault Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="EMAIL" className="w-full p-4 bg-transparent border border-white/20 text-white text-xs outline-none" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="PASSWORD" className="w-full p-4 bg-transparent border border-white/20 text-white text-xs outline-none" />
              {error && <p className="text-brand-accent text-[10px] uppercase font-bold text-center">{error}</p>}
              <button type="submit" className="w-full py-4 bg-brand-accent text-white font-black uppercase text-xs">Accedi</button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="vault" className="py-24 bg-brand-dark text-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
          <h2 className="text-3xl font-black uppercase">Vault Control</h2>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 border border-white/20 text-[10px] font-black uppercase">Logout</button>
        </div>

        <div className="space-y-4">
          {replyTo && (
            <div className="bg-white p-6 text-brand-dark mb-8">
              <h3 className="font-black uppercase mb-4 text-xs">Risposta per {replyTo.sender}</h3>
              <form onSubmit={handleSendResponse} className="space-y-4">
                <textarea rows={4} value={responseContent} onChange={e => setResponseContent(e.target.value)} className="w-full p-4 border border-brand-dark/10 outline-none text-sm" placeholder="Scrivi qui..."></textarea>
                <button type="submit" className="px-8 py-3 bg-brand-accent text-white font-black uppercase text-[10px]">Invia Risposta</button>
              </form>
            </div>
          )}

          {messages.length === 0 ? (
            <p className="text-center py-20 opacity-20 uppercase font-black">Nessun messaggio</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`p-6 border border-white/5 bg-white/[0.02] flex flex-col md:flex-row gap-6 ${msg.isReply ? 'border-l-4 border-l-brand-accent' : ''}`}>
                <div className="md:w-1/4">
                  <span className="text-[10px] text-brand-accent block mb-1">{msg.date}</span>
                  <h4 className="font-black uppercase truncate text-sm">{msg.senderName}</h4>
                  <span className="text-[9px] opacity-40 block">{msg.sender}</span>
                </div>
                <div className="flex-1 bg-black/20 p-4 rounded text-sm italic">"{msg.content}"</div>
                {!msg.isReply && (
                  <button onClick={() => setReplyTo(msg)} className="md:w-24 py-2 bg-brand-accent text-[9px] font-black uppercase self-center">Rispondi</button>
                )}
                <button onClick={() => {
                  const updated = messages.filter(m => m.id !== msg.id);
                  localStorage.setItem('vault_messages', JSON.stringify(updated));
                  loadData();
                }} className="md:w-24 py-2 border border-white/10 text-[9px] font-black uppercase self-center">Elimina</button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PrivateArea;
