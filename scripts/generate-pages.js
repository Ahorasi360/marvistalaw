#!/usr/bin/env node
// scripts/generate-pages.js — uses ONLY Node.js built-in https, no fetch anywhere

const https = require('https');
const { SERVICES, CITIES } = require('./data-cjs.js');

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = 10;
const MODEL = 'claude-haiku-4-5-20251001';

if (!ANTHROPIC_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing env vars!');
  process.exit(1);
}

// Parse hostname from URL
const SUPABASE_HOST = SUPABASE_URL.replace('https://', '').replace('http://', '').split('/')[0];

// ── Generic HTTPS request ─────────────────────────────────────────────────────
function httpsReq(method, hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const opts = {
      hostname, port: 443, path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...headers,
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve({ body: JSON.parse(data), status: res.statusCode }); }
          catch { resolve({ body: data, status: res.statusCode }); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
    if (postData) req.write(postData);
    req.end();
  });
}

// ── Supabase REST API (no SDK) ────────────────────────────────────────────────
async function supabaseQuery(path, method = 'GET', body = null, extraHeaders = {}) {
  return httpsReq(method, SUPABASE_HOST, `/rest/v1${path}`, {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'return=minimal',
    ...extraHeaders,
  }, body);
}

async function supabaseSelect(table, columns, filters = {}) {
  let qs = `select=${columns}`;
  for (const [k, v] of Object.entries(filters)) qs += `&${k}=eq.${v}`;
  const r = await httpsReq('GET', SUPABASE_HOST, `/rest/v1/${table}?${qs}`, {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Accept': 'application/json',
  });
  return r.body;
}

async function supabaseUpsert(table, data) {
  return httpsReq('POST', SUPABASE_HOST, `/rest/v1/${table}`, {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Prefer': 'resolution=merge-duplicates,return=minimal',
    'Content-Type': 'application/json',
  }, data);
}

// ── Anthropic API ─────────────────────────────────────────────────────────────
async function callAnthropic(prompt) {
  const r = await httpsReq('POST', 'api.anthropic.com', '/v1/messages', {
    'x-api-key': ANTHROPIC_KEY,
    'anthropic-version': '2023-06-01',
  }, {
    model: MODEL,
    max_tokens: 1800,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = r.body.content?.[0]?.text || '';
  try { return JSON.parse(text); }
  catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error('No JSON in response');
  }
}

// ── Build prompt ──────────────────────────────────────────────────────────────
function buildPrompt({ city, service }) {
  const hasDIY = !!service.ms360Path;
  const isInjury = service.category === 'injury';
  return `You are writing SEO content for MarVistaLaw.com, a California legal resource center. Output ONLY valid JSON, no markdown, no backticks.

PAGE: ${service.name} in ${city.city}, California (${city.county} County)
COURTHOUSE: ${city.courthouse}
${hasDIY ? `DIY OPTION: multiservicios360.net${service.ms360Path} from $${service.ms360Price}` : ''}
${isInjury ? 'FEE: Contingency, no upfront cost.' : `ATTORNEY COST: $${service.attorneyMin}+`}

Return this JSON:
{"metaTitle":"under 60 chars","metaDescription":"under 155 chars","h1":"unique h1 under 65 chars","intro":"130-160 words about ${service.name} in ${city.city} CA","whatItIs":"150-180 words explaining ${service.name} in California","localContext":"100-120 words mentioning ${city.courthouse}","costComparison":"80-100 words on cost","faqs":[{"q":"How long in ${city.county} County?","a":"60-70 words"},{"q":"Do I need an attorney?","a":"60-70 words"},{"q":"What documents do I need?","a":"60-70 words"},{"q":"What if I wait too long?","a":"60-70 words"},{"q":"How to get started in ${city.city}?","a":"60-70 words"}],"ctaHeading":"max 8 words","ctaSubtext":"1 sentence","relatedServices":["slug1","slug2"]}`;
}

// ── p-limit ───────────────────────────────────────────────────────────────────
function pLimit(n) {
  let running = 0; const queue = [];
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
  console.log('\n🚀 MarVistaLaw Page Generator v3 (https only)');
  console.log('==============================================');
  console.log(`Supabase host: ${SUPABASE_HOST}`);

  // Test connections
  console.log('\nTesting Anthropic...');
  try {
    await httpsReq('POST', 'api.anthropic.com', '/v1/messages',
      { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      { model: MODEL, max_tokens: 5, messages: [{ role: 'user', content: 'Hi' }] }
    );
    console.log('✅ Anthropic OK');
  } catch (e) { console.error('❌ Anthropic:', e.message); process.exit(1); }

  console.log('Testing Supabase...');
  try {
    const r = await supabaseSelect('marvistalaw_pages', 'count', {});
    console.log('✅ Supabase OK, response type:', typeof r);
  } catch (e) { console.error('❌ Supabase:', e.message); process.exit(1); }

  // Get existing pages
  console.log('Loading existing pages...');
  let existing = [];
  try {
    existing = await supabaseSelect('marvistalaw_pages', 'city_slug,service_slug', {});
    if (!Array.isArray(existing)) existing = [];
  } catch (e) { console.log('No existing pages yet'); }

  const done = new Set(existing.map(r => `${r.city_slug}__${r.service_slug}`));

  // Build queue
  const todo = [];
  for (const city of CITIES) {
    for (const service of SERVICES) {
      if (!done.has(`${city.slug}__${service.slug}`)) {
        todo.push({ city, service });
      }
    }
  }

  console.log(`\nTotal: ${CITIES.length * SERVICES.length} | Done: ${done.size} | To generate: ${todo.length}\n`);
  if (!todo.length) { console.log('✅ All done!'); return; }

  const limit = pLimit(CONCURRENCY);
  let completed = 0, errors = 0;
  const start = Date.now();

  const tasks = todo.map(({ city, service }) =>
    limit(async () => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const content = await callAnthropic(buildPrompt({ city, service }));
          await supabaseUpsert('marvistalaw_pages', {
            city_slug: city.slug, service_slug: service.slug,
            city_name: city.city, county: city.county, county_slug: city.countySlug,
            service_name: service.name, service_category: service.category,
            lead_price: service.leadPrice, ms360_path: service.ms360Path, ms360_price: service.ms360Price,
            lat: city.lat, lng: city.lng, courthouse: city.courthouse, recorder: city.recorder,
            content, generated_at: new Date().toISOString(),
          });
          completed++;
          if (completed % 10 === 0) {
            const rate = completed / ((Date.now() - start) / 1000);
            const eta = ((todo.length - completed) / rate / 3600).toFixed(1);
            const pct = Math.round(completed / todo.length * 100);
            process.stdout.write(`\r[${pct}%] ${completed}/${todo.length} | ${Math.round(rate)}/s | ETA: ${eta}h | ❌ ${errors}  `);
          }
          return;
        } catch (e) {
          if (attempt === 3) {
            errors++;
            process.stdout.write(`\n❌ ${city.city}/${service.slug}: ${e.message.slice(0,60)}\n`);
          } else {
            await new Promise(r => setTimeout(r, 3000 * attempt));
          }
        }
      }
    })
  );

  await Promise.all(tasks);
  console.log(`\n\n✅ Done! ${completed} pages in ${((Date.now()-start)/3600000).toFixed(1)}h | ${errors} errors`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
