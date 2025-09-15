import { z } from 'zod';
import Offer from '../models/Offer.js';

const offerSchema = z.object({
  name: z.string().min(1),
  value_props: z.array(z.string()).optional().default([]),
  ideal_use_cases: z.array(z.string()).optional().default([]),
  industries_icp: z.array(z.string()).optional().default([]),
  roles_decision_makers: z.array(z.string()).optional().default([]),
  roles_influencers: z.array(z.string()).optional().default([]),
});

export async function createOffer(req, res) {
  try {
    const data = offerSchema.parse(req.body);
    const offer = await Offer.create(data);
    return res.status(201).json(offer);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: err.issues });
    }
    return res.status(500).json({ error: 'Failed to create offer' });
  }
}


