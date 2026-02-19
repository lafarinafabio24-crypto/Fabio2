
import React, { useState, useEffect } from 'react';

const ClientPortal: React.FC = () => {
  const [view, setView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('active_client_session');
    if (saved) {
      const client = JSON.parse(saved);
      setCurrentClient(client);
      setView('dashboard');
      loadMessages(client.email);
    }
  }, []);

  const loadMessages = (clientEmail: string) => {
    const all = JSON.parse(localStorage.getItem('vault_messages') || '[]');
    const filtered = all.filter((m: any) => 
      m.sender.toLowerCase() === clientEmail.toLowerCase() || 
      (m.recipient && m.recipient.toLowerCase() === clientEmail.toLowerCase())
    ).sort((a: any, b: any) => b.id - a.id);
    setMessages(filtered);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('registered_clients') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('active_client_session', JSON.stringify(user));
      setCurrentClient(user);
      setView('dashboard');
      loadMessages(user.email);
    } else {
      setError('Credenziali non valide.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('registered_clients') || '[]');
    if (users.find((u: any) => u.email === email)) {
      setError('Email già in uso.');
      return;
    }
    const newUser = { id: Date.now(), email, password, registeredAt: new Date().toLocaleString() };
    localStorage.setItem('registered_clients', JSON.stringify([newUser, ...users]));
    localStorage.setItem('active_client_session', JSON.stringify(newUser));
    setCurrentClient(newUser);
    setView('dashboard');
    loadMessages(email);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: currentClient.email,
      senderName: currentClient.email.split('@')[0],
      content: newMessage,
      service: 'Messaggio Diretto',
      attachments: [],
      date: new Date().toLocaleString('it-IT')
    };
    const all = JSON.parse(localStorage.getItem('vault_messages') || '[]');
    localStorage.setItem('vault_messages', JSON.stringify([msg, ...all]));
    setNewMessage('');
    loadMessages(currentClient.email);
    alert("Inviato!");
  };

  return (
    <section id="client-portal" className="py-24 bg-brand-light border-y border-brand-dark/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-black uppercase text-center mb-12">Area Clienti</h2>
        
        <div className="bg-white p-8 border border-brand-dark/5 shadow-2xl">
          {view === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black uppercase text-xs">Nuovo Messaggio</h3>
                  <button onClick={() => { localStorage.removeItem('active_client_session'); setView('login'); }} className="text-[10px] font-bold underline opacity-40">Esci</button>
                </div>
                <form onSubmit={sendMessage} className="space-y-4">
                  <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} required rows={5} className="w-full p-4 bg-brand-light/20 border border-brand-dark/5 outline-none text-sm" placeholder="Scrivi a Fabio..."></textarea>
                  <button type="submit" className="w-full py-4 bg-brand-dark text-white font-black uppercase text-xs">Invia al Vault</button>
                </form>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-brand-dark/5 pt-8 md:pt-0 md:pl-8">
                <h3 className="font-black uppercase text-xs mb-6">Conversazioni</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {messages.length === 0 ? <p className="text-[10px] opacity-20 uppercase font-bold text-center py-10">Nessun messaggio</p> : 
                    messages.map(m => (
                      <div key={m.id} className={`p-4 border ${m.isReply ? 'bg-brand-dark text-white' : 'bg-brand-light/30 border-brand-dark/5'}`}>
                        <div className="flex justify-between mb-2">
                          <span className="text-[8px] font-black">{m.date}</span>
                          <span className="text-[8px] font-black opacity-50 uppercase">{m.senderName}</span>
                        </div>
                        <p className="text-xs italic leading-relaxed">"{m.content}"</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xs mx-auto text-center">
              <div className="flex gap-2 mb-8">
                <button onClick={() => setView('login')} className={`flex-1 py-3 text-[10px] font-black uppercase border ${view === 'login' ? 'bg-brand-dark text-white' : ''}`}>Login</button>
                <button onClick={() => setView('register')} className={`flex-1 py-3 text-[10px] font-black uppercase border ${view === 'register' ? 'bg-brand-dark text-white' : ''}`}>Registrati</button>
              </div>
              <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
                <input type="email" placeholder="EMAIL" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 bg-brand-light/20 border-brand-dark/5 text-xs outline-none" required />
                <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 bg-brand-light/20 border-brand-dark/5 text-xs outline-none" required />
                {error && <p className="text-brand-accent text-[10px] uppercase font-bold">{error}</p>}
                <button type="submit" className="w-full py-4 bg-brand-dark text-white font-black uppercase text-xs">Conferma</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClientPortal;
