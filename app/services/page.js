'use client';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useLang } from '../lib/LanguageContext';
import { SERVICES } from '../lib/data';

const CATEGORIES = [
  { key: 'injury', icon: '🚗', en: 'Accidents & Personal Injury', es: 'Accidentes y Lesiones Personales', desc_en: 'No upfront cost — contingency fee only', desc_es: 'Sin costo inicial — solo cobramos si ganamos', color: '#DC2626', bg: '#FEF2F2' },
  { key: 'immigration', icon: '🌎', en: 'Immigration Law', es: 'Derecho Migratorio', desc_en: 'Free initial consultation', desc_es: 'Consulta inicial gratuita', color: '#1D4ED8', bg: '#EFF6FF' },
  { key: 'estate', icon: '🏛️', en: 'Estate Planning', es: 'Planificación Patrimonial', desc_en: 'DIY options from $99 at multiservicios360.net', desc_es: 'Opciones DIY desde $99 en multiservicios360.net', color: '#065F46', bg: '#ECFDF5' },
  { key: 'family', icon: '👨‍👩‍👧', en: 'Family Law', es: 'Derecho Familiar', desc_en: 'Free consultation', desc_es: 'Consulta gratuita', color: '#7C3AED', bg: '#F5F3FF' },
  { key: 'business', icon: '💼', en: 'Business Law', es: 'Derecho Empresarial', desc_en: 'DIY LLC from $149 at multiservicios360.net', desc_es: 'LLC DIY desde $149 en multiservicios360.net', color: '#92400E', bg: '#FEF3C7' },
  { key: 'realestate', icon: '🏠', en: 'Real Estate', es: 'Bienes Raíces', desc_en: 'Free consultation', desc_es: 'Consulta gratuita', color: '#1E3A8A', bg: '#EFF6FF' },
];

export default function ServicesPage() {
  const { lang } = useLang();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', color: 'white', padding: '48px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: '800', margin: '0 0 12px' }}>
          {lang === 'es' ? '51 Servicios Legales en California' : '51 Legal Services in California'}
        </h1>
        <p style={{ fontSize: '17px', opacity: 0.9, margin: '0 0 24px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          {lang === 'es'
            ? 'Cubrimos todas las 482 ciudades de California con abogados bilingües experimentados'
            : 'Covering all 482 California cities with experienced bilingual attorneys'}
        </p>
        <Link href="/asistente"
          style={{ display: 'inline-block', background: '#F59E0B', color: '#1E3A8A', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
          🤖 {lang === 'es' ? '¿No sé cuál necesito — ayúdame' : 'Not sure which I need — help me'}
        </Link>
      </div>

      {/* Services by category */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px' }}>
        {CATEGORIES.map(cat => {
          const catServices = SERVICES.filter(s => s.category === cat.key);
          if (catServices.length === 0) return null;
          return (
            <div key={cat.key} style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid ' + cat.color + '30' }}>
                <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: cat.color, margin: 0 }}>
                    {lang === 'es' ? cat.es : cat.en}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                    {lang === 'es' ? cat.desc_es : cat.desc_en}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {catServices.map(s => (
                  <Link key={s.slug} href={'/' + s.slug + '/los-angeles'}
                    style={{ display: 'block', padding: '16px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1E3A8A', marginBottom: '4px' }}>
                      {lang === 'es' ? s.nameEs : s.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                      {s.ms360Path
                        ? (lang === 'es' ? `DIY desde $${s.ms360Price}` : `DIY from $${s.ms360Price}`)
                        : (lang === 'es' ? 'Consulta gratis' : 'Free consultation')}
                    </div>
                    <div style={{ fontSize: '12px', color: cat.color, fontWeight: '600' }}>
                      {lang === 'es' ? 'Ver ciudades →' : 'View cities →'}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ background: '#1E3A8A', color: 'white', padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 12px' }}>
          {lang === 'es' ? '¿No sabe cuál necesita?' : 'Not sure which service you need?'}
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 24px' }}>
          {lang === 'es'
            ? 'Nuestro asistente legal bilingüe te guía en minutos — gratis y confidencial'
            : 'Our bilingual legal assistant guides you in minutes — free and confidential'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/asistente"
            style={{ background: '#F59E0B', color: '#1E3A8A', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
            🤖 {lang === 'es' ? 'Hablar con el Asistente' : 'Talk to Assistant'}
          </Link>
          <Link href="tel:+13234182252"
            style={{ background: 'white', color: '#1E3A8A', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '16px' }}>
            📞 (323) 418-2252
          </Link>
        </div>
      </div>
    </div>
  );
}
