import mongoose from 'mongoose';

const LeadResultSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    company: String,
    industry: String,
    location: String,
    linkedin_bio: String,
    intent: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    score: { type: Number, required: true },
    reasoning: { type: String, default: '' },
    rule_score: { type: Number, required: true },
    ai_points: { type: Number, required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  },
  { timestamps: true }
);

export default mongoose.model('LeadResult', LeadResultSchema);

// Ensure unique per lead+company+offer to prevent duplicates on re-scoring
LeadResultSchema.index({ name: 1, company: 1, offerId: 1 }, { unique: true });


