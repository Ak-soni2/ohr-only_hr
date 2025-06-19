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
app.use(cors());  // Allow all origins for development

// Parse JSON bodies
app.use(express.json());

// Ensure uploads directory exists
ensureUploadsDirectory();

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Set security headers for all responses
app.use((req, res, next) => {
  // Only set Content-Type: application/json for API routes
  if (req.path.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
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

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/events", require("./src/routes/events"));
app.use("/api/team", require("./src/routes/team.js"));
app.use("/api/activities", require("./src/routes/activities"));

app.get("/", (req, res) => {
  res.send("OnlyHR API is running");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists with proper permissions
ensureUploadsDirectory();

// Configure static file serving for uploads
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
