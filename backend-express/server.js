const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database');

// Import routes
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas
console.log('🔄 Initializing database connection...');
connectDB();

/**
 * CORS Configuration
 * Allows requests from frontend development servers
 */
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control']
}));

/**
 * Body Parsing Middleware
 * Parse incoming JSON and URL-encoded data
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging Middleware
 * Log all incoming requests in development
 */
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

/**
 * API Routes
 * Mount authentication routes
 */
app.use('/api/auth', authRoutes);

/**
 * Root Endpoint
 * Basic API information
 */
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      signup: 'POST /api/auth/signup',
      health: 'GET /api/auth/health'
    }
  });
});

/**
 * Health Check Endpoint
 * Check if the server is running
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'MERN Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * 404 Handler
 * Handle requests to non-existent routes
 */
app.use('*', (req, res) => {
  console.log('❌ Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

/**
 * Global Error Handling Middleware
 * Catch and handle all unhandled errors
 */
app.use((err, req, res, next) => {
  console.error('❌ Global error handler triggered:', err);
  
  // Log error details
  console.error('Error stack:', err.stack);
  console.error('Request details:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });
  
  // Determine error status code
  const statusCode = err.statusCode || err.status || 500;
  
  // Prepare error response
  const errorResponse = {
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Something went wrong',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };
  
  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
});

/**
 * Start Server
 * Listen on specified port
 */
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('📊 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 API URL: http://localhost:' + PORT + '/api');
  console.log('📝 Signup endpoint: http://localhost:' + PORT + '/api/auth/signup');
  console.log('🏥 Health check: http://localhost:' + PORT + '/api/health');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
