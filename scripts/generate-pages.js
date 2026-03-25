#!/usr/bin/env node
// scripts/generate-pages.js — uses Node.js built-in https (no fetch needed)

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const { SERVICES, CITIES } = require('./data-cjs.js');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = 10;
const MODEL = 'claude-haiku-4-5-20251001';

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env vars!');
  console.error('  ANTHROPIC_API_KEY:', !!ANTHROPIC_KEY);
  console.error('  NEXT_PUBLIC_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('  SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_KEY);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── HTTP request using built-in https module ──────────────────────────────────
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const options = {
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(new Error(`JSON parse error: ${data.slice(0, 100)}`)); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Request timeout')); });
    req.write(postData);
    req.end();
  });
}

// ── Build prompt ──────────────────────────────────────────────────────────────
function buildPrompt({ city, service }) {
  const hasDIY = !!service.ms360Path;
  const isInjury = service.category === 'injury';
  return `You are writing SEO content for MarVistaLaw.com, a California legal resource center. Output ONLY valid JSON, no markdown, no backticks.

PAGE: ${service.name} in ${city.city}, California (${city.county} County)
COURTHOUSE: ${city.courthouse}
${hasDIY ? `DIY OPTION: multiservicios360.net${service.ms360Path} from $${service.ms360Price}` : ''}
${isInjury ? 'FEE: Contingency, no upfront cost, 33% of settlement.' : `ATTORNEY COST: $${service.attorneyMin}+`}

Return this JSON:
{"metaTitle":"under 60 chars with service+city","metaDescription":"under 155 chars","h1":"unique h1 under 65 chars","intro":"130-160 words about ${service.name} in ${city.city} CA","whatItIs":"150-180 words explaining ${service.name} in California","localContext":"100-120 words mentioning ${city.courthouse} and local procedures","costComparison":"80-100 words on cost${isInjury ? ', contingency fees' : ''}","faqs":[{"q":"How long does this take in ${city.county} County?","a":"60-70 words"},{"q":"${isInjury ? 'What is my case worth?' : 'Do I need an attorney?'}","a":"60-70 words"},{"q":"What documents do I need?","a":"60-70 words"},{"q":"What if I wait too long?","a":"60-70 words"},{"q":"How do I get started in ${city.city}?","a":"60-70 words"}],"ctaHeading":"max 8 words","ctaSubtext":"1 sentence","relatedServices":["slug1","slug2","slug3"]}`;
}

// ── Call Anthropic API ────────────────────────────────────────────────────────
async function generatePage({ city, service }, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const data = await httpsPost(
        'api.anthropic.com',
        '/v1/messages',
        {
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        {
          model: MODEL,
          max_tokens: 1800,
          messages: [{ role: 'user', content: buildPrompt({ city, service }) }],
        }
      );

      const text = data.content?.[0]?.text || '';
      try {
        return JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error('No JSON in response');
      }
    } catch (err) {
      if (attempt === retries) throw err;
      const wait = err.message.includes('529') || err.message.includes('429') ? 15000 : 3000;
      process.stdout.write(`\n  Retry ${attempt} for ${city.city}/${service.slug} (${err.message.slice(0,50)})...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// ── Save to Supabase ──────────────────────────────────────────────────────────
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
      content,
      generated_at: new Date().toISOString(),
    }, { onConflict: 'city_slug,service_slug' });
  if (error) throw error;
}

// ── Concurrency limiter ───────────────────────────────────────────────────────
function pLimit(n) {
  let running = 0;
  const queue = [];
  function run() {
    if (running >= n || !queue.length) return;
    const { fn, resolve, reject } = queue.shift();
    running++;
    fn().then(resolve, reject).finally(() => { running--; run(); });
  }
  return fn => new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); run(); });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 MarVistaLaw Page Generator');
  console.log('================================');
  console.log(`Model: ${MODEL} | Concurrency: ${CONCURRENCY}`);

  // Test Anthropic connection first
  console.log('\nTesting Anthropic API connection...');
  try {
    await httpsPost('api.anthropic.com', '/v1/messages',
      { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      { model: MODEL, max_tokens: 10, messages: [{ role: 'user', content: 'Say OK' }] }
    );
    console.log('✅ Anthropic API connected!');
  } catch (err) {
    console.error('❌ Cannot reach Anthropic API:', err.message);
    process.exit(1);
  }

  // Test Supabase connection
  console.log('Testing Supabase connection...');
  const { error: dbErr } = await supabase.from('marvistalaw_pages').select('count').limit(1);
  if (dbErr) {
    console.error('❌ Supabase error:', dbErr.message);
    process.exit(1);
  }
  console.log('✅ Supabase connected!\n');

  // Build queue
  const queue = [];
  for (const city of CITIES) {
    for (const service of SERVICES) {
      queue.push({ city, service });
    }
  }

  // Check existing
  const { data: existing } = await supabase
    .from('marvistalaw_pages')
    .select('city_slug,service_slug');
  const done = new Set((existing || []).map(r => `${r.city_slug}__${r.service_slug}`));

  const todo = queue.filter(({ city, service }) => !done.has(`${city.slug}__${service.slug}`));

  console.log(`Total: ${queue.length.toLocaleString()} | Done: ${done.size.toLocaleString()} | To generate: ${todo.length.toLocaleString()}`);

  if (!todo.length) { console.log('\n✅ All pages done!'); return; }

  const limit = pLimit(CONCURRENCY);
  let completed = 0, errors = 0;
  const start = Date.now();

  const tasks = todo.map(({ city, service }) =>
    limit(async () => {
      try {
        const content = await generatePage({ city, service });
        await savePage({ city, service, content });
        completed++;
        if (completed % 10 === 0) {
          const rate = completed / ((Date.now() - start) / 1000);
          const eta = Math.round((todo.length - completed) / rate / 3600 * 10) / 10;
          const pct = Math.round(completed / todo.length * 100);
          process.stdout.write(`\r[${pct}%] ${completed.toLocaleString()}/${todo.length.toLocaleString()} | ${Math.round(rate)}/s | ETA: ${eta}h | Errors: ${errors}  `);
        }
      } catch (err) {
        errors++;
        process.stdout.write(`\n❌ ${city.city}/${service.slug}: ${err.message.slice(0, 60)}`);
      }
    })
  );

  await Promise.all(tasks);
  const hrs = ((Date.now() - start) / 3600000).toFixed(1);
  console.log(`\n\n✅ Done! ${completed.toLocaleString()} pages in ${hrs}h | ${errors} errors`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
