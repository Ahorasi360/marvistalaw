// app/[service]/[city]/page.js
// ISR page — bilingual via client toggle
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import LeadForm from '../../components/LeadForm';
import CityPageClient from '../../components/CityPageClient';
import { SERVICES, CITIES } from '../../lib/data';

const SUPABASE_URL = 'https://wwaovysvcsesahcltuai.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YW92eXN2Y3Nlc2FoY2x0dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgxNDMsImV4cCI6MjA4NDYwNDE0M30.Ev5d1Dd_BDIsuRkMqWKnz6GQ2JMi26gIX4KC3eob-2w';

async function getPageContent(citySlug, serviceSlug) {
  try {
    const url = `\${SUPABASE_URL}/rest/v1/marvistalaw_pages?city_slug=eq.\${citySlug}&service_slug=eq.\${serviceSlug}&select=content&limit=1`;
    const res = await fetch(url, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer \${SUPABASE_KEY}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0]?.content || null;
  } catch(e) {
    console.error('Supabase fetch error:', e.message);
    return null;
  }
}

export const dynamic = 'force-dynamic'; // Always fetch fresh from Supabase

export async function generateMetadata({ params }) {
  const data = { content: await getPageContent(params.city, params.service) };

  const service = SERVICES.find(s => s.slug === params.service);
  const city = CITIES.find(c => c.slug === params.city);

  if (!service || !city) return { title: 'Legal Resource | Mar Vista Law' };

  return {
    title: data?.content?.metaTitle || `${service.name} in ${city.city}, CA | Mar Vista Law`,
    description: data?.content?.metaDescription || `Find an experienced ${service.name} attorney in ${city.city}, ${city.county} County, California. Free consultation. Bilingual English/Spanish service.`,
    alternates: { canonical: `https://marvistalaw.com/${params.service}/${params.city}` },
  };
}

export default async function CityServicePage({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  const cityData = CITIES.find(c => c.slug === params.city);
  if (!service || !cityData) notFound();

  const content = await getPageContent(params.city, params.service);

  const relatedCities = CITIES
    .filter(c => c.county === cityData.county && c.slug !== params.city)
    .slice(0, 6);

  const relatedServices = SERVICES
    .filter(s => s.category === service.category && s.slug !== params.service)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LegalService',
        name: `${service.name} — ${cityData.city}, CA`,
        description: content?.metaDescription || service.description,
        url: `https://marvistalaw.com/${params.service}/${params.city}`,
        areaServed: { '@type': 'City', name: cityData.city },
        serviceType: service.name,
        availableLanguage: ['English', 'Spanish'],
        telephone: '(323) 418-2252',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://marvistalaw.com' },
          { '@type': 'ListItem', position: 2, name: service.name, item: `https://marvistalaw.com/${params.service}` },
          { '@type': 'ListItem', position: 3, name: cityData.city, item: `https://marvistalaw.com/${params.service}/${params.city}` },
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
      <CityPageClient
        service={service}
        cityData={cityData}
        content={content}
        relatedCities={relatedCities}
        relatedServices={relatedServices}
        serviceSlug={params.service}
        citySlug={params.city}
      />
    </>
  );
}
