import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function normalizeString(str) {
  return (str || '').toLowerCase().trim();
}

export function scoreByRules(lead, offer) {
  let score = 0;

  const role = normalizeString(lead.role);
  const industry = normalizeString(lead.industry);

  const dm = (offer.roles_decision_makers || []).map(normalizeString);
  const inf = (offer.roles_influencers || []).map(normalizeString);
  const icp = (offer.industries_icp || []).map(normalizeString);

  if (dm.some((r) => role.includes(r))) score += 20;
  else if (inf.some((r) => role.includes(r))) score += 10;

  if (icp.includes(industry)) score += 20;
  else if (icp.some((i) => industry.includes(i))) score += 10;

  const allPresent = ['name', 'role', 'company', 'industry', 'location', 'linkedin_bio'].every(
    (k) => typeof lead[k] === 'string' && lead[k].trim().length > 0
  );
  if (allPresent) score += 10;

  return score;
}

export async function scoreByAI(lead, offer) {
  if (!process.env.GEMINI_API_KEY) {
    return { intent: 'Low', points: 10, reasoning: 'AI disabled: missing GEMINI_API_KEY.' };
  }
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `You are scoring B2B sales leads.
Offer:
Name: ${offer.name}
Value Props: ${(offer.value_props || []).join(', ')}
Ideal Use Cases: ${(offer.ideal_use_cases || []).join(', ')}
ICP Industries: ${(offer.industries_icp || []).join(', ')}

Prospect:
Name: ${lead.name}
Role: ${lead.role}
Company: ${lead.company}
Industry: ${lead.industry}
Location: ${lead.location}
LinkedIn Bio: ${lead.linkedin_bio}

Task: Classify buying intent as High, Medium, or Low and explain in 1-2 sentences. Respond strictly as JSON with keys intent and reasoning.`;

  const { response } = await model.generateContent(prompt);
  const text = response.text();
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, ''));
    const intent = ['High', 'Medium', 'Low'].includes(parsed.intent) ? parsed.intent : 'Low';
    const mapping = { High: 50, Medium: 30, Low: 10 };
    return { intent, points: mapping[intent], reasoning: parsed.reasoning || '' };
  } catch (_e) {
    // Fallback simple heuristic if parsing fails
    const mapping = { High: 50, Medium: 30, Low: 10 };
    let intent = 'Low';
    if (/high/i.test(text)) intent = 'High';
    else if (/medium/i.test(text)) intent = 'Medium';
    const points = mapping[intent];
    return { intent, points, reasoning: text.slice(0, 240) };
  }
}


