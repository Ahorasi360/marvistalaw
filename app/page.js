'use client';
// app/page.js — bilingual homepage
import Link from 'next/link';
import Navbar from './components/Navbar';
import { useLang, T } from './lib/LanguageContext';
import { SERVICES } from './lib/data';

const PHONE = '[PHONE-MARVISTALAW]'; // Replace with your Google Voice number

const FEATURED = [
  { slug: 'car-accident-attorney',      emoji: '🚗', highlightEn: 'No upfront fees',    highlightEs: 'Sin costo por adelantado' },
  { slug: 'green-card-application',     emoji: '🌎', highlightEn: 'Bilingual attorneys', highlightEs: 'Abogados bilingües' },
  { slug: 'living-trust',               emoji: '🏛️', highlightEn: 'From $599 DIY',       highlightEs: 'Desde $599 autoayuda' },
  { slug: 'divorce-attorney',           emoji: '⚖️', highlightEn: 'Free consultation',   highlightEs: 'Consulta gratis' },
  { slug: 'llc-formation',              emoji: '💼', highlightEn: 'Start today',          highlightEs: 'Empieza hoy' },
  { slug: 'workers-compensation',       emoji: '🦺', highlightEn: 'No win no fee',        highlightEs: 'Sin victoria sin cobro' },
  { slug: 'daca-renewal',               emoji: '📋', highlightEn: 'Act before deadline',  highlightEs: 'Actúa antes del vencimiento' },
  { slug: 'removal-defense',            emoji: '🛡️', highlightEn: 'Fight deportation',    highlightEs: 'Lucha contra deportación' },
  { slug: 'general-power-of-attorney',  emoji: '✍️', highlightEn: 'From $149 DIY',       highlightEs: 'Desde $149 autoayuda' },
];

export default function HomePage() {
  const { lang } = useLang();
  const t = T[lang];

  const featured = FEATURED.map(f => ({
    ...f,
    service: SERVICES.find(s => s.slug === f.slug),
    highlight: lang === 'es' ? f.highlightEs : f.highlightEn,
  })).filter(f => f.service);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 60%, #1D4ED8 100%)', color: 'white', padding: '72px 16px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '20px' }}>
            🌎 {t.hero.badge}
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px' }}>
            {t.hero.title}<br />
            <span style={{ color: '#FCD34D' }}>{t.hero.titleAccent}</span>
          </h1>
          <p style={{ fontSize: '19px', opacity: 0.9, maxWidth: '620px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            {t.hero.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`tel:+1${PHONE}`} style={{ background: '#F59E0B', color: '#1E3A8A', padding: '16px 32px', borderRadius: '10px', fontWeight: '800', fontSize: '18px', textDecoration: 'none' }}>
              {t.hero.ctaPrimary}
            </a>
            <Link href={`/car-accident-attorney/los-angeles`} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '18px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section style={{ padding: '64px 16px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: '#1E3A8A' }}>
            {t.services.title}
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '40px' }}>{t.services.subtitle}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {featured.map(({ service, emoji, highlight }) => (
              <Link
                key={service.slug}
                href={`/${service.slug}/los-angeles`}
                style={{ textDecoration: 'none', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', background: 'white', display: 'block' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{emoji}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A', marginBottom: '4px' }}>
                  {lang === 'es' ? service.nameEs : service.name}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px', lineHeight: 1.5 }}>
                  {service.description}
                </div>
                <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {highlight}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ padding: '64px 16px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '40px', color: '#1E3A8A' }}>{t.why.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {t.why.items.map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: '#1E3A8A' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIY bridge → MS360 */}
      <section style={{ background: '#EFF6FF', borderTop: '1px solid #BFDBFE', borderBottom: '1px solid #BFDBFE', padding: '48px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
            {t.diy.title}
          </h2>
          <p style={{ color: '#1E40AF', marginBottom: '24px', fontSize: '16px', lineHeight: 1.6 }}>
            {t.diy.body}
          </p>
          <a
            href="https://multiservicios360.net"
            target="_blank"
            rel="noopener"
            style={{ display: 'inline-block', background: '#1E3A8A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}
          >
            {t.diy.cta}
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: '#1E3A8A', color: 'white', padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
          {lang === 'es' ? '¿Necesitas ayuda legal hoy?' : 'Need legal help today?'}
        </h2>
        <p style={{ fontSize: '17px', opacity: 0.9, marginBottom: '28px' }}>
          {lang === 'es' ? 'Llámanos ahora — servicio bilingüe, consulta gratis.' : 'Call us now — bilingual service, free consultation.'}
        </p>
        <a
          href={`tel:+1${PHONE}`}
          style={{ display: 'inline-block', background: '#F59E0B', color: '#1E3A8A', padding: '14px 36px', borderRadius: '10px', fontWeight: '800', fontSize: '20px', textDecoration: 'none' }}
        >
          📞 {PHONE}
        </a>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontWeight: '800', fontSize: '20px', marginBottom: '8px' }}>Mar Vista Law</div>
          <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '16px' }}>
            {lang === 'es' ? 'Centro de Recursos Legales de California · 58 Condados · Bilingüe' : 'California Legal Resource Center · All 58 Counties · Bilingual'}
          </div>
          <p style={{ fontSize: '11px', opacity: 0.4, maxWidth: '500px', margin: '0 auto 12px' }}>
            {t.footer.disclaimer}
          </p>
          <p style={{ fontSize: '13px', opacity: 0.5, marginTop: '8px' }}>
            {t.footer.diy}{' '}
            <a href="https://multiservicios360.net" style={{ color: '#F59E0B' }} target="_blank" rel="noopener">
              multiservicios360.net
            </a>
          </p>
          <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '12px' }}>© {new Date().getFullYear()} MarVistaLaw.com</p>
        </div>
      </footer>
    </>
  );
}
