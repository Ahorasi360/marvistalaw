#!/usr/bin/env node
// scripts/generate-pages.js
// Generates ALL 33,540 city+service pages in parallel batches
// Usage: node scripts/generate-pages.js
// Env vars needed: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

// fetch is native in Node 18+
const { createClient } = require('@supabase/supabase-js');

// ── Config ──────────────────────────────────────────────────────────────────
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = 10; // 40 parallel requests — safe within Anthropic rate limits
const MODEL = 'claude-haiku-4-5-20251001'; // Haiku = fast + cheap for bulk generation
const MAX_TOKENS = 1800;

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Import data ──────────────────────────────────────────────────────────────
// Using require-style since this is a Node script
const { SERVICES, CITIES } = require('./data-cjs.js');

// ── Build the work queue ─────────────────────────────────────────────────────
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

// ── Check which pages already exist ─────────────────────────────────────────
async function getExistingPages() {
  const { data, error } = await supabase
    .from('marvistalaw_pages')
    .select('city_slug, service_slug');
  if (error) {
    console.log('Table may not exist yet — will create via first insert');
    return new Set();
  }
  return new Set(data.map(r => `${r.city_slug}__${r.service_slug}`));
}

// ── Build prompt for a page ───────────────────────────────────────────────────
function buildPrompt({ city, service }) {
  const hasDIY = !!service.ms360Path;
  const isInjury = service.category === 'injury';
  const isImmigration = service.category === 'immigration';

  return `You are writing SEO content for MarVistaLaw.com, a California legal resource center. Output ONLY valid JSON.

PAGE: ${service.name} in ${city.city}, California (${city.county} County)
COURTHOUSE: ${city.courthouse}
COUNTY RECORDER: ${city.recorder}
${hasDIY ? `DIY OPTION: multiservicios360.net${service.ms360Path} — from $${service.ms360Price}` : ''}
${isInjury ? 'ATTORNEY FEE: Contingency — no upfront cost. Typically 33% of settlement.' : ''}
${!isInjury && !isImmigration ? `ATTORNEY COST: $${service.attorneyMin}–${service.attorneyMin * 3}+` : ''}

Return this JSON (no markdown, no backticks):
{
  "metaTitle": "under 60 chars, include service+city",
  "metaDescription": "under 155 chars, compelling with city+benefit",
  "h1": "unique, specific h1 under 65 chars",
  "intro": "2-3 sentences, 130-160 words, mention ${city.city} and ${city.county} County, explain why locals need this",
  "whatItIs": "150-180 words, what ${service.name} is, why it matters in California, consequences of not having it",
  "localContext": "100-120 words, mention ${city.courthouse}, ${city.recorder}, local procedures, California-specific deadlines",
  "costComparison": "${isInjury ? '80-100 words about contingency fees, no win no fee, typical settlement ranges' : `80-100 words comparing attorney cost ($${service.attorneyMin}+) to ${hasDIY ? `DIY at MS360 ($${service.ms360Price})` : 'our free referral service'}`}",
  "faqs": [
    {"q": "How long does this take in ${city.county} County?", "a": "60-70 word answer"},
    {"q": "${isInjury ? 'What is my case worth?' : 'Do I need an attorney or can I do this myself?'}", "a": "60-70 word answer"},
    {"q": "What documents do I need?", "a": "60-70 word answer"},
    {"q": "What happens if I don't ${isInjury ? 'file in time' : 'have this document'}?", "a": "60-70 word answer"},
    {"q": "How do I get started in ${city.city}?", "a": "60-70 word answer"}
  ],
  "ctaHeading": "action-oriented heading, max 8 words",
  "ctaSubtext": "1 sentence creating urgency or trust",
  "relatedServices": ["slug1", "slug2", "slug3"]
}`;
}

// ── Generate one page via Claude API ─────────────────────────────────────────
async function generatePage({ city, service }, retries = 3) {
  const prompt = buildPrompt({ city, service });

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
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        if (res.status === 529 || res.status === 429) {
          // Rate limited — wait and retry
          const wait = attempt * 5000;
          console.log(`  Rate limited, waiting ${wait}ms...`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        throw new Error(`API ${res.status}: ${err.slice(0, 200)}`);
      }

      const data = await res.json();
      const text = data.content?.[0]?.text || '';

      // Parse JSON from response
      let content;
      try {
        content = JSON.parse(text);
      } catch {
        // Try to extract JSON if there's any surrounding text
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          content = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse JSON from response');
        }
      }

      return content;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// ── Save page to Supabase ─────────────────────────────────────────────────────
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
      content: content, // Full JSON stored as JSONB
      generated_at: new Date().toISOString(),
    }, { onConflict: 'city_slug,service_slug' });

  if (error) throw error;
}

// ── Simple p-limit implementation ─────────────────────────────────────────────
function pLimit(concurrency) {
  let running = 0;
  const queue = [];

  function run() {
    if (running >= concurrency || queue.length === 0) return;
    const { fn, resolve, reject } = queue.shift();
    running++;
    fn().then(resolve, reject).finally(() => {
      running--;
      run();
    });
  }

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      run();
    });
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 MarVistaLaw Page Generator');
  console.log('================================');
  console.log(`Model: ${MODEL} | Concurrency: ${CONCURRENCY}`);

  const queue = buildQueue();
  const existing = await getExistingPages();

  // Filter out already-generated pages (resume support)
  const toGenerate = queue.filter(
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
  let done = 0;
  let errors = 0;
  const startTime = Date.now();

  const tasks = toGenerate.map(({ city, service }) =>
    limit(async () => {
      try {
        const content = await generatePage({ city, service });
        await savePage({ city, service, content });
        done++;

        if (done % 50 === 0) {
          const elapsed = (Date.now() - startTime) / 1000;
          const rate = done / elapsed;
          const remaining = toGenerate.length - done;
          const eta = Math.round(remaining / rate / 3600 * 10) / 10;
          const pct = Math.round(done / toGenerate.length * 100);
          process.stdout.write(
            `\r[${pct}%] ${done.toLocaleString()}/${toGenerate.length.toLocaleString()} | ${Math.round(rate)}/s | ETA: ${eta}h | Errors: ${errors}  `
          );
        }
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
