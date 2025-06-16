import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Login admin
export const login = async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            console.log('Missing credentials');
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get current admin profile
export const getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
