import express from 'express';
import { registerForEvent, getEventRegistrations } from '../controllers/registration.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/:eventId', registerForEvent);

// Protected routes (admin only)
router.get('/:eventId', protect, getEventRegistrations);

export default router;
