import mongoose from 'mongoose';

// Function to get health status
const getHealthStatus = () => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const memoryUsage = process.memoryUsage();

    return {
        timestamp: new Date(),
        status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
        database: {
            status: dbStatus
        },
        memory: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
        }
    };
};

// Middleware for health check endpoint
export const checkServerHealth = async (req, res, next) => {
    try {
        const healthStatus = getHealthStatus();

        // If called as middleware (with req and res)
        if (req && res) {
            if (req.path === '/health') {
                return res.json(healthStatus);
            }
            return next();
        }

        // If called directly (e.g., from interval)
        if (healthStatus.status !== 'healthy') {
            console.error('Health check failed:', healthStatus);
        }

    } catch (error) {
        console.error('Health check failed:', error);
        
        // If called as middleware
        if (req && res) {
            if (req.path === '/health') {
                return res.status(500).json({
                    status: 'unhealthy',
                    error: error.message
                });
            }
            return next();
        }
        
        // If called directly
        console.error('Health check error:', error);
    }
};
