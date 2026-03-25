'use client';
// app/components/Navbar.js
import Link from 'next/link';
import { useLang, T } from '../lib/LanguageContext';

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = T[lang].nav;

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#1E3A8A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#F59E0B', fontWeight: '800', fontSize: '18px' }}>M</span>
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#1E3A8A', lineHeight: 1 }}>Mar Vista Law</div>
            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.2 }}>{t.tagline}</div>
          </div>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/green-card-application/los-angeles" style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
            {t.immigration}
          </Link>
          <Link href="/car-accident-attorney/los-angeles" style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
            {t.accidents}
          </Link>
          <Link href="/living-trust/los-angeles" style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}>
            {t.estate}
          </Link>

          {/* Language toggle */}
          <div style={{
            display: 'flex',
            border: '1.5px solid #E5E7EB',
            borderRadius: '8px',
            overflow: 'hidden',
            fontSize: '13px',
            fontWeight: '700',
          }}>
            <button
              onClick={() => setLang('en')}
              style={{
                padding: '6px 12px',
                border: 'none',
                cursor: 'pointer',
                background: lang === 'en' ? '#1E3A8A' : 'white',
                color: lang === 'en' ? 'white' : '#6B7280',
                transition: 'all 0.15s',
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang('es')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderLeft: '1.5px solid #E5E7EB',
                cursor: 'pointer',
                background: lang === 'es' ? '#1E3A8A' : 'white',
                color: lang === 'es' ? 'white' : '#6B7280',
                transition: 'all 0.15s',
              }}
            >
              ES
            </button>
          </div>

          {/* CTA */}
          <a
            href="tel:+1[PHONE-MARVISTALAW]"
            style={{
              textDecoration: 'none',
              background: '#1E3A8A',
              color: 'white',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            {t.cta}
          </a>
        </div>
      </div>
    </nav>
  );
}
