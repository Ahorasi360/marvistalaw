// app/sitemap.js
// Next.js auto-generates sitemap.xml from this file
// EN: 13,570 pages + ES: 13,570 pages = 27,140 total
import { SERVICES, CITIES } from './lib/data';

export default function sitemap() {
  const baseUrl = 'https://marvistalaw.com';
  const now = new Date().toISOString();

  const entries = [];

  // Homepage
  entries.push({ url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 });

  // Service hub pages (EN)
  for (const service of SERVICES) {
    entries.push({
      url: `${baseUrl}/${service.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Service hub pages (ES)
  for (const service of SERVICES) {
    if (!service.slugEs) continue;
    entries.push({
      url: `${baseUrl}/es/${service.slugEs}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // All city+service pages (EN) — 13,570 pages
  for (const city of CITIES) {
    for (const service of SERVICES) {
      entries.push({
        url: `${baseUrl}/${service.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  // All city+service pages (ES) — 13,570 pages
  for (const city of CITIES) {
    for (const service of SERVICES) {
      if (!service.slugEs) continue;
      entries.push({
        url: `${baseUrl}/es/${service.slugEs}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
