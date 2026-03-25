'use client';
// app/components/CityPageClient.js
// Handles the bilingual rendering of the 33,540 city+service pages
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';
import LeadForm from './LeadForm';
import { useLang, T } from '../lib/LanguageContext';
import { CATEGORIES } from '../lib/data';

const PHONE = '(323) 418-2252';
const PHONE_TEL = 'tel:+13234182252';

const CITY_PHOTOS = [
  '1534430480872-3498386e7856',
  '1449034446853-66c86144b0ad',
  '1506905925346-21bda4d32df4',
  '1494522855154-9297ac14b55f',
  '1477959858617-67f85cf4f1df',
  '1488646953014-85cb44e25828',
  '1501594907352-04cda38ebc29',
  '1460800109262-5a2ca887b832',
];

function getCityPhoto(cityName) {
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) hash = (hash * 31 + cityName.charCodeAt(i)) & 0xFFFFFF;
  return CITY_PHOTOS[hash % CITY_PHOTOS.length];
}

export default function CityPageClient({ service, cityData, content, relatedCities, relatedServices, serviceSlug, citySlug }) {
  const { lang } = useLang();
  const t = T[lang].page;
  const category = CATEGORIES[service.category];

  const serviceName = lang === 'es' ? service.nameEs : service.name;

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '10px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '13px', color: '#6B7280' }}>
          <Link href="/" style={{ color: '#1E3A8A', textDecoration: 'none' }}>Home</Link>
          {' › '}
          <Link href={`/${serviceSlug}`} style={{ color: '#1E3A8A', textDecoration: 'none' }}>{serviceName}</Link>
          {' › '}
          <span>{cityData.city}, CA</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)', color: 'white', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px' }}>
              <span>{category?.icon}</span>
              <span>{category?.name} · {cityData.county} County</span>
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1.15, marginBottom: '16px' }}>
              {content?.h1 || `${serviceName} in ${cityData.city}, CA`}
            </h1>
            <p style={{ fontSize: '17px', opacity: 0.9, lineHeight: 1.6, marginBottom: '24px', maxWidth: '560px' }}>
              {content?.intro || service.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {t.trustBadges.map(badge => (
                <span key={badge} style={{ fontSize: '13px', opacity: 0.85 }}>{badge}</span>
              ))}
            </div>
          </div>
          <div>
            <LeadForm service={service} city={cityData.city} county={cityData.county} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px' }}>
        <div>
          {/* City photo */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '32px', height: '280px', background: '#E5E7EB', position: 'relative' }}>
            <Image
              src={`https://source.unsplash.com/1200x400/?${encodeURIComponent(cityData.city)},california`}
              alt={`${cityData.city}, California`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '20px 16px 12px' }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{cityData.city}, {cityData.county} County, California</span>
            </div>
          </div>

          {/* What it is */}
          {content?.whatItIs && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                {t.whatItIs} {serviceName}?
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>{content.whatItIs}</p>
            </section>
          )}

          {/* Local context */}
          {content?.localContext && (
            <section style={{ background: '#EFF6FF', borderLeft: '4px solid #1E3A8A', borderRadius: '0 8px 8px 0', padding: '20px 24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>
                📍 {t.localContext} — {cityData.county} County
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1E40AF' }}>{content.localContext}</p>
            </section>
          )}

          {/* Cost comparison */}
          {content?.costComparison && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                💰 {t.cost} {cityData.city}?
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>{content.costComparison}</p>

              {service.ms360Path && (
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '16px 20px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#065F46' }}>{t.diy}</div>
                    <div style={{ fontSize: '13px', color: '#047857' }}>{t.diyDesc} — {t.diyFrom}{service.ms360Price}</div>
                  </div>
                  <a
                    href={`https://multiservicios360.net${service.ms360Path}`}
                    style={{ background: '#065F46', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}
                    target="_blank" rel="noopener"
                  >
                    {t.diyBtn}
                  </a>
                </div>
              )}
            </section>
          )}

          {/* FAQ */}
          {content?.faqs?.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '20px' }}>
                {t.faq}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.faqs.map((faq, i) => (
                  <details key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                    <summary style={{ padding: '16px 20px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                      {faq.q}
                      <span style={{ color: '#1E3A8A', fontSize: '20px', flexShrink: 0, marginLeft: '12px' }}>+</span>
                    </summary>
                    <div style={{ padding: '16px 20px', fontSize: '15px', lineHeight: 1.7, color: '#374151' }}>
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related cities */}
          {relatedCities.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                {serviceName} — {t.nearbyCities}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {relatedCities.map(c => (
                  <Link
                    key={c.slug}
                    href={`/${serviceSlug}/${c.slug}`}
                    style={{ padding: '6px 14px', border: '1px solid #BFDBFE', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', color: '#1E40AF', background: '#EFF6FF' }}
                  >
                    {c.city}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
          <div style={{ marginBottom: '24px' }}>
            <LeadForm service={service} city={cityData.city} county={cityData.county} />
          </div>

          {relatedServices.length > 0 && (
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#1E3A8A' }}>
                {t.relatedServices} {cityData.city}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedServices.map(s => (
                  <Link
                    key={s.slug}
                    href={`/${s.slug}/${citySlug}`}
                    style={{ textDecoration: 'none', padding: '10px 12px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}
                  >
                    <span style={{ color: '#374151', fontWeight: '500' }}>
                      {lang === 'es' ? s.nameEs : s.name}
                    </span>
                    <span style={{ color: '#1E3A8A' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MS360 DIY Promo Section */}
      {service.ms360Path && (
        <div style={{ background: '#EFF6FF', borderTop: '4px solid #F59E0B', padding: '48px 16px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                💡 {lang === 'es' ? '¿Prefiere hacerlo usted mismo?' : 'Prefer the DIY route?'}
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px', lineHeight: 1.2 }}>
                {lang === 'es'
                  ? `Prepare su ${service.nameEs} en línea — sin abogado`
                  : `Prepare your ${service.name} online — no attorney needed`}
              </h2>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.65, marginBottom: '0' }}>
                {lang === 'es'
                  ? `Multi Servicios 360 es una plataforma bilingüe de autoayuda. Usted prepara sus propios documentos con herramientas guiadas. Desde $${service.ms360Price} — ahorra hasta $${(service.attorneyMin * 2 - service.ms360Price).toLocaleString()} vs. contratar un abogado.`
                  : `Multi Servicios 360 is a bilingual self-help platform. You prepare your own documents using guided tools. From $${service.ms360Price} — save up to $${(service.attorneyMin * 2 - service.ms360Price).toLocaleString()} vs. hiring an attorney.`}
              </p>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#1E3A8A', marginBottom: '4px' }}>desde ${service.ms360Price}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
                {lang === 'es' ? 'vs. abogado $' : 'vs. attorney $'}{service.attorneyMin?.toLocaleString()}+
              </div>
              <a
                href={`https://multiservicios360.net${service.ms360Path}`}
                target="_blank"
                rel="noopener"
                style={{ display: 'inline-block', background: '#1E3A8A', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap' }}
              >
                {lang === 'es' ? '🖥️ Empezar en MS360 →' : '🖥️ Start on MS360 →'}
              </a>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>multiservicios360.net</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ background: '#1E3A8A', color: 'white', padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
          {content?.ctaHeading || `${serviceName} in ${cityData.city}`}
        </h2>
        <p style={{ fontSize: '17px', opacity: 0.9, marginBottom: '28px', maxWidth: '560px', margin: '0 auto 28px' }}>
          {content?.ctaSubtext || (lang === 'es'
            ? 'Conéctate con un abogado experimentado hoy. Consulta gratis, servicio bilingüe.'
            : 'Connect with an experienced California attorney today. Free consultation, bilingual service.')}
        </p>
        <a
          href={PHONE_TEL}
          style={{ display: 'inline-block', background: '#F59E0B', color: '#1E3A8A', padding: '14px 32px', borderRadius: '10px', fontWeight: '800', fontSize: '18px', textDecoration: 'none' }}
        >
          {t.callNow}: {PHONE}
        </a>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', opacity: 0.6, marginBottom: '8px' }}>
            © {new Date().getFullYear()} Mar Vista Law · marvistalaw.com
          </p>
          <p style={{ fontSize: '11px', opacity: 0.4, maxWidth: '600px', margin: '0 auto 12px' }}>
            {T[lang].footer.disclaimer}
          </p>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>
            {T[lang].footer.diy}{' '}
            <a href="https://multiservicios360.net" style={{ color: '#F59E0B' }} target="_blank" rel="noopener">
              multiservicios360.net
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
