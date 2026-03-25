// app/api/leads/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, language, service, serviceSlug, city, county, leadPrice } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Save lead
    const { data: lead, error } = await supabase
      .from('marvistalaw_leads')
      .insert({
        name,
        phone,
        email: email || null,
        language: language || 'es',
        service,
        service_slug: serviceSlug,
        city,
        county,
        lead_price: leadPrice,
        status: 'new',
        source: 'marvistalaw.com',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Send notification email via Resend
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'leads@out.multiservicios360.net',
          to: 'Ahorasi@multiservicios360.net',
          subject: `🔥 New Lead: ${service} in ${city} — Est. $${leadPrice}`,
          html: `
            <h2>New MarVistaLaw Lead</h2>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${email || 'Not provided'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Language</strong></td><td style="padding:8px;border:1px solid #ddd">${language === 'es' ? 'Spanish' : 'English'}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>Service</strong></td><td style="padding:8px;border:1px solid #ddd">${service}</td></tr>
              <tr><td style="padding:8px;border:1px solid #ddd"><strong>City</strong></td><td style="padding:8px;border:1px solid #ddd">${city}, ${county} County</td></tr>
              <tr style="background:#fef3c7"><td style="padding:8px;border:1px solid #ddd"><strong>Lead Value</strong></td><td style="padding:8px;border:1px solid #ddd"><strong>~$${leadPrice}</strong></td></tr>
            </table>
            <p style="margin-top:16px;color:#6b7280;font-size:12px">Lead ID: ${lead.id} · MarVistaLaw.com</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
