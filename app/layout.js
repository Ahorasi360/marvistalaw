// app/layout.js
import './globals.css';
import { LanguageProvider } from './lib/LanguageContext';

export const metadata = {
  metadataBase: new URL('https://marvistalaw.com'),
  title: { default: 'Mar Vista Law — California Legal Resource Center', template: '%s | MarVistaLaw.com' },
  description: 'Find experienced California attorneys for immigration, personal injury, estate planning, business law, and family law. Free legal resource center serving all of California. Bilingual English/Spanish.',
  keywords: 'California attorney, legal help California, immigration lawyer, personal injury attorney, living trust California, divorce attorney, abogado California',
  openGraph: { type: 'website', locale: 'en_US', siteName: 'Mar Vista Law' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
