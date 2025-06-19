import express from 'express';
import { 
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/events.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (admin only)
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
