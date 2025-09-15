import { Readable } from 'stream';
import LeadResult from '../models/LeadResult.js';

export async function getResults(_req, res) {
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
  } catch (_err) {
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
}

export async function exportResults(_req, res) {
  try {
    const results = await LeadResult.find().sort({ createdAt: -1 }).lean();
    const headers = ['name','role','company','industry','location','intent','score','reasoning'];
    const lines = [headers.join(',')];
    for (const r of results) {
      const row = [
        r.name || '',
        r.role || '',
        r.company || '',
        r.industry || '',
        r.location || '',
        r.intent || '',
        String(r.score ?? ''),
        (r.reasoning || '').replace(/\n/g, ' ').replace(/"/g, '""')
      ]
        .map((v) => `"${String(v)}"`)
        .join(',');
      lines.push(row);
    }
    const csv = lines.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="results.csv"');
    Readable.from(csv).pipe(res);
  } catch (_err) {
    return res.status(500).json({ error: 'Failed to export results' });
  }
}


