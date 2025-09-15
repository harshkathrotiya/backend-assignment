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

// Routes
app.use('/offer', offersRouter);
app.use('/leads', leadsRouter);
app.use('/results', resultsRouter);
app.use('/score', scoreRouter);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.warn('MONGODB_URI is not set. Set it in environment variables.');
}

mongoose
  .connect(mongoUri || '', { dbName: 'kuvaka' })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
