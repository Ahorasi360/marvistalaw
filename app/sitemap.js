// app/sitemap.js
// Next.js auto-generates sitemap.xml from this file
// Handles up to 50,000 URLs — split into multiple sitemaps if needed
import { SERVICES, CITIES } from './lib/data';

export default function sitemap() {
  const baseUrl = 'https://marvistalaw.com';
  const now = new Date().toISOString();

  const entries = [];

  // Homepage + service hub pages
  entries.push({ url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 });

  for (const service of SERVICES) {
    entries.push({
      url: `${baseUrl}/${service.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // All city+service pages
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

  return entries;
}
