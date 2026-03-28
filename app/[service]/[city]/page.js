// app/[service]/[city]/page.js
import { notFound } from 'next/navigation';
import CityPageClient from '../../components/CityPageClient';
import { SERVICES, CITIES } from '../../lib/data';

export const dynamic = 'force-dynamic';

const SB_URL = 'https://wwaovysvcsesahcltuai.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YW92eXN2Y3Nlc2FoY2x0dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgxNDMsImV4cCI6MjA4NDYwNDE0M30.Ev5d1Dd_BDIsuRkMqWKnz6GQ2JMi26gIX4KC3eob-2w';

async function getContent(city, service) {
  try {
    const res = await fetch(
      SB_URL + '/rest/v1/marvistalaw_pages?city_slug=eq.' + city + '&service_slug=eq.' + service + '&select=content,content_es&limit=1',
      { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }, cache: 'no-store' }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return { en: rows[0]?.content || null, es: rows[0]?.content_es || null };
  } catch(e) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  const city = CITIES.find(c => c.slug === params.city);
  if (!service || !city) return { title: 'Legal Resource | Mar Vista Law' };
  const contentData = await getContent(params.city, params.service);
  const content = contentData?.en || null;
  const contentEs = contentData?.es || null;
  return {
    title: content?.metaTitle || (service.name + ' in ' + city.city + ', CA | Mar Vista Law'),
    description: content?.metaDescription || ('Find an experienced ' + service.name + ' attorney in ' + city.city + ', ' + city.county + ' County, California. Free consultation. Bilingual service.'),
    alternates: { canonical: 'https://marvistalaw.com/' + params.service + '/' + params.city },
  };
}

export default async function CityServicePage({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  const cityData = CITIES.find(c => c.slug === params.city);
  if (!service || !cityData) notFound();

  const contentData = await getContent(params.city, params.service);
  const content = contentData?.en || null;
  const contentEs = contentData?.es || null;

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
        name: service.name + ' — ' + cityData.city + ', CA',
        description: content?.metaDescription || service.description,
        url: 'https://marvistalaw.com/' + params.service + '/' + params.city,
        areaServed: { '@type': 'City', name: cityData.city },
        serviceType: service.name,
        availableLanguage: ['English', 'Spanish'],
        telephone: '(323) 418-2252',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://marvistalaw.com' },
          { '@type': 'ListItem', position: 2, name: service.name, item: 'https://marvistalaw.com/' + params.service },
          { '@type': 'ListItem', position: 3, name: cityData.city, item: 'https://marvistalaw.com/' + params.service + '/' + params.city },
        ],
      },
      ...(content?.faqs ? [{
        '@type': 'FAQPage',
        mainEntity: content.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a }
        }))
      }] : [])
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CityPageClient
        service={service}
        cityData={cityData}
        content={content}
        contentEs={contentEs}
        relatedCities={relatedCities}
        relatedServices={relatedServices}
        serviceSlug={params.service}
        citySlug={params.city}
      />
    </>
  );
}
