import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import dataStore from './services/dataStore.js';

import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB if available, otherwise dataStore fallback handles persistence
connectDB().then((connected) => {
  if (connected) {
    dataStore.syncToMongoIfEmpty();
  }
});

// Middleware with universal bulletproof CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options('*', cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend production build if present (Unified Single-Host Deployment)
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    brand: 'Glowroot by Ishita',
    timestamp: new Date().toISOString(),
    mongoConnected: dataStore.isMongoConnected(),
  });
});

// Fallback to React index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const server = app.listen(PORT, () => {
  console.log(`✨ Glowroot Backend Server running on port ${PORT}`);
  console.log(`👑 Admin ID: ${process.env.ADMIN_USERNAME || 'ishita'}`);
});

export default app;
