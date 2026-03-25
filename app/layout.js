// app/layout.js
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://marvistalaw.com'),
  title: { default: 'Mar Vista Law — California Legal Resource Center', template: '%s | MarVistaLaw.com' },
  description: 'Find experienced California attorneys for immigration, personal injury, estate planning, business law, and family law. Free legal resource center serving all of California.',
  keywords: 'California attorney, legal help California, immigration lawyer, personal injury attorney, living trust California, divorce attorney',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'Mar Vista Law' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
