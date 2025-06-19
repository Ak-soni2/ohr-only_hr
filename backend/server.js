import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ensureUploadsDirectory from './src/utils/ensureUploads.js';

// Load env vars
dotenv.config();

const app = express();
const port = 8080;

// Middleware
// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8081', 'http://127.0.0.1:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Parse JSON bodies
app.use(express.json());

// Ensure uploads directory exists
ensureUploadsDirectory();

// Set security headers for all responses
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Routes
import authRoutes from './src/routes/auth.js';
import eventRoutes from './src/routes/events.js';
import teamRoutes from './src/routes/team.js';
import activityRoutes from './src/routes/activities.js';
import registrationRoutes from './src/routes/registration.js';

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/registrations", registrationRoutes);

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.get("/", (req, res) => {
  res.send("OnlyHR API is running");
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
