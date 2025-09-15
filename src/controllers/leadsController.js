import { parse } from 'csv-parse';

export const uploadedLeads = [];

export async function uploadLeads(req, res) {
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

    const normalized = leads.map((row) => ({
      name: row.name || row.Name || '',
      role: row.role || row.Role || '',
      company: row.company || row.Company || '',
      industry: row.industry || row.Industry || '',
      location: row.location || row.Location || '',
      linkedin_bio: row.linkedin_bio || row.Linkedin || row.LinkedIn || row.linkedin || '',
    }));

    uploadedLeads.length = 0;
    uploadedLeads.push(...normalized);

    return res.json({ uploaded: uploadedLeads.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to parse CSV' });
  }
}


