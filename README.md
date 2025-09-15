# Kuvaka Lead Scoring Backend

Node.js + Express + MongoDB backend that scores B2B leads using rule-based logic and Gemini AI.

## Tech
- Express, Mongoose
- File uploads via Multer, CSV parsing via csv-parse
- Gemini (Google Generative AI) for AI reasoning

## Setup
1. Install
```
npm install
```
2. Environment
Copy `.env.example` to `.env` and set values:
```
PORT=8080
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
GEMINI_API_KEY=your_google_genai_key
```
3. Run locally
```
npm run dev
```
Health check: `GET http://localhost:8080/health`

## Data Model
- `Offer`: name, value_props[], ideal_use_cases[], industries_icp[], roles_decision_makers[], roles_influencers[]
- `LeadResult`: lead fields + intent, score, reasoning, rule_score, ai_points, offerId

## API Reference
Base URL: `http://localhost:8080`

### POST /offer
Create or update offer context.
```json
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"],
  "industries_icp": ["saas", "technology"],
  "roles_decision_makers": ["head of growth", "vp marketing", "cmo"],
  "roles_influencers": ["growth", "demand gen"]
}
```

Curl
```
curl -X POST http://localhost:8080/offer \
  -H 'Content-Type: application/json' \
  -d '{
    "name":"AI Outreach Automation",
    "value_props":["24/7 outreach","6x more meetings"],
    "ideal_use_cases":["B2B SaaS mid-market"],
    "industries_icp":["saas","technology"],
    "roles_decision_makers":["head of growth","vp marketing","cmo"],
    "roles_influencers":["growth","demand gen"]
  }'
```

### POST /leads/upload
Upload CSV with headers: name,role,company,industry,location,linkedin_bio
```
curl -X POST http://localhost:8080/leads/upload \
  -F file=@leads.csv
```
Response: `{ "uploaded": N }`

### POST /score
Scores uploaded leads using rules + Gemini.
```
curl -X POST http://localhost:8080/score
```
Response: `{ "processed": N }`

### GET /results
Fetch results JSON array.
```
curl http://localhost:8080/results
```

### GET /results/export
Export results as CSV.

## Scoring Logic
- Rule layer (max 50):
  - Role relevance: decision maker +20, influencer +10
  - Industry match: exact ICP +20, adjacent +10
  - Data completeness: all fields present +10
- AI layer (max 50): Gemini classifies intent High/Medium/Low with 1–2 line reasoning.
  - High=50, Medium=30, Low=10
- Final score: min(100, rule_score + ai_points)

Gemini prompt asks to respond as JSON with `intent` and `reasoning`. If parsing fails, a heuristic fallback is used.

## Deploy on Render
1. Push to GitHub
2. Create new Web Service on Render
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Instance: Free
- Env Vars: `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`
3. After deploy, use the service URL as base URL.

## Testing
```
npm test
```
Runs a quick rule-layer check that prints scores.

## Notes
- If `GEMINI_API_KEY` is missing, AI layer defaults to Low (10) and notes this in reasoning.
- Uploaded leads are stored in-memory until `/score` is called; results are persisted in MongoDB.

## Live URL
Add your Render base URL here for testing.
