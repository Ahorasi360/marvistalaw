// app/lib/content-prompt.js
// The prompt Claude uses to generate each city+service page

export function buildPrompt({ city, county, service, courthouse, recorder }) {
  const hasDIY = !!service.ms360Path;
  const isInjury = service.category === 'injury';

  return `You are a legal resource content writer for MarVistaLaw.com, a California legal resource center. Write SEO-optimized content for this page. Output ONLY valid JSON — no markdown, no explanation.

PAGE: ${service.name} in ${city}, California (${county} County)
SERVICE CATEGORY: ${service.category}
COURTHOUSE: ${courthouse}
COUNTY RECORDER: ${recorder}
${hasDIY ? `DIY OPTION AVAILABLE: Yes, through Multi Servicios 360 (multiservicios360.net${service.ms360Path}) from $${service.ms360Price}` : ''}
${isInjury ? 'NOTE: Personal injury attorneys work on contingency — no upfront fees.' : `ATTORNEY COST: $${service.attorneyMin}–${service.attorneyMin * 3}+`}

Write in a warm, trustworthy, community-advisor tone. Include specific references to ${city} and ${county} County. Use "you" and "your" throughout.

Return this exact JSON structure:
{
  "metaTitle": "string under 60 chars — include service name and city",
  "metaDescription": "string under 155 chars — compelling, includes city + benefit",
  "h1": "string — unique, specific to this city and service, under 65 chars",
  "intro": "string — 2-3 sentences, 120-160 words. Mention ${city}, ${county} County, and why locals need this service. Include a local stat or fact if possible.",
  "whatItIs": "string — 150-200 words explaining what ${service.name} is, why it matters, and what happens without it. Specific to California law.",
  "localContext": "string — 100-130 words. Mention ${courthouse}, ${recorder}, local deadlines, county-specific procedures. Make it feel hyperlocal.",
  "costComparison": "string — 80-100 words. ${isInjury ? 'Explain contingency fees — no win no fee. Most PI attorneys take 33%. Your case value.' : `Compare attorney fees ($${service.attorneyMin}+) to ${hasDIY ? `the DIY option at multiservicios360.net ($${service.ms360Price})` : 'our attorney referral service'}. Be specific with numbers.`}",
  "faqs": [
    {"q": "string", "a": "string — 60-80 words"},
    {"q": "string", "a": "string — 60-80 words"},
    {"q": "string", "a": "string — 60-80 words"},
    {"q": "string", "a": "string — 60-80 words"},
    {"q": "string", "a": "string — 60-80 words"}
  ],
  "ctaHeading": "string — action-oriented, max 10 words",
  "ctaSubtext": "string — 1-2 sentences, creates urgency or trust",
  "relatedServices": ["service-slug-1", "service-slug-2", "service-slug-3"]
}

FAQ topics to cover (pick 5 most relevant for ${service.name} in California):
- How long does the process take in ${county} County?
- Do I need to appear in court?
- What documents do I need?
- How much does it cost in California?
- Can I do this myself or do I need an attorney?
- What happens if I don't have this document?
- Is this valid in other states?
- How do I get started?

For relatedServices, pick 3 slugs from: living-trust, general-power-of-attorney, last-will-testament, llc-formation, green-card-application, car-accident-attorney, divorce-attorney, quitclaim-deed, guardianship-designation, hipaa-authorization

CRITICAL: Return ONLY the JSON object. No markdown. No backticks. No explanation.`;
}
