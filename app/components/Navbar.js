// app/components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', background: '#1E3A8A', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#F59E0B', fontWeight: '800', fontSize: '16px' }}>M</span>
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#1E3A8A', lineHeight: 1 }}>Mar Vista Law</div>
            <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1 }}>California Legal Resource Center</div>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/immigration" style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Immigration</Link>
          <Link href="/car-accident-attorney" style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Accidents</Link>
          <Link href="/living-trust" style={{ textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500' }}>Estate Planning</Link>
          <Link href="/contact" style={{
            textDecoration: 'none',
            background: '#1E3A8A',
            color: 'white',
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
          }}>Free Consultation</Link>
        </div>
      </div>
    </nav>
  );
}
