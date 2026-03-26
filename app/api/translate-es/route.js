// app/api/translate-es/route.js
// ONE-TIME translation batch script — delete after use
import { NextResponse } from 'next/server';

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const BATCH = 20;
const CONCURRENCY = 5;

async function sbFetch(path, opts = {}) {
  const res = await fetch(SB_URL + path, {
    ...opts,
    headers: {
      apikey: SB_SERVICE_KEY,
      Authorization: 'Bearer ' + SB_SERVICE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error('SB error ' + res.status + ': ' + t);
  }
  return opts.method === 'PATCH' ? null : res.json();
}

async function translateToSpanish(content, serviceName) {
  const fields = {
    metaTitle: content.metaTitle,
    metaDescription: content.metaDescription,
    h1: content.h1,
    intro: content.intro,
    whatItIs: content.whatItIs,
    localContext: content.localContext,
    costComparison: content.costComparison,
    ctaHeading: content.ctaHeading,
    ctaSubtext: content.ctaSubtext,
    faqs: content.faqs,
  };

  const prompt = `Translate the following legal content to Spanish for a California legal resource website. 
Service: ${serviceName}
Keep proper nouns (city names, courthouse names, company names) in English.
Keep legal terms accurate for California/US law in Spanish.
For faqs, translate both q and a fields.
Return ONLY valid JSON with the same structure. No markdown, no explanation.

${JSON.stringify(fields)}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error('Anthropic error ' + res.status);
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function processRow(row) {
  try {
    if (!row.content || row.content_es) return { id: row.id, status: 'skipped' };
    const translated = await translateToSpanish(row.content, row.service_name);
    await sbFetch(
      `/rest/v1/marvistalaw_pages?id=eq.${row.id}`,
      { method: 'PATCH', body: JSON.stringify({ content_es: translated }) }
    );
    return { id: row.id, status: 'ok' };
  } catch (e) {
    return { id: row.id, status: 'error', error: e.message };
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Step 1: Add column
  if (action === 'add-column') {
    try {
      await sbFetch('/rest/v1/rpc/exec_sql', {
        method: 'POST',
        body: JSON.stringify({ query: 'ALTER TABLE marvistalaw_pages ADD COLUMN IF NOT EXISTS content_es jsonb;' }),
      });
      return NextResponse.json({ ok: true, message: 'Column content_es added' });
    } catch (e) {
      // Try direct SQL via pg_query
      return NextResponse.json({ ok: false, error: e.message });
    }
  }

  // Step 2: Stats
  if (action === 'stats') {
    const total = await sbFetch('/rest/v1/marvistalaw_pages?select=count', {
      headers: { Prefer: 'count=exact', Range: '0-0' }
    }).catch(() => null);
    const done = await sbFetch('/rest/v1/marvistalaw_pages?content_es=not.is.null&select=count', {
      headers: { Prefer: 'count=exact', Range: '0-0' }
    }).catch(() => null);
    return NextResponse.json({ message: 'check headers for counts' });
  }

  // Step 3: Translate batch
  if (action === 'translate') {
    const rows = await sbFetch(
      `/rest/v1/marvistalaw_pages?select=id,content,service_name,content_es&content_es=is.null&content=not.is.null&limit=${BATCH}&offset=${offset}`
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ done: true, message: 'All rows translated!' });
    }

    // Process in parallel batches of CONCURRENCY
    const results = [];
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const batch = rows.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(batch.map(processRow));
      results.push(...batchResults);
    }

    const ok = results.filter(r => r.status === 'ok').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errors = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      done: false,
      offset,
      processed: rows.length,
      ok, skipped, errors,
      next_offset: offset + BATCH,
      errors_detail: results.filter(r => r.status === 'error').slice(0, 3),
    });
  }

  return NextResponse.json({ 
    usage: 'GET ?action=add-column | ?action=stats | ?action=translate&offset=0' 
  });
}
