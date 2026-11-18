import express from 'express';
import { loginAdmin, getMe, logoutAdmin } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admin login. No public signup/registration.
router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMe);
router.post('/logout', protectAdmin, logoutAdmin);

export default router;
