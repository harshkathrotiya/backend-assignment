import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

// In-memory storage for uploaded leads before scoring
const uploadedLeads = [];

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'CSV file is required' });

    const leads = await new Promise((resolve, reject) => {
      const records = [];
      const parser = parse({ columns: true, trim: true });
      parser.on('readable', () => {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });
      parser.on('error', reject);
      parser.on('end', () => resolve(records));
      parser.write(req.file.buffer);
      parser.end();
    });

    // Normalize fields
    const normalized = leads.map((row) => ({
      name: row.name || '',
      role: row.role || '',
      company: row.company || '',
      industry: row.industry || '',
      location: row.location || '',
      linkedin_bio: row.linkedin_bio || '',
    }));

    uploadedLeads.length = 0;
    uploadedLeads.push(...normalized);

    return res.json({ uploaded: uploadedLeads.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse CSV' });
  }
});

export { uploadedLeads };
export default router;


