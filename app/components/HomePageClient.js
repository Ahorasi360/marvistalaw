'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import { useLang, T } from '../lib/LanguageContext';
import { SERVICES } from '../lib/data';

const PHONE = '(323) 418-2252';
const PHONE_TEL = 'tel:+13234182252';

const FEATURED = [
  { slug: 'car-accident-attorney',     emoji: '🚗', en: 'No upfront fees',         es: 'Sin costo adelantado' },
  { slug: 'green-card-application',    emoji: '🌎', en: 'Bilingual attorneys',      es: 'Abogados bilingües' },
  { slug: 'living-trust',              emoji: '🏛️', en: 'From $599 DIY',            es: 'Desde $599 autoayuda' },
  { slug: 'divorce-attorney',          emoji: '⚖️', en: 'Free consultation',        es: 'Consulta gratis' },
  { slug: 'llc-formation',             emoji: '💼', en: 'Start today',              es: 'Empieza hoy' },
  { slug: 'workers-compensation',      emoji: '🦺', en: 'No win no fee',            es: 'Sin victoria sin cobro' },
  { slug: 'daca-renewal',              emoji: '📋', en: 'Act before deadline',      es: 'Actúa antes del vencimiento' },
  { slug: 'removal-defense',           emoji: '🛡️', en: 'Fight deportation',        es: 'Lucha contra deportación' },
  { slug: 'general-power-of-attorney', emoji: '✍️', en: 'From $149 DIY',           es: 'Desde $149 autoayuda' },
];

export default function HomePageClient() {
  const { lang } = useLang();
  const t = T[lang];
  const [userCity, setUserCity] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const city = data.city || data.locality || data.principalSubdivision || null;
          if (city) setUserCity(city);
        } catch (_) {}
      },
      () => {}
    );
  }, []);

  const featured = FEATURED.map(f => ({
    ...f,
    service: SERVICES.find(s => s.slug === f.slug),
    highlight: lang === 'es' ? f.es : f.en,
  })).filter(f => f.service);

  return (
    <>
      <Navbar />

      {/* Geo Location Banner */}
      {userCity && (
        <div style={{ background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', padding: '10px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#1E40AF', margin: 0, fontWeight: '500' }}>
            📍 {lang === 'es'
              ? `Conectamos a familias en ${userCity} con abogados licenciados en California`
              : `Connecting families in ${userCity} with licensed California attorneys`}
            {' '}<a href="/asistente" style={{ color: '#1E3A8A', fontWeight: '700', textDecoration: 'underline' }}>
              {lang === 'es' ? 'Consulta gratis →' : 'Free consultation →'}
            </a>
          </p>
        </div>
      )}

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
            <a href={PHONE_TEL} style={{ background: '#F59E0B', color: '#1E3A8A', padding: '16px 32px', borderRadius: '10px', fontWeight: '800', fontSize: '18px', textDecoration: 'none' }}>
              {t.hero.ctaPrimary}
            </a>
            <Link href="/asistente" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '18px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: '64px 16px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: '#1E3A8A' }}>
            {t.services.title}
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '40px' }}>{t.services.subtitle}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {featured.map(({ service, emoji, highlight }) => (
              <Link key={service.slug} href={`/${service.slug}/los-angeles`}
                style={{ textDecoration: 'none', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', background: 'white', display: 'block' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{emoji}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A', marginBottom: '4px' }}>
                  {lang === 'es' ? service.nameEs : service.name}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px', lineHeight: 1.5 }}>{service.description}</div>
                <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {highlight}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      {/* How it works */}
      <div style={{ background: 'white', padding: '64px 16px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
            {lang === 'es' ? '¿Cómo funciona?' : 'How It Works'}
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            {lang === 'es' ? 'Conectarte con un abogado en California nunca fue tan fácil' : 'Connecting with a California attorney has never been easier'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {[
              { step: '1', icon: '📝', title: lang === 'es' ? 'Cuéntanos tu caso' : 'Tell us your case', desc: lang === 'es' ? 'Llena el formulario con tu situación legal en menos de 2 minutos' : 'Fill out the form with your legal situation in under 2 minutes' },
              { step: '2', icon: '⚖️', title: lang === 'es' ? 'Te conectamos' : 'We connect you', desc: lang === 'es' ? 'Un abogado licenciado en California te contacta en menos de 24 horas' : 'A licensed California attorney contacts you within 24 hours' },
              { step: '3', icon: '✅', title: lang === 'es' ? 'Consulta gratis' : 'Free consultation', desc: lang === 'es' ? 'Recibe orientación profesional sin costo inicial ni compromiso' : 'Get professional guidance with no upfront cost or commitment' },
            ].map(s => (
              <div key={s.step} style={{ flex: '1 1 220px', maxWidth: '280px', padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ width: '28px', height: '28px', background: '#1E3A8A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', margin: '0 auto 12px' }}>{s.step}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div style={{ background: '#F8FAFC', padding: '64px 16px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1E3A8A', marginBottom: '16px' }}>
            {lang === 'es' ? 'Recursos Legales en California para Familias Latinas' : 'California Legal Resources for Latino Families'}
          </h2>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
            {lang === 'es' 
              ? 'Mar Vista Law es el centro de recursos legales más completo para la comunidad latina en California. Cubrimos las 482 ciudades del estado, desde San Diego hasta Redding, ofreciendo acceso a abogados bilingües especializados en inmigración, accidentes de auto, planificación patrimonial y derecho familiar.'
              : 'Mar Vista Law is the most comprehensive legal resource center for the Latino community in California. We cover all 482 cities in the state, from San Diego to Redding, providing access to bilingual attorneys specializing in immigration, car accidents, estate planning, and family law.'}
          </p>
          <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
            {lang === 'es'
              ? 'Nuestro servicio de referencia conecta a las familias californianas con abogados experimentados y licenciados por el State Bar de California. Todas las consultas iniciales son completamente gratuitas y en español o inglés, según su preferencia.'
              : 'Our referral service connects California families with experienced attorneys licensed by the California State Bar. All initial consultations are completely free and in Spanish or English, according to your preference.'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
            {['Los Angeles', 'San Diego', 'San Francisco', 'San Jose', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland'].map(city => (
              <Link key={city} href={'/car-accident-attorney/' + city.toLowerCase().replace(/ /g, '-')}
                style={{ padding: '8px 16px', background: 'white', border: '1px solid #BFDBFE', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', color: '#1E40AF', fontWeight: '600' }}>
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

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

      {/* DIY bridge */}
      <section style={{ background: '#EFF6FF', borderTop: '1px solid #BFDBFE', borderBottom: '1px solid #BFDBFE', padding: '48px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>{t.diy.title}</h2>
          <p style={{ color: '#1E40AF', marginBottom: '24px', fontSize: '16px', lineHeight: 1.6 }}>{t.diy.body}</p>
          <a href="https://multiservicios360.net" target="_blank" rel="noopener"
            style={{ display: 'inline-block', background: '#1E3A8A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
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
        <a href={PHONE_TEL}
          style={{ display: 'inline-block', background: '#F59E0B', color: '#1E3A8A', padding: '14px 36px', borderRadius: '10px', fontWeight: '800', fontSize: '20px', textDecoration: 'none' }}>
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
          <p style={{ fontSize: '13px', opacity: 0.5 }}>
            {t.footer.diy}{' '}
            <a href="https://multiservicios360.net" style={{ color: '#F59E0B' }} target="_blank" rel="noopener">multiservicios360.net</a>
          </p>
          <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '12px' }}>© {new Date().getFullYear()} MarVistaLaw.com · {PHONE}</p>
          <p style={{ fontSize: '11px', opacity: 0.35, marginTop: '8px' }}>
            Built by{' '}
            <a href="https://flashpreviewsconsultinggroup.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontWeight: '600' }}>
              Flash Previews Consulting Group
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
