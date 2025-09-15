import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value_props: { type: [String], default: [] },
    ideal_use_cases: { type: [String], default: [] },
    industries_icp: { type: [String], default: [] },
    roles_decision_makers: { type: [String], default: [] },
    roles_influencers: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', OfferSchema);


