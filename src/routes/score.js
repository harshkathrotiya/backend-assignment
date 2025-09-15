import { Router } from 'express';
import Offer from '../models/Offer.js';
import LeadResult from '../models/LeadResult.js';
import { uploadedLeads } from './leads.js';
import { scoreByRules, scoreByAI } from '../services/scoring.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const offer = await Offer.findOne().sort({ createdAt: -1 }).lean();
    if (!offer) return res.status(400).json({ error: 'No offer found. Create one first.' });
    if (!uploadedLeads.length) return res.status(400).json({ error: 'No leads uploaded.' });

    const results = [];
    for (const lead of uploadedLeads) {
      const rule_score = scoreByRules(lead, offer);
      const ai = await scoreByAI(lead, offer);
      const score = Math.min(100, rule_score + ai.points);
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

    return res.json({ processed: results.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to score leads' });
  }
});

export default router;


