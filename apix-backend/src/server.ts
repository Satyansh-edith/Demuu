// src/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import fareRoutes from './routes/fareRoutes';
import logRoutes from './routes/logRoutes';
import demoRoutes from './routes/demoRoutes';
import { requestLogger } from './middleware/requestLogger';

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'APIx Backend',
    version: '1.0.0',
    description: 'SIH 2026 Demo — Real-time Airfare Price Index',
    timestamp: new Date().toISOString(),
    disclaimer: 'This is a prototype. All data is simulated.',
  });
});

// API Routes
app.use('/api/v1', fareRoutes);
app.use('/api/v1', logRoutes);
app.use('/api/v1', demoRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Start
const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 APIx Backend running on http://localhost:${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/v1/health`);
    console.log(`⚠️  SIH 2026 Demo — All data is simulated\n`);
  });
};

start();
