'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useLang } from '../lib/LanguageContext';

const QUICK = {
  es: [
    'Tuve un accidente de auto',
    'Necesito un fideicomiso en vida',
    'Quiero mi green card',
    'Necesito un divorcio',
    'Me están deportando',
    'Necesito un poder notarial',
  ],
  en: [
    'I had a car accident',
    'I need a living trust',
    'I want a green card',
    'I need a divorce',
    'I need workers compensation',
    'I need a power of attorney',
  ]
};

export default function AsistentePage() {
  const { lang } = useLang();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const welcome = lang === 'es'
    ? '¡Hola! Soy el asistente legal de Mar Vista Law. Puedo ayudarte en español, inglés o los dos. ¿En qué te puedo ayudar hoy?'
    : 'Hello! I\'m the Mar Vista Law legal assistant. I can help you in English, Spanish, or both. What can I help you with today?';

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, lang }),
      });
      if (!res.ok) throw new Error('API error ' + res.status);
      const data = await res.json();
      setMessages([...newMsgs, { role: 'assistant', content: data.content }]);
    } catch(e) {
      setMessages([...newMsgs, { 
        role: 'assistant', 
        content: lang === 'es' 
          ? 'Hubo un error. Por favor llama al (323) 418-2252 para hablar con alguien ahora.' 
          : 'There was an error. Please call (323) 418-2252 to speak with someone now.' 
      }]);
    }
    setLoading(false);
  };

  const quick = QUICK[lang] || QUICK.es;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', color: 'white', padding: '28px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>⚖️</div>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '800', margin: '0 0 6px' }}>
          {lang === 'es' ? 'Asistente Legal Bilingüe' : 'Bilingual Legal Assistant'}
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
          {lang === 'es' 
            ? 'Disponible 24/7 · Confidencial · Gratis · Español & English' 
            : 'Available 24/7 · Confidential · Free · English & Español'}
        </p>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, maxWidth: '760px', width: '100%', margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' }}>

        {/* Welcome message */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>⚖️</div>
          <div style={{ background: 'white', borderRadius: '0 16px 16px 16px', padding: '14px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontSize: '15px', lineHeight: 1.6, color: '#1E3A8A', maxWidth: '85%' }}>
            {welcome}
          </div>
        </div>

        {/* Messages */}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.role === 'user' ? '#F59E0B' : '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
              {m.role === 'user' ? '👤' : '⚖️'}
            </div>
            <div style={{ background: m.role === 'user' ? '#EFF6FF' : 'white', borderRadius: m.role === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', fontSize: '15px', lineHeight: 1.6, color: '#1E3A8A', maxWidth: '85%', whiteSpace: 'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚖️</div>
            <div style={{ background: 'white', borderRadius: '0 16px 16px 16px', padding: '14px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#93C5FD', display: 'inline-block', animation: 'bounce 1s infinite 0s' }}>·</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60A5FA', display: 'inline-block', animation: 'bounce 1s infinite 0.2s' }}>·</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6', display: 'inline-block', animation: 'bounce 1s infinite 0.4s' }}>·</span>
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips - only show at start */}
      {messages.length === 0 && (
        <div style={{ maxWidth: '760px', width: '100%', margin: '0 auto', padding: '0 16px 12px', boxSizing: 'border-box' }}>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>
            {lang === 'es' ? 'Preguntas frecuentes:' : 'Common questions:'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quick.map(q => (
              <button key={q} onClick={() => send(q)}
                style={{ padding: '7px 14px', borderRadius: '20px', border: '1.5px solid #BFDBFE', background: 'white', color: '#1E40AF', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div style={{ background: 'white', borderTop: '1px solid #E5E7EB', padding: '12px 16px', position: 'sticky', bottom: 0 }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder={lang === 'es' ? 'Escribe tu pregunta en español o inglés...' : 'Type your question in English or Spanish...'}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '2px solid #BFDBFE', fontSize: '15px', outline: 'none', color: '#1E3A8A', background: '#F8FAFC' }}
          />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ padding: '12px 20px', borderRadius: '10px', background: input.trim() && !loading ? '#1E3A8A' : '#E5E7EB', color: input.trim() && !loading ? 'white' : '#9CA3AF', border: 'none', fontWeight: '700', fontSize: '15px', cursor: input.trim() && !loading ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
            {lang === 'es' ? 'Enviar' : 'Send'} →
          </button>
        </div>
        <div style={{ maxWidth: '760px', margin: '6px auto 0', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
            {lang === 'es' ? 'O llama: ' : 'Or call: '}
            <a href="tel:+13234182252" style={{ color: '#F59E0B', fontWeight: '700' }}>(323) 418-2252</a>
            {' · '}
            {lang === 'es' ? 'No es asesoría legal' : 'Not legal advice'}
          </span>
        </div>
      </div>
    </div>
  );
}
