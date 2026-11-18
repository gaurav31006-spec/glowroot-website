import express from 'express';
import {
  getContent,
  updateContent,
  getOverviewStats,
  submitFeedback,
} from '../controllers/contentController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes: website content & client feedback
router.get('/', getContent);
router.post('/feedback', submitFeedback);

// Protected Admin routes
router.put('/', protectAdmin, updateContent);
router.get('/stats', protectAdmin, getOverviewStats);

export default router;
