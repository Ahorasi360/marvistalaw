'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '../lib/LanguageContext';
import { SERVICES } from '../lib/data';

const MENU_CATEGORIES = [
  {
    key: 'accidents',
    en: 'Accidents',
    es: 'Accidentes',
    icon: '🚗',
    categories: ['injury'],
    href: '/car-accident-attorney/los-angeles',
  },
  {
    key: 'immigration',
    en: 'Immigration',
    es: 'Inmigración',
    icon: '🌎',
    categories: ['immigration'],
    href: '/green-card-application/los-angeles',
  },
  {
    key: 'estate',
    en: 'Estate Planning',
    es: 'Planificación Patrimonial',
    icon: '🏛️',
    categories: ['estate'],
    href: '/living-trust/los-angeles',
  },
  {
    key: 'family',
    en: 'Family Law',
    es: 'Familia',
    icon: '👨‍👩‍👧',
    categories: ['family'],
    href: '/divorce-attorney/los-angeles',
  },
  {
    key: 'business',
    en: 'Business',
    es: 'Negocios',
    icon: '💼',
    categories: ['business', 'realestate'],
    href: '/llc-formation/los-angeles',
  },
];

export default function Navbar() {
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const getServicesForCategory = (categories) =>
    SERVICES.filter(s => categories.includes(s.category)).slice(0, 8);

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', background: '#1E3A8A', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '18px' }}>M</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', color: '#1E3A8A', lineHeight: 1.1 }}>Mar Vista Law</div>
            <div style={{ fontSize: '10px', color: '#6B7280' }}>California Legal Resource Center</div>
          </div>
        </Link>

        {/* Desktop menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-menu">
          {MENU_CATEGORIES.map(cat => {
            const services = getServicesForCategory(cat.categories);
            return (
              <div key={cat.key} style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown(cat.key)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link href={cat.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 10px', fontSize: '13px', fontWeight: '600', color: '#374151', textDecoration: 'none', borderRadius: '8px', background: activeDropdown === cat.key ? '#F8FAFC' : 'transparent', whiteSpace: 'nowrap' }}>
                  {cat.icon} {lang === 'es' ? cat.es : cat.en}
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>▾</span>
                </Link>

                {/* Dropdown */}
                {activeDropdown === cat.key && (
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '12px', minWidth: '220px', zIndex: 200 }}>
                    {services.map(s => (
                      <Link key={s.slug} href={'/' + s.slug + '/los-angeles'}
                        style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#374151', textDecoration: 'none', borderRadius: '6px', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.target.style.background = '#EFF6FF'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}>
                        {lang === 'es' ? s.nameEs : s.name}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #E5E7EB', marginTop: '8px', paddingTop: '8px' }}>
                      <Link href="/services"
                        style={{ display: 'block', padding: '8px 12px', fontSize: '12px', color: '#1E3A8A', textDecoration: 'none', fontWeight: '700' }}>
                        {lang === 'es' ? 'Ver todos los servicios →' : 'View all services →'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* All services link */}
          <Link href="/services"
            style={{ padding: '8px 10px', fontSize: '13px', fontWeight: '600', color: '#1E3A8A', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {lang === 'es' ? 'Todos los servicios' : 'All Services'}
          </Link>

          {/* Lang toggle */}
          <div style={{ display: 'flex', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginLeft: '4px' }}>
            <button onClick={() => setLang('en')} style={{ padding: '6px 10px', border: 'none', cursor: 'pointer', background: lang === 'en' ? '#1E3A8A' : 'white', color: lang === 'en' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '12px' }}>EN</button>
            <button onClick={() => setLang('es')} style={{ padding: '6px 10px', border: 'none', cursor: 'pointer', background: lang === 'es' ? '#1E3A8A' : 'white', color: lang === 'es' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '12px' }}>ES</button>
          </div>

          {/* Assistant */}
          <Link href="/asistente"
            style={{ fontSize: '12px', fontWeight: '700', color: '#F59E0B', textDecoration: 'none', padding: '6px 10px', background: '#FEF3C7', borderRadius: '8px', border: '1.5px solid #F59E0B', whiteSpace: 'nowrap' }}>
            🤖 {lang === 'es' ? 'Asistente' : 'Assistant'}
          </Link>

          {/* CTA */}
          <Link href="tel:+13234182252"
            style={{ background: '#1E3A8A', color: 'white', padding: '9px 14px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' }}>
            {lang === 'es' ? 'Consulta Gratis' : 'Free Consultation'}
          </Link>
        </div>

        {/* Mobile right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-menu-btn">
          <div style={{ display: 'flex', border: '1.5px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <button onClick={() => setLang('en')} style={{ padding: '5px 8px', border: 'none', cursor: 'pointer', background: lang === 'en' ? '#1E3A8A' : 'white', color: lang === 'en' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '12px' }}>EN</button>
            <button onClick={() => setLang('es')} style={{ padding: '5px 8px', border: 'none', cursor: 'pointer', background: lang === 'es' ? '#1E3A8A' : 'white', color: lang === 'es' ? 'white' : '#6B7280', fontWeight: '700', fontSize: '12px' }}>ES</button>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #E5E7EB', maxHeight: '80vh', overflowY: 'auto' }}>
          {MENU_CATEGORIES.map(cat => {
            const services = getServicesForCategory(cat.categories);
            return (
              <div key={cat.key} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ padding: '12px 16px', fontWeight: '700', color: '#1E3A8A', fontSize: '14px', background: '#F8FAFC' }}>
                  {cat.icon} {lang === 'es' ? cat.es : cat.en}
                </div>
                {services.map(s => (
                  <Link key={s.slug} href={'/' + s.slug + '/los-angeles'}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', padding: '10px 24px', fontSize: '14px', color: '#374151', textDecoration: 'none', borderBottom: '1px solid #F9FAFB' }}>
                    {lang === 'es' ? s.nameEs : s.name}
                  </Link>
                ))}
              </div>
            );
          })}
          <div style={{ padding: '16px' }}>
            <Link href="/asistente" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '12px 16px', background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: '8px', textAlign: 'center', color: '#92400E', fontWeight: '700', textDecoration: 'none', marginBottom: '10px' }}>
              🤖 {lang === 'es' ? 'Asistente Legal IA' : 'AI Legal Assistant'}
            </Link>
            <Link href="/services" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '12px 16px', background: '#EFF6FF', borderRadius: '8px', textAlign: 'center', color: '#1E3A8A', fontWeight: '700', textDecoration: 'none', marginBottom: '10px' }}>
              {lang === 'es' ? '📋 Ver 51 Servicios' : '📋 View All 51 Services'}
            </Link>
            <Link href="tel:+13234182252" onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '14px 16px', background: '#1E3A8A', borderRadius: '8px', textAlign: 'center', color: 'white', fontWeight: '700', textDecoration: 'none' }}>
              📞 {lang === 'es' ? 'Consulta Gratis' : 'Free Consultation'}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-menu { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        @media (min-width: 900px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
