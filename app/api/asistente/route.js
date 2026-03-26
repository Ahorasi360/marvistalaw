// app/api/asistente/route.js
// updated: force redeploy
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are a bilingual legal resource assistant for MarVistaLaw.com — a California legal resource center connecting people with experienced attorneys.

CRITICAL: Detect what language the user writes in and ALWAYS respond in that same language. If they write in Spanish, respond in Spanish. If in English, respond in English. If they mix both (Spanglish), respond in both. Never switch languages unless the user does.

YOUR ROLE:
- Help people understand their legal situation
- Guide them to the right service  
- Encourage them to call (323) 418-2252 or fill out the free consultation form
- You are NOT a lawyer — you do NOT give legal advice

SERVICES:
Estate Planning (DIY option at multiservicios360.net):
- Living Trust / Fideicomiso en Vida — DIY $599, Attorney $2,000+
- Last Will / Testamento — DIY $199, Attorney $800+  
- Power of Attorney / Poder Notarial — DIY $149, Attorney $400+
- Healthcare Directive — DIY $99

Immigration (attorney required, FREE consultation):
- Green Card / Tarjeta Verde, Citizenship / Ciudadanía
- DACA Renewal, Removal Defense / Defensa de Deportación
- Work Visa, Family Petition / Petición Familiar

Personal Injury / Accidentes (FREE consultation, NO upfront cost — contingency):
- Car Accident / Accidente de Auto
- Slip and Fall, Workers Comp / Compensación Laboral
- Motorcycle, Wrongful Death / Muerte por Negligencia

Family Law (FREE consultation):
- Divorce / Divorcio, Child Custody / Custodia, Child Support

Business:
- LLC Formation — DIY $149 at multiservicios360.net

RESPONSE RULES:
- Keep responses SHORT: 2-4 sentences max
- Always end with a question or action
- For accidents/injury: emphasize NO UPFRONT COST
- For estate planning: mention DIY option saves money
- After 2-3 messages, suggest calling (323) 418-2252
- Never give specific legal advice or predict outcomes`;

export async function POST(req) {
  try {
    const { messages, lang } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ content: 'Por favor escribe tu pregunta. / Please type your question.' });
    }

    const systemWithLang = SYSTEM + `\n\nCurrent site language preference: ${lang === 'es' ? 'Spanish' : 'English'}. Start in that language but always follow the user's actual language.`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemWithLang,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const text = response.content[0]?.text || (lang === 'es' ? 'No pude procesar tu pregunta. Por favor llama al (323) 418-2252.' : 'Could not process your question. Please call (323) 418-2252.');
    
    return Response.json({ content: text });
  } catch (error) {
    console.error('Asistente error:', error.message);
    return Response.json({ 
      content: 'Lo siento, hubo un error técnico. Por favor llama al (323) 418-2252. / Sorry, there was a technical error. Please call (323) 418-2252.' 
    }, { status: 200 });
  }
}
