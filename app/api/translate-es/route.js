// app/api/translate-es/route.js
// ONE-TIME translation batch — delete after use v2
import { NextResponse } from 'next/server';

const SB_URL = 'https://wwaovysvcsesahcltuai.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YW92eXN2Y3Nlc2FoY2x0dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgxNDMsImV4cCI6MjA4NDYwNDE0M30.Ev5d1Dd_BDIsuRkMqWKnz6GQ2JMi26gIX4KC3eob-2w';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const BATCH = 15;
const CONCURRENCY = 5;

async function sbFetch(path, opts = {}) {
  const res = await fetch(SB_URL + path, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: 'Bearer ' + SB_KEY,
      'Content-Type': 'application/json',
      Prefer: opts.method === 'PATCH' ? 'return=minimal' : 'return=representation',
      ...opts.headers,
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error('SB ' + res.status + ': ' + t.substring(0, 200));
  }
  if (opts.method === 'PATCH') return null;
  return res.json();
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

  const prompt = 'Translate to Spanish for a California legal website. Service: ' + serviceName + '. Keep city/courthouse names in English. Return ONLY valid JSON same structure. No markdown.

' + JSON.stringify(fields);

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
  if (!res.ok) throw new Error('Anthropic ' + res.status);
  const data = await res.json();
  const text = data.content?.[0]?.text || '{}';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

async function processRow(row) {
  try {
    if (!row.content || row.content_es) return { id: row.id, status: 'skipped' };
    const translated = await translateToSpanish(row.content, row.service_name || 'legal service');
    await sbFetch('/rest/v1/marvistalaw_pages?id=eq.' + row.id, {
      method: 'PATCH',
      body: JSON.stringify({ content_es: translated }),
    });
    return { id: row.id, status: 'ok' };
  } catch (e) {
    return { id: row.id, status: 'error', error: e.message.substring(0, 100) };
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const rows = await sbFetch(
      '/rest/v1/marvistalaw_pages?select=id,content,service_name,content_es&content_es=is.null&content=not.is.null&limit=' + BATCH + '&offset=' + offset
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ done: true, message: 'All done!' });
    }

    const results = [];
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const batch = rows.slice(i, i + CONCURRENCY);
      const br = await Promise.all(batch.map(processRow));
      results.push(...br);
    }

    const ok = results.filter(r => r.status === 'ok').length;
    const errors = results.filter(r => r.status === 'error');

    return NextResponse.json({
      done: false,
      offset,
      processed: rows.length,
      ok,
      errors: errors.length,
      errors_detail: errors.slice(0, 2),
      next_offset: offset + BATCH,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
