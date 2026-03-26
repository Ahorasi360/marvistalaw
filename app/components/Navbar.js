'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLang, T } from '../lib/LanguageContext';

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = T[lang].nav;
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#1E3A8A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '18px' }}>M</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', color: '#1E3A8A', lineHeight: 1.1 }}>Mar Vista Law</div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>California Legal Resource Center</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <Link href="/car-accident-attorney/los-angeles" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textDecoration: 'none' }}>{t.accidents || 'Accidents'}</Link>
          <Link href="/green-card-application/los-angeles" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textDecoration: 'none' }}>{t.immigration || 'Immigration'}</Link>
          <Link href="/living-trust/los-angeles" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textDecoration: 'none' }}>{t.estatePlanning || 'Estate Planning'}</Link>
          <div style={{ display: 'flex', gap: '2px', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setLang('en')} style={{ padding: '6px 12px', border: 'none', cursor: 'pointer', background: lang === 'en' ? '#1E3A8A' : 'white', color: lang === 'en' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '13px' }}>EN</button>
            <button onClick={() => setLang('es')} style={{ padding: '6px 12px', border: 'none', cursor: 'pointer', background: lang === 'es' ? '#1E3A8A' : 'white', color: lang === 'es' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '13px' }}>ES</button>
          </div>
          <Link href="/asistente" style={{ fontSize: '13px', fontWeight: '700', color: '#F59E0B', textDecoration: 'none', padding: '6px 12px', background: '#FEF3C7', borderRadius: '8px', border: '1.5px solid #F59E0B' }}>🤖 {lang === 'es' ? 'Asistente' : 'Assistant'}</Link>
          <Link href="tel:+13234182252" style={{ background: '#1E3A8A', color: 'white', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap' }}>
            {lang === 'es' ? 'Consulta Gratis' : 'Free Consultation'}
          </Link>
        </div>

        {/* Mobile right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-nav-right">
          <div style={{ display: 'flex', gap: '2px', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setLang('en')} style={{ padding: '5px 10px', border: 'none', cursor: 'pointer', background: lang === 'en' ? '#1E3A8A' : 'white', color: lang === 'en' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '12px' }}>EN</button>
            <button onClick={() => setLang('es')} style={{ padding: '5px 10px', border: 'none', cursor: 'pointer', background: lang === 'es' ? '#1E3A8A' : 'white', color: lang === 'es' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '12px' }}>ES</button>
          </div>
          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} style={{ background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#374151' }}></span>
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#374151' }}></span>
            <span style={{ display: 'block', width: '20px', height: '2px', background: '#374151' }}></span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: 'white', borderTop: '1px solid #E5E7EB', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link href="/car-accident-attorney/los-angeles" onClick={() => setOpen(false)} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '600', color: '#1E3A8A', textDecoration: 'none', borderRadius: '8px', background: '#F8FAFC' }}>🚗 {t.accidents || 'Accidents'}</Link>
            <Link href="/green-card-application/los-angeles" onClick={() => setOpen(false)} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '600', color: '#1E3A8A', textDecoration: 'none', borderRadius: '8px', background: '#F8FAFC' }}>🌎 {t.immigration || 'Immigration'}</Link>
            <Link href="/living-trust/los-angeles" onClick={() => setOpen(false)} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '600', color: '#1E3A8A', textDecoration: 'none', borderRadius: '8px', background: '#F8FAFC' }}>🏛️ {t.estatePlanning || 'Estate Planning'}</Link>
            <Link href="/asistente" onClick={() => setOpen(false)} style={{ padding: '12px 16px', fontSize: '15px', fontWeight: '700', color: '#F59E0B', textDecoration: 'none', borderRadius: '8px', background: '#FEF3C7', border: '1.5px solid #F59E0B' }}>🤖 {lang === 'es' ? 'Asistente Legal IA' : 'AI Legal Assistant'}</Link>
            <Link href="tel:+13234182252" onClick={() => setOpen(false)} style={{ padding: '14px 16px', fontSize: '16px', fontWeight: '700', color: 'white', textDecoration: 'none', borderRadius: '8px', background: '#1E3A8A', textAlign: 'center', marginTop: '8px' }}>
              📞 {lang === 'es' ? 'Consulta Gratis' : 'Free Consultation'}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: none !important; }
        .mobile-nav-right { display: flex !important; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-right { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
