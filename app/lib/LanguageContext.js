'use client';
// app/lib/LanguageContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('mvl_lang') || 'en';
    setLangState(saved);
  }, []);

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('mvl_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

// All translations for marvistalaw.com
export const T = {
  en: {
    // Navbar
    nav: {
      immigration: 'Immigration',
      accidents: 'Accidents',
      estate: 'Estate Planning',
      cta: 'Free Consultation',
      tagline: 'California Legal Resource Center',
    },
    // Homepage hero
    hero: {
      badge: 'Serving All 482 California Cities · English & Español',
      title: 'California Legal Help',
      titleAccent: 'When You Need It Most',
      subtitle: 'Connect with experienced California attorneys for immigration, personal injury, estate planning, and more. Free consultations. Bilingual service.',
      ctaPrimary: '📞 Free Consultation',
      ctaSecondary: 'Find an Attorney →',
    },
    // Services section
    services: {
      title: 'Our Practice Areas',
      subtitle: '51 legal services across all of California',
    },
    // Why us
    why: {
      title: 'Why Mar Vista Law?',
      items: [
        { icon: '🌎', title: 'Bilingual Service', desc: 'Every attorney speaks English and Spanish fluently' },
        { icon: '📍', title: 'All of California', desc: '482 cities covered — from Calexico to Redding' },
        { icon: '⚡', title: 'Fast Response', desc: '24-hour response guarantee on all consultations' },
        { icon: '💰', title: 'Transparent Pricing', desc: 'Know the cost upfront — no surprises' },
        { icon: '🏛️', title: 'Licensed Attorneys', desc: 'All referrals are California State Bar licensed' },
        { icon: '🔒', title: '100% Confidential', desc: 'Attorney-client privilege from the first call' },
      ],
    },
    // DIY bridge
    diy: {
      title: 'Prefer to Prepare Documents Yourself?',
      body: 'Multi Servicios 360 is a bilingual self-help platform that guides you through creating your own legal documents — no attorney required for simpler needs.',
      cta: 'Visit MultiServicios360.net →',
    },
    // Lead form
    form: {
      title: 'Free Consultation',
      injury: 'No upfront fees. We only get paid if you win. Bilingual attorneys.',
      general: 'Connect with an experienced attorney. 100% confidential.',
      name: 'Full name *',
      phone: 'Phone number *',
      email: 'Email (optional)',
      langPref: 'Language preference',
      langEs: 'I prefer Spanish / Prefiero español',
      langEn: 'I prefer English',
      submit: '📞 Request Free Consultation',
      sending: 'Sending...',
      successTitle: 'We received your request!',
      successBody: 'A specialist will contact you within 24 hours. We speak Spanish and English.',
      errorMsg: 'Something went wrong. Please call us directly.',
      disclaimer: '🔒 Your information is 100% confidential · Bilingual service · No spam',
    },
    // City+service page
    page: {
      whatItIs: 'What is a',
      localContext: 'Local Information',
      cost: 'How Much Does It Cost in',
      diy: '✅ Prefer to do it yourself?',
      diyDesc: 'Use Multi Servicios 360 — guided software',
      diyFrom: 'from $',
      diyBtn: 'Start DIY →',
      faq: 'Frequently Asked Questions',
      nearbyCities: 'Nearby Cities',
      relatedServices: 'Related Services in',
      callNow: '📞 Call Now',
      trustBadges: ['🏛️ California Licensed', '🇺🇸 English & Español', '📞 Free Consultation', '⚡ Fast Response'],
    },
    // Footer
    footer: {
      disclaimer: 'Mar Vista Law is a legal referral and resource service, not a law firm. We do not provide legal advice. Attorney referrals are for informational purposes only.',
      diy: 'Prefer to prepare documents yourself? Visit',
    },
  },

  es: {
    // Navbar
    nav: {
      immigration: 'Inmigración',
      accidents: 'Accidentes',
      estate: 'Planificación Patrimonial',
      cta: 'Consulta Gratis',
      tagline: 'Centro de Recursos Legales de California',
    },
    // Homepage hero
    hero: {
      badge: 'Servimos las 482 Ciudades de California · Español & English',
      title: 'Ayuda Legal en California',
      titleAccent: 'Cuando Más Lo Necesitas',
      subtitle: 'Conéctate con abogados experimentados en California para inmigración, accidentes, planificación patrimonial y más. Consultas gratuitas. Servicio bilingüe.',
      ctaPrimary: '📞 Consulta Gratis',
      ctaSecondary: 'Encontrar Abogado →',
    },
    // Services section
    services: {
      title: 'Nuestras Áreas de Práctica',
      subtitle: '51 servicios legales en toda California',
    },
    // Why us
    why: {
      title: '¿Por qué Mar Vista Law?',
      items: [
        { icon: '🌎', title: 'Servicio Bilingüe', desc: 'Todos nuestros abogados hablan español e inglés con fluidez' },
        { icon: '📍', title: 'Toda California', desc: '482 ciudades cubiertas — de Calexico hasta Redding' },
        { icon: '⚡', title: 'Respuesta Rápida', desc: 'Garantía de respuesta en 24 horas para todas las consultas' },
        { icon: '💰', title: 'Precios Transparentes', desc: 'Sabes el costo desde el principio — sin sorpresas' },
        { icon: '🏛️', title: 'Abogados Licenciados', desc: 'Todas las referencias tienen licencia del Colegio de Abogados de California' },
        { icon: '🔒', title: '100% Confidencial', desc: 'Privilegio abogado-cliente desde la primera llamada' },
      ],
    },
    // DIY bridge
    diy: {
      title: '¿Prefiere Preparar Sus Documentos Usted Mismo?',
      body: 'Multi Servicios 360 es una plataforma de autoayuda bilingüe que le guía en la preparación de sus propios documentos legales — sin necesidad de abogado para necesidades simples.',
      cta: 'Visitar MultiServicios360.net →',
    },
    // Lead form
    form: {
      title: 'Consulta Gratis',
      injury: 'Sin costos por adelantado. Solo cobramos si ganamos. Abogados bilingües.',
      general: 'Conéctate con un abogado experimentado. 100% confidencial.',
      name: 'Nombre completo *',
      phone: 'Número de teléfono *',
      email: 'Correo electrónico (opcional)',
      langPref: 'Idioma de preferencia',
      langEs: 'Prefiero español',
      langEn: 'I prefer English',
      submit: '📞 Solicitar Consulta Gratis',
      sending: 'Enviando...',
      successTitle: '¡Recibimos tu solicitud!',
      successBody: 'Un especialista te contactará dentro de 24 horas. Hablamos español e inglés.',
      errorMsg: 'Algo salió mal. Por favor llámanos directamente.',
      disclaimer: '🔒 Tu información es 100% confidencial · Servicio bilingüe · Sin spam',
    },
    // City+service page
    page: {
      whatItIs: '¿Qué es',
      localContext: 'Información Local',
      cost: '¿Cuánto Cuesta en',
      diy: '✅ ¿Prefiere hacerlo usted mismo?',
      diyDesc: 'Use Multi Servicios 360 — software guiado',
      diyFrom: 'desde $',
      diyBtn: 'Empezar →',
      faq: 'Preguntas Frecuentes',
      nearbyCities: 'Ciudades Cercanas',
      relatedServices: 'Servicios Relacionados en',
      callNow: '📞 Llamar Ahora',
      trustBadges: ['🏛️ Licenciados en California', '🌎 Español & English', '📞 Consulta Gratis', '⚡ Respuesta Rápida'],
    },
    // Footer
    footer: {
      disclaimer: 'Mar Vista Law es un servicio de referencia y recursos legales, no un bufete de abogados. No brindamos asesoría legal. Las referencias a abogados son solo para fines informativos.',
      diy: '¿Prefiere preparar documentos usted mismo? Visita',
    },
  },
};
