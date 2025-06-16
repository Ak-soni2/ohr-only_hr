import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    addTeamMember,
    getAllTeamMembers,
    getTeamMember,
    updateTeamMember,
    deleteTeamMember
} from '../controllers/teamMember.js';

const router = express.Router();

// Public routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMember);

// Protected routes (admin only)
router.use(protect);  // All routes below this will require authentication
router.post('/', addTeamMember);
router.put('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;
