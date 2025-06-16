import express from 'express';
import { login, getProfile } from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log(`Auth Route accessed: ${req.method} ${req.url}`);
    next();
});

router.post('/login', (req, res, next) => {
    console.log('Login route hit:', req.body);
    login(req, res, next);
});
router.get('/profile', protect, getProfile);

export default router;
