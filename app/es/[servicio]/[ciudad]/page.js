// app/es/[servicio]/[ciudad]/page.js
// Spanish SEO routes — reads content_es from Supabase for Google indexing
import { notFound } from 'next/navigation';
import CityPageClient from '../../../components/CityPageClient';
import { SERVICES, CITIES } from '../../../lib/data';

export const dynamic = 'force-dynamic';

const SB_URL = 'https://wwaovysvcsesahcltuai.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YW92eXN2Y3Nlc2FoY2x0dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgxNDMsImV4cCI6MjA4NDYwNDE0M30.Ev5d1Dd_BDIsuRkMqWKnz6GQ2JMi26gIX4KC3eob-2w';

async function getContent(citySlug, serviceSlug) {
  try {
    const res = await fetch(
      SB_URL + '/rest/v1/marvistalaw_pages?city_slug=eq.' + citySlug + '&service_slug=eq.' + serviceSlug + '&select=content,content_es&limit=1',
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
  const service = SERVICES.find(s => s.slugEs === params.servicio);
  const city = CITIES.find(c => c.slug === params.ciudad);
  if (!service || !city) return { title: 'Recurso Legal | Mar Vista Law' };
  const contentData = await getContent(params.ciudad, service.slug);
  const contentEs = contentData?.es || null;
  return {
    title: contentEs?.metaTitle || (service.nameEs + ' en ' + city.city + ', CA | MarVistaLaw'),
    description: contentEs?.metaDescription || ('Encuentra un abogado experto en ' + service.nameEs + ' en ' + city.city + ', California. Consulta gratis. Servicio bilingüe.'),
    alternates: {
      canonical: 'https://marvistalaw.com/es/' + params.servicio + '/' + params.ciudad,
      languages: {
        'en': 'https://marvistalaw.com/' + service.slug + '/' + params.ciudad,
        'es': 'https://marvistalaw.com/es/' + params.servicio + '/' + params.ciudad,
      }
    },
  };
}

export default async function EsCityServicePage({ params }) {
  const service = SERVICES.find(s => s.slugEs === params.servicio);
  const cityData = CITIES.find(c => c.slug === params.ciudad);
  if (!service || !cityData) notFound();

  const contentData = await getContent(params.ciudad, service.slug);
  const content = contentData?.en || null;
  const contentEs = contentData?.es || null;

  const relatedCities = CITIES
    .filter(c => c.county === cityData.county && c.slug !== params.ciudad)
    .slice(0, 6);

  const relatedServices = SERVICES
    .filter(s => s.category === service.category && s.slug !== service.slug)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LegalService',
        name: service.nameEs + ' — ' + cityData.city + ', CA',
        description: contentEs?.metaDescription || service.nameEs,
        url: 'https://marvistalaw.com/es/' + params.servicio + '/' + params.ciudad,
        areaServed: { '@type': 'City', name: cityData.city },
        serviceType: service.nameEs,
        availableLanguage: ['Spanish', 'English'],
        telephone: '(323) 418-2252',
        inLanguage: 'es',
      }
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
        serviceSlug={service.slug}
        citySlug={params.ciudad}
        defaultLang="es"
      />
    </>
  );
}
