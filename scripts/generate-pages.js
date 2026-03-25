#!/usr/bin/env node
// scripts/generate-pages.js
// Run: node scripts/generate-pages.js

const { createClient } = require('@supabase/supabase-js');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = 5; // Safe for Anthropic rate limits
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1800;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const { SERVICES, CITIES } = require('./data-cjs.js');

function buildQueue() {
  const queue = [];
  for (const city of CITIES) {
    for (const service of SERVICES) {
      queue.push({ city, service });
    }
  }
  console.log(`Total pages to generate: ${queue.length.toLocaleString()}`);
  return queue;
}

async function getExistingPages() {
  try {
    const { data, error } = await supabase
      .from('marvistalaw_pages')
      .select('city_slug, service_slug');
    if (error) return new Set();
    return new Set(data.map(r => `${r.city_slug}__${r.service_slug}`));
  } catch { return new Set(); }
}

function buildPrompt({ city, service }) {
  const hasDIY = !!service.ms360Path;
  const isInjury = service.category === 'injury';
  return `You are writing SEO content for MarVistaLaw.com. Output ONLY valid JSON, no markdown, no backticks.

PAGE: ${service.name} in ${city.city}, California (${city.county} County)
COURTHOUSE: ${city.courthouse}
${hasDIY ? `DIY OPTION: multiservicios360.net${service.ms360Path} from $${service.ms360Price}` : ''}
${isInjury ? 'ATTORNEY FEE: Contingency — no upfront cost.' : `ATTORNEY COST: $${service.attorneyMin}+`}

Return this JSON:
{
  "metaTitle": "under 60 chars",
  "metaDescription": "under 155 chars",
  "h1": "unique h1 under 65 chars",
  "intro": "130-160 words mentioning ${city.city} and ${city.county} County",
  "whatItIs": "150-180 words about ${service.name} in California",
  "localContext": "100-120 words mentioning ${city.courthouse}",
  "costComparison": "80-100 words comparing costs",
  "faqs": [
    {"q": "How long does this take in ${city.county} County?", "a": "60-70 words"},
    {"q": "Do I need an attorney?", "a": "60-70 words"},
    {"q": "What documents do I need?", "a": "60-70 words"},
    {"q": "What happens if I don't have this?", "a": "60-70 words"},
    {"q": "How do I get started in ${city.city}?", "a": "60-70 words"}
  ],
  "ctaHeading": "max 8 words",
  "ctaSubtext": "1 sentence",
  "relatedServices": ["slug1", "slug2", "slug3"]
}`;
}

async function generatePage({ city, service }, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          messages: [{ role: 'user', content: buildPrompt({ city, service }) }],
        }),
      });

      if (res.status === 529 || res.status === 429) {
        const wait = (attempt * 10000) + Math.random() * 5000;
        console.log(`  Rate limited on ${city.city}/${service.slug}, waiting ${Math.round(wait/1000)}s...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        throw new Error(`API ${res.status}`);
      }

      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      
      let content;
      try {
        content = JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) content = JSON.parse(match[0]);
        else throw new Error('Could not parse JSON');
      }
      return content;
    } catch (err) {
      if (attempt === retries) throw err;
      const wait = 3000 * attempt;
      console.log(`  Retry ${attempt} for ${city.city}/${service.slug} (${err.message}), waiting ${wait/1000}s...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

async function savePage({ city, service, content }) {
  const { error } = await supabase
    .from('marvistalaw_pages')
    .upsert({
      city_slug: city.slug,
      service_slug: service.slug,
      city_name: city.city,
      county: city.county,
      county_slug: city.countySlug,
      service_name: service.name,
      service_category: service.category,
      lead_price: service.leadPrice,
      ms360_path: service.ms360Path,
      ms360_price: service.ms360Price,
      lat: city.lat,
      lng: city.lng,
      courthouse: city.courthouse,
      recorder: city.recorder,
      content: content,
      generated_at: new Date().toISOString(),
    }, { onConflict: 'city_slug,service_slug' });
  if (error) throw error;
}

function pLimit(concurrency) {
  let running = 0;
  const queue = [];
  function run() {
    if (running >= concurrency || queue.length === 0) return;
    const { fn, resolve, reject } = queue.shift();
    running++;
    fn().then(resolve, reject).finally(() => { running--; run(); });
  }
  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      run();
    });
  };
}

async function main() {
  console.log('\n🚀 MarVistaLaw Page Generator');
  console.log('================================');
  console.log(`Model: ${MODEL} | Concurrency: ${CONCURRENCY}`);

  const allPages = buildQueue();
  const existing = await getExistingPages();
  const toGenerate = allPages.filter(
    ({ city, service }) => !existing.has(`${city.slug}__${service.slug}`)
  );

  console.log(`Already done: ${existing.size.toLocaleString()}`);
  console.log(`To generate: ${toGenerate.length.toLocaleString()}`);
  console.log('');

  if (toGenerate.length === 0) {
    console.log('✅ All pages already generated!');
    return;
  }

  const limit = pLimit(CONCURRENCY);
  let done = 0, errors = 0;
  const startTime = Date.now();

  const tasks = toGenerate.map(({ city, service }) =>
    limit(async () => {
      try {
        const content = await generatePage({ city, service });
        await savePage({ city, service, content });
        done++;
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = done / elapsed;
        const remaining = toGenerate.length - done;
        const eta = rate > 0 ? Math.round(remaining / rate / 3600 * 10) / 10 : '?';
        const pct = Math.round(done / toGenerate.length * 100);
        process.stdout.write(
          `\r✅ [${pct}%] ${done.toLocaleString()}/${toGenerate.length.toLocaleString()} | ${Math.round(rate * 10)/10}/s | ETA: ${eta}h | Errors: ${errors}   `
        );
      } catch (err) {
        errors++;
        console.error(`\n❌ Failed: ${city.city}/${service.slug} — ${err.message}`);
      }
    })
  );

  await Promise.all(tasks);

  const totalTime = ((Date.now() - startTime) / 1000 / 3600).toFixed(1);
  console.log(`\n\n✅ Done! ${done.toLocaleString()} pages in ${totalTime}h | ${errors} errors`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
