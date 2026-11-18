import express from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: client submits appointment enquiry
router.post('/', createBooking);

// Protected Admin routes
router.get('/', protectAdmin, getBookings);
router.get('/:id', protectAdmin, getBookingById);
router.put('/:id', protectAdmin, updateBookingStatus);
router.delete('/:id', protectAdmin, deleteBooking);

export default router;
