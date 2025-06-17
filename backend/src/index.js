import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import teamRoutes from './routes/team.js';
import activityRoutes from './routes/activity.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkServerHealth } from './middleware/healthCheck.js';
import Admin from './models/Admin.js';

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8081', 'http://127.0.0.1:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.use('/health', checkServerHealth);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/activities', activityRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Handle 404s
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handling
app.use(errorHandler);

// Initialize admin user function
const initializeAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
        if (!adminExists) {
            await Admin.create({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            });
            console.log('Admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Function to check if a port is available
const isPortAvailable = (port) => {
    return new Promise((resolve) => {
        const server = express()
            .listen(port, () => {
                server.close(() => resolve(true));
            })
            .on('error', () => {
                resolve(false);
            });
    });
};

// Start the server
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        await initializeAdmin();

        // Try to find an available port
        let PORT = parseInt(process.env.PORT || '8080', 10);
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            if (await isPortAvailable(PORT)) {
                // Port is available, start the server
                app.listen(PORT, () => {
                    console.log(`Server is running on port ${PORT}`);
                });
                
                // Server health monitoring every 5 minutes
                setInterval(checkServerHealth, 300000);
                
                return; // Server started successfully
            }
            
            console.log(`Port ${PORT} is in use, trying next port...`);
            PORT++;
            attempts++;
        }

        throw new Error('Could not find an available port after ' + maxAttempts + ' attempts');
        
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Start server
startServer();
