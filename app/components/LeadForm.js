'use client';
// app/components/LeadForm.js
import { useState } from 'react';

export default function LeadForm({ service, city, county }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', language: 'es', budget: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, service: service.name, serviceSlug: service.slug, city, county, leadPrice: service.leadPrice }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#065F46', marginBottom: '8px' }}>We received your request!</h3>
        <p style={{ color: '#047857' }}>A specialist will contact you within 24 hours. We speak Spanish and English.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#1E3A8A', borderRadius: '12px', padding: '28px', color: 'white' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
        Free Consultation — {service.name}
      </h3>
      <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '20px' }}>
        {service.category === 'injury'
          ? 'No upfront fees. We only get paid if you win. Bilingual attorneys.'
          : `Connect with an experienced ${city} attorney. 100% confidential.`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          placeholder="Full name *"
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder="Phone number *"
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          style={inputStyle}
          type="tel"
        />
        <input
          placeholder="Email (optional)"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          style={inputStyle}
          type="email"
        />
        <select
          value={form.language}
          onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
          style={{ ...inputStyle, color: '#1E3A8A' }}
        >
          <option value="es">Prefiero español</option>
          <option value="en">I prefer English</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.phone || status === 'loading'}
          style={{
            background: '#F59E0B',
            color: '#1E3A8A',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: form.name && form.phone ? 'pointer' : 'default',
            opacity: form.name && form.phone ? 1 : 0.6,
            marginTop: '4px',
          }}
        >
          {status === 'loading' ? 'Sending...' : '📞 Request Free Consultation'}
        </button>

        {status === 'error' && (
          <p style={{ fontSize: '13px', color: '#FCA5A5', textAlign: 'center' }}>
            Something went wrong. Please call us directly.
          </p>
        )}
      </div>

      <p style={{ fontSize: '11px', opacity: 0.6, marginTop: '14px', textAlign: 'center' }}>
        🔒 Your information is 100% confidential · Bilingual service · No spam
      </p>
    </div>
  );
}

const inputStyle = {
  background: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '8px',
  padding: '12px 14px',
  color: 'white',
  fontSize: '15px',
  width: '100%',
  outline: 'none',
};
