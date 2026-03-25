'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { PRODUCTS } from '../lib/asistente-system-prompt';

// ─── Icons ───────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="5" r="1" fill="currentColor" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.5" />
  </svg>
);

// ─── Product grid fallback ─────────────────────────────────────────────────
function ProductGrid() {
  return (
    <div style={{ padding: '24px 16px' }}>
      <p style={{ color: '#6B7280', marginBottom: '20px', textAlign: 'center', fontSize: '15px' }}>
        Aquí están todos nuestros servicios disponibles:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {PRODUCTS.map((p) => (
          <Link
            key={p.id}
            href={p.path}
            style={{
              display: 'block',
              padding: '14px 16px',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              textDecoration: 'none',
              background: 'white',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,58,138,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontWeight: '600', color: '#1E3A8A', fontSize: '13px', marginBottom: '4px' }}>{p.name_es}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>{p.name_en}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#F59E0B', marginTop: '6px' }}>{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Parse markdown-lite for bold and links ────────────────────────────────
function parseMarkdown(text) {
  if (!text) return '';
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Paths like /trust → clickable
  text = text.replace(/→ (Empieza aquí|Start here): (\/[\w-]+)/g,
    '→ <a href="$2" style="color:#F59E0B;font-weight:700;text-decoration:none;">$2 ↗</a>');
  // Line breaks
  text = text.replace(/\n/g, '<br/>');
  return text;
}

// ─── Message bubble ────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      alignItems: 'flex-end',
      gap: '8px',
    }}>
      {!isUser && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#1E3A8A', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BotIcon />
        </div>
      )}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#1E3A8A' : 'white',
        color: isUser ? 'white' : '#1F2937',
        fontSize: '15px',
        lineHeight: '1.6',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        border: isUser ? 'none' : '1px solid #E5E7EB',
      }}>
        {isUser ? (
          msg.content
        ) : (
          <span dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
        )}
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '16px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: '#1E3A8A', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <BotIcon />
      </div>
      <div style={{
        padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
        background: 'white', border: '1px solid #E5E7EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#9CA3AF',
              animation: 'bounce 1.2s infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Recommended product buttons ───────────────────────────────────────────
function RecommendedButtons({ collectedData }) {
  if (!collectedData?.product) return null;

  if (collectedData.product === 'all') {
    return null; // ProductGrid handles this
  }

  // Build URL with pre-fill params
  const buildUrl = (productId) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return null;
    const params = new URLSearchParams();
    if (collectedData.name) params.set('name', collectedData.name);
    if (collectedData.county) params.set('county', collectedData.county);
    if (collectedData.spouse) params.set('spouse', collectedData.spouse);
    const qs = params.toString();
    return `${product.path}${qs ? '?' + qs : ''}`;
  };

  // Could be a single product or we parse multiple from text
  const productIds = Array.isArray(collectedData.product)
    ? collectedData.product
    : [collectedData.product];

  const validProducts = productIds
    .map((id) => ({ product: PRODUCTS.find((p) => p.id === id), url: buildUrl(id) }))
    .filter((x) => x.product && x.url);

  if (validProducts.length === 0) return null;

  return (
    <div style={{
      padding: '16px 20px',
      borderTop: '1px solid #E5E7EB',
      background: '#F9FAFB',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    }}>
      <span style={{ fontSize: '13px', color: '#6B7280', width: '100%', marginBottom: '4px', fontWeight: '600' }}>
        ✨ Listo para empezar:
      </span>
      {validProducts.map(({ product, url }) => (
        <Link
          key={product.id}
          href={url}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px',
            background: '#F59E0B', color: '#1E3A8A',
            textDecoration: 'none', borderRadius: '8px',
            fontWeight: '700', fontSize: '14px',
            boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
            transition: 'transform 0.1s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {product.name_es} <ArrowRightIcon />
        </Link>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
const OPENING_MESSAGE = {
  role: 'assistant',
  content: 'Hola 👋 Soy tu asistente virtual de Multi Servicios 360.\n\nCuéntame, ¿qué te trae por aquí hoy? ¿Estás protegiendo tus bienes o familia, necesitas algo para tu negocio, o hay algo urgente que necesitas resolver?',
};

export default function AsistentePage() {
  const router = useRouter();
  const [messages, setMessages] = useState([OPENING_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectedData, setCollectedData] = useState(null);
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Check URL params for pre-seeded context (coming from marvistalaw)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const city = params.get('city');
    if (service || city) {
      const seedMsg = [service && `Necesito información sobre: ${service}`, city && `Estoy en ${city}, California`]
        .filter(Boolean).join('. ');
      handleSend(seedMsg);
    }
  }, []);

  const handleSend = async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Only send actual conversation messages (not the static opening)
      const apiMessages = newMessages
        .filter((m) => !(m.role === 'assistant' && m === OPENING_MESSAGE))
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (!res.ok || data.fallback) {
        setShowFallback(true);
        setError('El asistente no está disponible en este momento. Aquí están todos nuestros servicios:');
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: 'Lo siento, tengo un problema técnico en este momento. Te muestro todos nuestros servicios disponibles para que puedas elegir el que necesitas. 🙏',
        }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
        if (data.collectedData) {
          setCollectedData(data.collectedData);
          if (data.collectedData.product === 'all') {
            setShowFallback(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setShowFallback(true);
      setError('Error de conexión. Aquí están todos nuestros servicios:');
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Parece que hay un problema de conexión. Te muestro todos nuestros servicios para que puedas continuar. 🙏',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = () => {
    setMessages([OPENING_MESSAGE]);
    setInput('');
    setCollectedData(null);
    setShowFallback(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick-start chips
  const quickStarts = [
    { es: '🏠 Proteger mi casa', en: 'Quiero proteger mi casa y bienes para mi familia' },
    { es: '💼 Tengo un negocio', en: 'Necesito documentos para mi negocio' },
    { es: '👨‍👩‍👧 Mis hijos', en: 'Quiero proteger a mis hijos en caso de algo' },
    { es: '📝 Poder Notarial', en: 'Necesito un poder notarial' },
    { es: '✈️ Viaje de niño', en: 'Mi hijo va a viajar sin mí' },
    { es: '🏢 Formar LLC', en: 'Quiero formar una LLC en California' },
  ];

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @media (max-width: 640px) {
          .chat-container { height: calc(100vh - 56px) !important; }
          .chat-header { padding: 12px 16px !important; }
          .chat-input-area { padding: 10px 12px !important; }
        }
      `}</style>

      <Navbar />

      <div style={{
        background: '#F3F4F6',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
      }}>
        {/* Page header */}
        <div style={{ maxWidth: '760px', width: '100%', marginBottom: '16px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1E3A8A', marginBottom: '8px' }}>
            🤖 Asistente Virtual MS360
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px' }}>
            Cuéntame tu situación y te ayudo a encontrar exactamente el documento que necesitas.
          </p>
        </div>

        {/* Chat window */}
        <div style={{
          maxWidth: '760px', width: '100%',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          display: 'flex', flexDirection: 'column',
          height: '600px',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div className="chat-header" style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BotIcon />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>Asistente MS360</div>
                <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  En línea · 24 servicios disponibles
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              title="Empezar de nuevo"
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
              }}
            >
              <RefreshIcon /> Nueva consulta
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            {showFallback && <ProductGrid />}
            <div ref={bottomRef} />
          </div>

          {/* Recommended product CTA */}
          {collectedData?.product && collectedData.product !== 'all' && !loading && (
            <RecommendedButtons collectedData={collectedData} />
          )}

          {/* Quick starts (only on first message) */}
          {messages.length === 1 && !loading && (
            <div style={{
              padding: '0 16px 12px',
              display: 'flex', flexWrap: 'wrap', gap: '8px',
            }}>
              {quickStarts.map((q) => (
                <button
                  key={q.es}
                  onClick={() => handleSend(q.en)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '20px',
                    border: '1.5px solid #1E3A8A',
                    background: 'white', color: '#1E3A8A',
                    fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1E3A8A'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1E3A8A'; }}
                >
                  {q.es}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="chat-input-area" style={{
            padding: '12px 16px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex', gap: '10px', alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta aquí... (Enter para enviar)"
              disabled={loading}
              rows={1}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #E5E7EB',
                borderRadius: '12px', padding: '10px 14px',
                fontSize: '15px', fontFamily: 'inherit', outline: 'none',
                transition: 'border-color 0.2s',
                maxHeight: '120px', overflowY: 'auto',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1E3A8A'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: input.trim() && !loading ? '#1E3A8A' : '#E5E7EB',
                color: input.trim() && !loading ? 'white' : '#9CA3AF',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              <SendIcon />
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{
            textAlign: 'center', padding: '8px 16px 12px',
            fontSize: '11px', color: '#9CA3AF',
          }}>
            MS360 es una plataforma de autoayuda · No brindamos asesoría legal · Consulte un abogado para situaciones legales complejas
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#6B7280', fontSize: '14px', textDecoration: 'none' }}>
            ← Regresar al inicio
          </Link>
        </div>
      </div>
    </>
  );
}
