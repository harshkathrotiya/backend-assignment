import Offer from '../models/Offer.js';
import LeadResult from '../models/LeadResult.js';
import { uploadedLeads } from './leadsController.js';
import { scoreByRules, scoreByAI } from '../services/scoring.js';

export async function scoreLeads(_req, res) {
  try {
    const offer = await Offer.findOne().sort({ createdAt: -1 }).lean();
    if (!offer) return res.status(400).json({ error: 'No offer found. Create one first.' });
    if (!uploadedLeads.length) return res.status(400).json({ error: 'No leads uploaded.' });

    const results = [];
    for (const lead of uploadedLeads) {
      const rule_score = scoreByRules(lead, offer);
      const ai = await scoreByAI(lead, offer);
      const score = Math.min(100, rule_score + ai.points);
      const exists = await LeadResult.findOne({ name: lead.name, company: lead.company }).lean();
      if (exists) {
        continue; // simple de-dup based on name+company
      }
      const result = await LeadResult.create({
        ...lead,
        intent: ai.intent,
        score,
        reasoning: ai.reasoning,
        rule_score,
        ai_points: ai.points,
        offerId: offer._id,
      });
      results.push(result);
    }

    // clear uploaded leads after scoring
    uploadedLeads.length = 0;

    return res.json({ processed: results.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to score leads' });
  }
}


