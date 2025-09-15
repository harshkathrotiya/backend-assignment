import Offer from '../models/Offer.js';
import LeadResult from '../models/LeadResult.js';
import LeadStaging from '../models/LeadStaging.js';
import { scoreByRules, scoreByAI } from '../services/scoring.js';

export async function scoreLeads(req, res) {
  try {
    const offer = await Offer.findOne().sort({ createdAt: -1 }).lean();
    if (!offer) {
      return res.status(400).json({ error: 'No offer found. Create one first.' });
    }
    const { batchId } = req.body || {};
    if (!batchId) {
      return res.status(400).json({ error: 'batchId is required. Upload leads first.' });
    }
    const uploadedLeads = await LeadStaging.find({ batchId }).lean();
    if (!uploadedLeads.length) {
      return res.status(400).json({ error: 'No leads found for batchId.' });
    }

    const results = [];
    for (const lead of uploadedLeads) {
      const rule_score = scoreByRules(lead, offer);
      const ai = await scoreByAI(lead, offer);
      const score = Math.min(100, rule_score + ai.points);
      const result = await LeadResult.findOneAndUpdate(
        { name: lead.name, company: lead.company, offerId: offer._id },
        {
          ...lead,
          intent: ai.intent,
          score,
          reasoning: ai.reasoning,
          rule_score,
          ai_points: ai.points,
          offerId: offer._id,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      results.push(result);
    }

    // clear staging for this batch
    await LeadStaging.deleteMany({ batchId });

    return res.json({ processed: results.length, batchId });
  } catch (err) {
    console.error('scoreLeads error:', err?.message || err, err?.stack);
    return res.status(500).json({ error: 'Failed to score leads', details: err?.message || undefined });
  }
}


