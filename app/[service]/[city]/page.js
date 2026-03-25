// app/[service]/[city]/page.js
// This one template renders ALL 33,540 city+service pages
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import LeadForm from '../../components/LeadForm';
import { supabase } from '../../lib/supabase';
import { SERVICES, CITIES, CATEGORIES } from '../../lib/data';

// ISR — cache forever, revalidate only if content changes
export const revalidate = 86400 * 30; // 30 days

// Generate metadata dynamically
export async function generateMetadata({ params }) {
  const { data } = await supabase
    .from('marvistalaw_pages')
    .select('content')
    .eq('city_slug', params.city)
    .eq('service_slug', params.service)
    .single();

  if (!data?.content) {
    return { title: 'Legal Resource | Mar Vista Law' };
  }

  return {
    title: data.content.metaTitle,
    description: data.content.metaDescription,
    alternates: { canonical: `https://marvistalaw.com/${params.service}/${params.city}` },
  };
}

export default async function CityServicePage({ params }) {
  const { service: serviceSlug, city: citySlug } = params;

  // Find service and city from static data
  const service = SERVICES.find(s => s.slug === serviceSlug);
  const cityData = CITIES.find(c => c.slug === citySlug);

  if (!service || !cityData) notFound();

  // Fetch generated content from Supabase
  const { data: pageData } = await supabase
    .from('marvistalaw_pages')
    .select('content')
    .eq('city_slug', citySlug)
    .eq('service_slug', serviceSlug)
    .single();

  // If content not yet generated, show skeleton with lead form
  const content = pageData?.content;
  const category = CATEGORIES[service.category];

  // Find related cities in same county
  const relatedCities = CITIES
    .filter(c => c.county === cityData.county && c.slug !== citySlug)
    .slice(0, 6);

  // Find related services in same category
  const relatedServices = SERVICES
    .filter(s => s.category === service.category && s.slug !== serviceSlug)
    .slice(0, 4);

  // Unsplash image for city (using city name as seed for consistency)
  const cityImageUrl = `https://images.unsplash.com/photo-${getCityImageId(cityData.city)}?auto=format&fit=crop&w=1200&q=80`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LegalService',
        name: `${service.name} — ${cityData.city}, CA`,
        description: content?.metaDescription || service.description,
        url: `https://marvistalaw.com/${serviceSlug}/${citySlug}`,
        areaServed: { '@type': 'City', name: cityData.city, containedIn: { '@type': 'State', name: 'California' } },
        serviceType: service.name,
        availableLanguage: ['English', 'Spanish'],
        telephone: '+18552467274',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://marvistalaw.com' },
          { '@type': 'ListItem', position: 2, name: service.name, item: `https://marvistalaw.com/${serviceSlug}` },
          { '@type': 'ListItem', position: 3, name: cityData.city, item: `https://marvistalaw.com/${serviceSlug}/${citySlug}` },
        ],
      },
      content?.faqs && {
        '@type': 'FAQPage',
        mainEntity: content.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    ].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', padding: '10px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', fontSize: '13px', color: '#6B7280' }}>
          <Link href="/" style={{ color: '#1E3A8A', textDecoration: 'none' }}>Home</Link>
          {' › '}
          <Link href={`/${serviceSlug}`} style={{ color: '#1E3A8A', textDecoration: 'none' }}>{service.name}</Link>
          {' › '}
          <span>{cityData.city}, CA</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)', color: 'white', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'center' }}>
          <div>
            {/* Category badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', marginBottom: '16px' }}>
              <span>{category?.icon}</span>
              <span>{category?.name} · {cityData.county} County</span>
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1.15, marginBottom: '16px' }}>
              {content?.h1 || `${service.name} in ${cityData.city}, CA`}
            </h1>

            <p style={{ fontSize: '17px', opacity: 0.9, lineHeight: 1.6, marginBottom: '24px', maxWidth: '560px' }}>
              {content?.intro || service.description}
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['🏛️ California Licensed', '🇺🇸 English & Español', '📞 Free Consultation', '⚡ Fast Response'].map(badge => (
                <span key={badge} style={{ fontSize: '13px', opacity: 0.85 }}>{badge}</span>
              ))}
            </div>
          </div>

          {/* Lead Form */}
          <div>
            <LeadForm service={service} city={cityData.city} county={cityData.county} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px' }}>

        {/* Left column — content */}
        <div>
          {/* City image */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '32px', aspectRatio: '16/7', background: '#E5E7EB', position: 'relative' }}>
            <Image
              src={`https://images.unsplash.com/photo-${getCityImageId(cityData.city)}?auto=format&fit=crop&w=1200&q=80`}
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
                What is a {service.name}?
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>{content.whatItIs}</p>
            </section>
          )}

          {/* Local context */}
          {content?.localContext && (
            <section style={{ background: '#EFF6FF', borderLeft: '4px solid #1E3A8A', borderRadius: '0 8px 8px 0', padding: '20px 24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E3A8A', marginBottom: '8px' }}>
                📍 {service.name} in {cityData.county} County
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1E40AF' }}>{content.localContext}</p>
            </section>
          )}

          {/* Cost comparison */}
          {content?.costComparison && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '12px' }}>
                💰 How Much Does It Cost in {cityData.city}?
              </h2>
              <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>{content.costComparison}</p>

              {/* DIY option for estate/civil docs */}
              {service.ms360Path && (
                <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '16px 20px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#065F46' }}>✅ Prefer to do it yourself?</div>
                    <div style={{ fontSize: '13px', color: '#047857' }}>Use Multi Servicios 360 — guided software from ${service.ms360Price}</div>
                  </div>
                  <a
                    href={`https://multiservicios360.net${service.ms360Path}`}
                    style={{ background: '#065F46', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}
                    target="_blank" rel="noopener"
                  >
                    Start DIY →
                  </a>
                </div>
              )}
            </section>
          )}

          {/* FAQ */}
          {content?.faqs && content.faqs.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E3A8A', marginBottom: '20px' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {content.faqs.map((faq, i) => (
                  <details key={i} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                    <summary style={{ padding: '16px 20px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                      {faq.q}
                      <span style={{ color: '#1E3A8A', fontSize: '20px' }}>+</span>
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
                {service.name} in Nearby Cities
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

        {/* Right sidebar */}
        <div style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
          {/* Second lead form */}
          <div style={{ marginBottom: '24px' }}>
            <LeadForm service={service} city={cityData.city} county={cityData.county} />
          </div>

          {/* Related services */}
          <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#1E3A8A' }}>Related Services in {cityData.city}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {relatedServices.map(s => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}/${citySlug}`}
                  style={{ textDecoration: 'none', padding: '10px 12px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}
                >
                  <span style={{ color: '#374151', fontWeight: '500' }}>{s.name}</span>
                  <span style={{ color: '#1E3A8A', fontSize: '16px' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ background: '#1E3A8A', color: 'white', padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
          {content?.ctaHeading || `Get Help with ${service.name} in ${cityData.city}`}
        </h2>
        <p style={{ fontSize: '17px', opacity: 0.9, marginBottom: '28px', maxWidth: '560px', margin: '0 auto 28px' }}>
          {content?.ctaSubtext || 'Connect with an experienced California attorney today. Free consultation, bilingual service.'}
        </p>
        <a
          href="tel:+18552467274"
          style={{ display: 'inline-block', background: '#F59E0B', color: '#1E3A8A', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '18px', textDecoration: 'none' }}
        >
          📞 Call Now: 855-246-7274
        </a>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '13px', opacity: 0.6, marginBottom: '8px' }}>
            © {new Date().getFullYear()} Mar Vista Law — California Legal Resource Center · marvistalaw.com
          </p>
          <p style={{ fontSize: '11px', opacity: 0.4, maxWidth: '600px', margin: '0 auto 12px' }}>
            Mar Vista Law is a legal referral and resource service. We are not a law firm and do not provide legal advice. Attorney referrals are provided for informational purposes.
          </p>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>
            Prefer to prepare documents yourself? Visit{' '}
            <a href="https://multiservicios360.net" style={{ color: '#F59E0B' }} target="_blank" rel="noopener">
              multiservicios360.net
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

// Deterministic Unsplash photo ID based on city name
function getCityImageId(cityName) {
  // Curated list of California city/architecture photos
  const photos = [
    '1534430480872-3498386e7856', // LA skyline
    '1449034446853-66c86144b0ad', // SF bay
    '1449824913935-59a10b8d2000', // downtown
    '1506905925346-21bda4d32df4', // california hills
    '1494522855154-9297ac14b55f', // modern building
    '1477959858617-67f85cf4f1df', // city lights
    '1418065460487-3e41a6c84dc5', // street view
    '1488646953014-85cb44e25828', // neighborhood
    '1501594907352-04cda38ebc29', // california
    '1460800109262-5a2ca887b832', // courthouse style
  ];
  // Hash city name to pick consistent photo
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) hash = (hash * 31 + cityName.charCodeAt(i)) & 0xFFFFFF;
  return photos[hash % photos.length];
}
