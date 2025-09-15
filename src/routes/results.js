import { Router } from 'express';
import LeadResult from '../models/LeadResult.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const results = await LeadResult.find().sort({ createdAt: -1 }).lean();
    return res.json(
      results.map((r) => ({
        name: r.name,
        role: r.role,
        company: r.company,
        intent: r.intent,
        score: r.score,
        reasoning: r.reasoning,
      }))
    );
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;


