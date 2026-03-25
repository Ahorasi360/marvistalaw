// app/page.js
import Link from 'next/link';
import Navbar from './components/Navbar';
import { SERVICES, CATEGORIES } from './lib/data';

export const metadata = {
  title: 'Mar Vista Law — California Legal Resource Center | Find an Attorney Today',
  description: 'Connect with experienced California attorneys for immigration, personal injury, estate planning, and family law. Free consultations. Bilingual English/Spanish service for all of California.',
};

const FEATURED_SERVICES = [
  { slug: 'car-accident-attorney', emoji: '🚗', highlight: 'No upfront fees' },
  { slug: 'green-card-application', emoji: '🌎', highlight: 'Bilingual attorneys' },
  { slug: 'living-trust', emoji: '🏛️', highlight: 'From $599 DIY' },
  { slug: 'divorce-attorney', emoji: '⚖️', highlight: 'Free consultation' },
  { slug: 'llc-formation', emoji: '💼', highlight: 'Start today' },
  { slug: 'workers-compensation', emoji: '🦺', highlight: 'No win no fee' },
];

export default function HomePage() {
  const featuredServices = FEATURED_SERVICES.map(f => ({
    ...f,
    service: SERVICES.find(s => s.slug === f.slug),
  })).filter(f => f.service);

  const categoryList = Object.entries(CATEGORIES);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 60%, #1D4ED8 100%)', color: 'white', padding: '72px 16px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', marginBottom: '20px' }}>
            🌎 Serving All 482 Cities Across California · English & Español
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '800', lineHeight: 1.1, marginBottom: '20px' }}>
            California Legal Help<br />
            <span style={{ color: '#FCD34D' }}>When You Need It Most</span>
          </h1>
          <p style={{ fontSize: '19px', opacity: 0.9, maxWidth: '620px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Connect with experienced California attorneys for immigration, personal injury, estate planning, and more. Free consultations. Bilingual service.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+18552467274" style={{ background: '#F59E0B', color: '#1E3A8A', padding: '16px 32px', borderRadius: '10px', fontWeight: '800', fontSize: '18px', textDecoration: 'none' }}>
              📞 Free Consultation
            </a>
            <Link href="/car-accident-attorney/los-angeles" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 32px', borderRadius: '10px', fontWeight: '700', fontSize: '18px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
              Find an Attorney →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section style={{ padding: '64px 16px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '8px', color: '#1E3A8A' }}>
            Our Practice Areas
          </h2>
          <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '40px' }}>51 legal services across all of California</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {featuredServices.map(({ service, emoji, highlight }) => (
              <Link
                key={service.slug}
                href={`/${service.slug}/los-angeles`}
                style={{ textDecoration: 'none', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', background: 'white', transition: 'all 0.15s', display: 'block' }}
              >
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{emoji}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E3A8A', marginBottom: '6px' }}>{service.name}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '10px', lineHeight: 1.5 }}>{service.description}</div>
                <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  {highlight}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section style={{ padding: '64px 16px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '40px', color: '#1E3A8A' }}>Why Mar Vista Law?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '🌎', title: 'Bilingual Service', desc: 'Every attorney speaks English and Spanish fluently' },
              { icon: '📍', title: 'All of California', desc: '482 cities covered — from Calexico to Redding' },
              { icon: '⚡', title: 'Fast Response', desc: '24-hour response guarantee on all consultations' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'Know the cost upfront — no surprises' },
              { icon: '🏛️', title: 'Licensed Attorneys', desc: 'All referrals are California State Bar licensed' },
              { icon: '🔒', title: '100% Confidential', desc: 'Attorney-client privilege from the first call' },
            ].map(item => (
              <div key={item.title} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px', color: '#1E3A8A' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIY section — MS360 bridge */}
      <section style={{ background: '#EFF6FF', borderTop: '1px solid #BFDBFE', borderBottom: '1px solid #BFDBFE', padding: '48px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1E3A8A', marginBottom: '12px' }}>
            Prefer to Prepare Documents Yourself?
          </h2>
          <p style={{ color: '#1E40AF', marginBottom: '24px', fontSize: '16px', lineHeight: 1.6 }}>
            Multi Servicios 360 is a bilingual self-help platform that guides you through creating your own legal documents — no attorney required for simpler needs.
          </p>
          <a
            href="https://multiservicios360.net"
            target="_blank"
            rel="noopener"
            style={{ display: 'inline-block', background: '#1E3A8A', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}
          >
            Visit MultiServicios360.net →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111827', color: 'white', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontWeight: '800', fontSize: '20px', marginBottom: '8px' }}>Mar Vista Law</div>
          <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '16px' }}>California Legal Resource Center · All 58 Counties · Bilingual</div>
          <p style={{ fontSize: '11px', opacity: 0.4, maxWidth: '500px', margin: '0 auto' }}>
            Mar Vista Law is a legal resource and referral service, not a law firm. We do not provide legal advice. Attorney referrals are for informational purposes only.
          </p>
          <p style={{ fontSize: '13px', opacity: 0.5, marginTop: '16px' }}>© {new Date().getFullYear()} MarVistaLaw.com · 855-246-7274</p>
        </div>
      </footer>
    </>
  );
}
