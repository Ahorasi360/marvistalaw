// app/page.js — server component, delegates to client
import HomePageClient from './components/HomePageClient';

export const metadata = {
  title: 'Mar Vista Law — California Legal Resource Center | Find an Attorney Today',
  description: 'Connect with experienced California attorneys for immigration, personal injury, estate planning, and family law. Free consultations. Bilingual English/Spanish service for all of California.',
};

export default function HomePage() {
  return <HomePageClient />;
}
