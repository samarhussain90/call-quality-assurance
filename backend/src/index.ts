import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// @ts-ignore: TS cannot resolve local modules in editor workspace
import authRoutes from './routes/auth';
// @ts-ignore: TS cannot resolve local modules in editor workspace
import webhookRoutes from './routes/webhooks';
// @ts-ignore: TS cannot resolve local modules in editor workspace
import resultsRoutes from './routes/results';
// @ts-ignore: TS cannot resolve local modules in editor workspace
import campaignsRoutes from './routes/campaigns';
// @ts-ignore: TS cannot resolve local modules in editor workspace
import callsRoutes from './routes/calls';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route registration
app.use('/api/v1/auth', authRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/api/v1/results', resultsRoutes);
app.use('/api/v1/campaigns', campaignsRoutes);
app.use('/api/v1/calls', callsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
}); 