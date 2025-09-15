# Testing Guide

## Postman (Live)
Base URL: https://kuvaka-api.onrender.com

1) Health
- Method: GET
- URL: /health
- Expect: { "ok": true }

2) Create Offer
- Method: POST
- URL: /offer
- Headers: Content-Type: application/json
- Body (raw JSON):
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"],
  "industries_icp": ["saas", "technology"],
  "roles_decision_makers": ["head of growth", "vp marketing", "cmo"],
  "roles_influencers": ["growth", "demand gen"]
}
- Expect: 201 Created

3) Upload Leads CSV
- Method: POST
- URL: /leads/upload
- Body: form-data → key: file (type: File) → choose CSV
- CSV headers: name,role,company,industry,location,linkedin_bio
- Expect: { "uploaded": N }

4) Score
- Method: POST
- URL: /score
- Expect: { "processed": N }

5) Results
- Method: GET
- URL: /results
- Expect: JSON array with name, role, company, intent, score, reasoning

6) Export CSV (optional)
- Method: GET
- URL: /results/export
- Expect: CSV download

Notes
- Set GEMINI_API_KEY on Render for AI scoring (otherwise AI defaults to Low).
- Service de-dups by name+company and clears uploaded leads after scoring.

## Jest (Local)
- Install deps: npm install
- Run tests: npm test
- Coverage:
  - Rule scoring: 50/30/0 cases
  - AI scoring: mocked Gemini returns High → 50
  - Basic route: GET /health

Troubleshooting
- If tests hang: ensure NODE_ENV=test so DB isn’t opened by the app.
- ESM is configured via NODE_OPTIONS=--experimental-vm-modules in package.json
