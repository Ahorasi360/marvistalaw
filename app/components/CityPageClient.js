'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import LeadForm from './LeadForm';
import { useLang, T } from '../lib/LanguageContext';

const PICSUM_SEEDS = {
  'los-angeles': '1000', 'san-diego': '1010', 'san-francisco': '1020',
  'san-jose': '1030', 'fresno': '1040', 'sacramento': '1050',
  'long-beach': '1060', 'oakland': '1070', 'bakersfield': '1080',
  'anaheim': '1090', 'santa-ana': '1100', 'riverside': '1110',
  'stockton': '1120', 'irvine': '1130', 'fremont': '1140',
  'san-bernardino': '1150', 'modesto': '1160', 'fontana': '1170',
  'oxnard': '1180', 'moreno-valley': '1190', 'glendale': '1200',
  'huntington-beach': '1210', 'santa-clarita': '1220', 'garden-grove': '1230',
  'oceanside': '1240', 'pomona': '1250', 'corona': '1260',
  'palmdale': '1270', 'lancaster': '1280', 'salinas': '1290',
};


const CATEGORIES = {
  estate: { name: 'Estate Planning', nameEs: 'Planificación Patrimonial', icon: '🏛️' },
  immigration: { name: 'Immigration Law', nameEs: 'Derecho Migratorio', icon: '🌎' },
  injury: { name: 'Personal Injury', nameEs: 'Lesiones Personales', icon: '🚗' },
  family: { name: 'Family Law', nameEs: 'Derecho Familiar', icon: '👨‍👩‍👧' },
  business: { name: 'Business Law', nameEs: 'Derecho Empresarial', icon: '💼' },
  realestate: { name: 'Real Estate', nameEs: 'Bienes Raíces', icon: '🏠' },
};

function getCityPhoto(slug) {
  return PICSUM_SEEDS[slug] || String(parseInt(slug.split('').reduce((a,c) => a + c.charCodeAt(0), 0)) % 900 + 100);
}

export default function CityPageClient({ service, cityData, content, contentEs, relatedCities, relatedServices, serviceSlug, citySlug, defaultLang }) {
  const { lang: userLang } = useLang();
  const lang = defaultLang || userLang;
  const t = T[lang]?.page || T['en'].page;
  const activeContent = lang === 'es' && contentEs ? contentEs : content;
  const category = CATEGORIES[service.category];
  const serviceName = lang === 'es' ? service.nameEs : service.name;
  const imgSeed = getCityPhoto(cityData.slug);

  return (
    <>
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '10px 16px', fontSize: '13px', color: '#6B7280' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        {' › '}
        <Link href={'/' + (serviceSlug || service.slug)} style={{ color: '#6B7280', textDecoration: 'none' }}>{serviceName}</Link>
        {' › '}
        <span style={{ color: '#374151' }}>{cityData.city}, CA</span>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)', color: 'white', padding: '32px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'start' }}>
            {/* Left */}
            <div style={{ flex: '1 1 280px', minWidth: '0' }}>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
                {category?.icon} {category?.name} · {cityData.county} County
              </span>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: '800', lineHeight: 1.2, margin: '0 0 16px' }}>
                {serviceName} in {cityData.city}, California
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.6, margin: '0 0 20px' }}>
                {activeContent?.intro || service.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['🏛️ ' + (lang === 'es' ? 'Licenciados en California' : 'California Licensed'), '🌎 Español & English', '📞 ' + (lang === 'es' ? 'Consulta Gratis' : 'Free Consultation'), '⚡ ' + (lang === 'es' ? 'Respuesta Rápida' : 'Fast Response')].map(b => (
                  <span key={b} style={{ fontSize: '12px', opacity: 0.85 }}>{b}</span>
                ))}
              </div>
            </div>
            {/* Form */}
            <div style={{ flex: '1 1 300px', minWidth: '280px', maxWidth: '400px' }}>
              <LeadForm service={service} city={cityData.city} county={cityData.county} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'start' }}>
          
          {/* Left column - content */}
          <div style={{ flex: '1 1 300px', minWidth: '0' }}>
            
            {/* City photo */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '28px', height: '220px', position: 'relative', background: '#E5E7EB' }}>
              <img
                src={'https://picsum.photos/seed/' + imgSeed + '/900/350'}
                alt={cityData.city + ', California'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.src = 'https://picsum.photos/seed/1000/900/350'; }}
              />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '20px 16px 12px' }}>
                <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{cityData.city}, {cityData.county} County, California</span>
              </div>
            </div>

            {/* What it is */}
            {activeContent?.whatItIs && (
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                  {lang === 'es' ? '¿Qué es' : 'What is'} {serviceName}?
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>{activeContent?.whatItIs}</p>
              </section>
            )}

            {/* Local context */}
            {activeContent?.localContext && (
              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #1E3A8A', borderRadius: '0 8px 8px 0', padding: '16px 20px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>
                  📍 {lang === 'es' ? 'Información Local' : 'Local Information'} — {cityData.county} County
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1E40AF', margin: 0 }}>{activeContent?.localContext}</p>
              </div>
            )}

            {/* Cost comparison */}
            {activeContent?.costComparison && (
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                  💰 {lang === 'es' ? '¿Cuánto cuesta?' : 'How much does it cost?'}
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>{activeContent?.costComparison}</p>
              </section>
            )}

            {/* FAQs */}
            {activeContent?.faqs && activeContent?.faqs.length > 0 && (
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1E3A8A', marginBottom: '16px' }}>
                  {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
                </h2>
                {activeContent?.faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A', margin: '0 0 8px' }}>Q: {faq.q}</h3>
                    <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#374151', margin: 0 }}>A: {faq.a}</p>
                  </div>
                ))}
              </section>
            )}


            {/* MS360 Self-Help Legal Docs — Backlink CTA */}
            <div style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #1e4fd4 100%)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}>
              <p style={{ color: '#93c5fd', fontSize: '13px', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'es' ? '¿Necesitas el documento ahora?' : 'Need the document now?'}
              </p>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, margin: '0 0 10px' }}>
                {lang === 'es' ? 'Prepara tu propio documento legal en minutos' : 'Prepare your own legal document in minutes'}
              </h3>
              <p style={{ color: '#bfdbfe', fontSize: '15px', margin: '0 0 16px', lineHeight: 1.6 }}>
                {lang === 'es'
                  ? 'MultiServicios360 es una plataforma bilingüe de autoayuda legal para familias latinas en California. Sin abogado, sin cita, desde $49.'
                  : 'MultiServicios360 is a bilingual self-help legal platform for Latino families in California. No attorney needed, starting at $49.'}
              </p>
              <a href="https://multiservicios360.net" target="_blank" rel="noopener"
                style={{ display: 'inline-block', background: '#F59E0B', color: 'white', fontWeight: 700, padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px' }}>
                {lang === 'es' ? 'Ir a MultiServicios360 →' : 'Visit MultiServicios360 →'}
              </a>
            </div>

            {/* Related cities */}
            {relatedCities.length > 0 && (
              <section style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                  {serviceName} — {lang === 'es' ? 'Ciudades Cercanas' : 'Nearby Cities'}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {relatedCities.map(c => (
                    <Link key={c.slug} href={'/' + (serviceSlug || service.slug) + '/' + c.slug}
                      style={{ padding: '6px 14px', border: '1px solid #BFDBFE', borderRadius: '20px', textDecoration: 'none', fontSize: '14px', color: '#1E40AF', background: '#EFF6FF' }}>
                      {c.city}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column - sticky form + related services */}
          <div style={{ flex: '0 0 300px', minWidth: '280px' }}>
            <div style={{ position: 'sticky', top: '80px' }}>
              <LeadForm service={service} city={cityData.city} county={cityData.county} />
              
              {relatedServices.length > 0 && (
                <div style={{ marginTop: '20px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                    {lang === 'es' ? 'Servicios Relacionados' : 'Related Services'} en {cityData.city}
                  </h3>
                  {relatedServices.map(s => (
                    <Link key={s.slug} href={'/' + s.slug + '/' + (citySlug || cityData.slug)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F3F4F6', textDecoration: 'none', color: '#374151', fontSize: '14px' }}>
                      <span>{lang === 'es' ? s.nameEs : s.name}</span>
                      <span style={{ color: '#9CA3AF' }}>→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MS360 DIY section */}
      {service.ms360Path && (
        <div style={{ background: '#EFF6FF', borderTop: '4px solid #F59E0B', padding: '36px 16px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  💡 {lang === 'es' ? '¿Prefiere hacerlo usted mismo?' : 'Prefer the DIY route?'}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E3A8A', marginBottom: '10px', lineHeight: 1.2 }}>
                  {lang === 'es' ? 'Prepare su ' + service.nameEs + ' en línea' : 'Prepare your ' + service.name + ' online'}
                </h2>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.65, margin: 0 }}>
                  {lang === 'es' ? 'Multi Servicios 360 es una plataforma bilingüe de autoayuda. Prepare sus propios documentos desde $' + service.ms360Price + '.' : 'Multi Servicios 360 is a bilingual self-help platform. Prepare your own documents from $' + service.ms360Price + '.'}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#1E3A8A', marginBottom: '4px' }}>desde ${service.ms360Price}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '14px' }}>vs. abogado ${service.attorneyMin?.toLocaleString()}+</div>
                <a href={'https://multiservicios360.net' + service.ms360Path} target="_blank" rel="noopener"
                  style={{ display: 'inline-block', background: '#1E3A8A', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>
                  {lang === 'es' ? '🖥️ Empezar en MS360 →' : '🖥️ Start on MS360 →'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ background: '#1E3A8A', color: 'white', padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 12px' }}>
          {serviceName} in {cityData.city}
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.9, margin: '0 0 24px' }}>
          {lang === 'es' ? 'Conéctate con un abogado experimentado hoy. Consulta gratis, servicio bilingüe.' : 'Connect with an experienced attorney today. Free consultation, bilingual service.'}
        </p>
        <a href="tel:+13234182252" style={{ display: 'inline-block', background: '#F59E0B', color: '#1E3A8A', padding: '16px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '18px' }}>
          📞 (323) 418-2252
        </a>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111827', color: '#9CA3AF', padding: '24px 16px', textAlign: 'center', fontSize: '12px' }}>
        <p style={{ margin: '0 0 6px', fontWeight: '600', color: 'white' }}>Mar Vista Law · California Legal Resource Center · marvistalaw.com</p>
        <p style={{ margin: '0 0 6px' }}>Mar Vista Law is a legal referral and resource service, not a law firm.</p>
        <p style={{ margin: 0 }}>
          {lang === 'es' ? '¿Prefiere preparar documentos usted mismo? Visite ' : 'Prefer to prepare documents yourself? Visit '}
          <a href="https://multiservicios360.net" style={{ color: '#F59E0B' }} target="_blank" rel="noopener">multiservicios360.net</a>
        </p>
      <div style={{ borderTop: '1px solid #1E293B', padding: '12px 16px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '11px', margin: 0 }}>
          Built by{' '}
          <a href="https://flashpreviewsconsultinggroup.com" target="_blank" rel="noopener noreferrer" style={{ color: '#9CA3AF', textDecoration: 'none', fontWeight: '600' }}>
            Flash Previews Consulting Group
          </a>
        </p>
      </div>
      </footer>
    </>
  );
}
