import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { initCronJobs } from './utils/cronJobs.js';
import errorHandler from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import questRoutes from './routes/questRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

export const createServerApp = () => {
  const app = express();

  // Enable CORS
  app.use(cors({
    origin: true,
    credentials: true,
  }));

  // Parse JSON and form data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB and cron
  connectDB();
  initCronJobs();

  // API Routes
  app.get('/api/healthcheck', (req, res) => {
    res.json({
      status: 'online',
      system: 'Diet Quest RPG Engine v2.5',
      time: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/game', gameRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/store', storeRoutes);
  app.use('/api/health', healthRoutes);
  app.use('/api/diet', dietRoutes);
  app.use('/api/chat', chatRoutes);

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export default createServerApp;
