import express from 'express';
import {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  reorderPortfolio,
} from '../controllers/portfolioController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPortfolio);
router.get('/:id', getPortfolioById);

// Protected Admin routes
router.post('/', protectAdmin, createPortfolio);
router.put('/reorder', protectAdmin, reorderPortfolio);
router.put('/:id', protectAdmin, updatePortfolio);
router.delete('/:id', protectAdmin, deletePortfolio);

export default router;
