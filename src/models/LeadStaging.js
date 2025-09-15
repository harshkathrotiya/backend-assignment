import mongoose from 'mongoose';

const LeadStagingSchema = new mongoose.Schema(
  {
    batchId: { type: String, index: true },
    name: String,
    role: String,
    company: String,
    industry: String,
    location: String,
    linkedin_bio: String,
  },
  { timestamps: true }
);

export default mongoose.model('LeadStaging', LeadStagingSchema);


