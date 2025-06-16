import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getAllActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivitiesByType
} from '../controllers/activity.js';

const router = express.Router();

// Public routes
router.get('/', getAllActivities);
router.get('/type/:type', getActivitiesByType);
router.get('/:id', getActivity);

// Protected routes (admin only)
router.use(protect);
router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

export default router;
