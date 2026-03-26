import { NextResponse } from 'next/server';

const SB = 'https://wwaovysvcsesahcltuai.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YW92eXN2Y3Nlc2FoY2x0dWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMjgxNDMsImV4cCI6MjA4NDYwNDE0M30.Ev5d1Dd_BDIsuRkMqWKnz6GQ2JMi26gIX4KC3eob-2w';
const HDR = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };

async function getRows(offset) {
  const url = SB + '/rest/v1/marvistalaw_pages?select=id,content,service_name,content_es&content_es=is.null&content=not.is.null&limit=10&offset=' + offset;
  const r = await fetch(url, { headers: HDR });
  if (!r.ok) throw new Error('SB GET ' + r.status + ' ' + await r.text());
  return r.json();
}

async function patchRow(id, data) {
  const r = await fetch(SB + '/rest/v1/marvistalaw_pages?id=eq.' + id, {
    method: 'PATCH',
    headers: { ...HDR, Prefer: 'return=minimal' },
    body: JSON.stringify({ content_es: data }),
  });
  if (!r.ok) throw new Error('SB PATCH ' + r.status + ' ' + await r.text());
}

async function translate(content, svc) {
  const ak = process.env.ANTHROPIC_API_KEY;
  if (!ak) throw new Error('No ANTHROPIC_API_KEY');
  const fields = {
    metaTitle: content.metaTitle || '',
    metaDescription: content.metaDescription || '',
    h1: content.h1 || '',
    intro: content.intro || '',
    whatItIs: content.whatItIs || '',
    localContext: content.localContext || '',
    costComparison: content.costComparison || '',
    ctaHeading: content.ctaHeading || '',
    ctaSubtext: content.ctaSubtext || '',
    faqs: content.faqs || [],
  };
  const prompt = 'Translate to Spanish for a California legal website. Service: ' + svc + '. Keep city/courthouse names in English. Return ONLY valid JSON same structure. No markdown.\n\n' + JSON.stringify(fields);
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': ak, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!r.ok) throw new Error('AI ' + r.status + ' ' + await r.text());
  const d = await r.json();
  const txt = (d.content[0].text || '').replace(/```json|```/g, '').trim();
  return JSON.parse(txt);
}

export async function GET(request) {
  try {
    const offset = parseInt(new URL(request.url).searchParams.get('offset') || '0');
    const rows = await getRows(offset);
    if (!rows || rows.length === 0) return NextResponse.json({ done: true, total_done: offset });
    
    const results = await Promise.allSettled(
      rows.map(async (row) => {
        if (!row.content || row.content_es) return 'skipped';
        const es = await translate(row.content, row.service_name || 'legal');
        await patchRow(row.id, es);
        return 'ok';
      })
    );
    
    const ok = results.filter(r => r.value === 'ok').length;
    const err = results.filter(r => r.status === 'rejected').map(r => r.reason?.message?.substring(0, 80));
    
    return NextResponse.json({ done: false, offset, ok, errors: err.length, err_sample: err.slice(0, 2), next: offset + 10 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
