'use client';
// app/components/LeadForm.js
import { useState } from 'react';
import { useLang, T } from '../lib/LanguageContext';

export default function LeadForm({ service, city, county }) {
  const { lang } = useLang();
  const t = T[lang].form;
  const [form, setForm] = useState({ name: '', phone: '', email: '', language: lang === 'es' ? 'es' : 'en' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: service.name,
          serviceSlug: service.slug,
          city,
          county,
          leadPrice: service.leadPrice,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#065F46', marginBottom: '8px' }}>{t.successTitle}</h3>
        <p style={{ color: '#047857', lineHeight: 1.6 }}>{t.successBody}</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#1E3A8A', borderRadius: '12px', padding: '28px', color: 'white' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '6px' }}>
        {t.title} — {service.name}
      </h3>
      <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '20px', lineHeight: 1.5 }}>
        {service.category === 'injury' ? t.injury : t.general}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          placeholder={t.name}
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder={t.phone}
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          style={inputStyle}
          type="tel"
        />
        <input
          placeholder={t.email}
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          style={inputStyle}
          type="email"
        />
        <select
          value={form.language}
          onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
          style={{ ...inputStyle, color: 'white', background: 'white' }}
        >
          <option value="es">{t.langEs}</option>
          <option value="en">{t.langEn}</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={!form.name || !form.phone || status === 'loading'}
          style={{
            background: '#F59E0B',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '14px',
            fontWeight: '700',
            fontSize: '16px',
            cursor: form.name && form.phone ? 'pointer' : 'default',
            opacity: 1,
            marginTop: '4px',
          }}
        >
          {status === 'loading' ? t.sending : t.submit}
        </button>

        {status === 'error' && (
          <p style={{ fontSize: '13px', color: '#FCA5A5', textAlign: 'center' }}>{t.errorMsg}</p>
        )}
      </div>

      <p style={{ fontSize: '11px', opacity: 1, marginTop: '14px', textAlign: 'center' }}>
        {t.disclaimer}
      </p>
    </div>
  );
}

const inputStyle = {
  background: 'white',
  border: '1px solid #BFDBFE',
  borderRadius: '8px',
  padding: '12px 14px',
  color: 'white',
  fontSize: '15px',
  width: '100%',
  outline: 'none',
};
