import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import offersRouter from './routes/offers.js';
import leadsRouter from './routes/leads.js';
import resultsRouter from './routes/results.js';
import scoreRouter from './routes/score.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/offer', offersRouter);
app.use('/leads', leadsRouter);
app.use('/results', resultsRouter);
app.use('/score', scoreRouter);

// Initialize mongoose connection if MONGODB_URI is present and not in test
const mongoUri = process.env.MONGODB_URI;
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
if (mongoUri && !isTestEnv) {
  // Avoid multiple connects in test environment
  if (mongoose.connection.readyState === 0) {
    mongoose
      .connect(mongoUri, { dbName: 'kuvaka' })
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('MongoDB connection error:', err.message));
  }
}

export default app;


