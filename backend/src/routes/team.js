import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/uploadMiddleware.js';
import {
    getAllTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMembersByType
} from '../controllers/team.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllTeamMembers);
router.get('/type/:type', getTeamMembersByType);
router.get('/:id', getTeamMember);

// Protected routes (admin only)
router.use(protect); // Middleware to check if user is authenticated
router.post('/', upload.single('image'), createTeamMember);
router.put('/:id', upload.single('image'), updateTeamMember);
router.delete('/:id', deleteTeamMember);

export default router;