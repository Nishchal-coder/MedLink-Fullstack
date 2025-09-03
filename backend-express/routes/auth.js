const express = require('express');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/auth/signup
 * Creates a new user account
 * 
 * Request Body:
 * - name: string (required, 2-50 characters)
 * - email: string (required, valid email format, unique)
 * - password: string (required, min 6 characters)
 * - nid: string (required, 10-20 characters, unique)
 * 
 * Response:
 * Success (201): { message: "User created successfully", userId: string }
 * Error (400): { error: string }
 * Error (500): { error: string }
 */
router.post('/signup', async (req, res) => {
  try {
    console.log('📨 Signup request received');
    console.log('📋 Request body:', {
      name: req.body.name,
      email: req.body.email,
      nid: req.body.nid,
      password: '[HIDDEN]'
    });

    // Extract and validate required fields
    const { name, email, password, nid } = req.body;

    // Validate required fields
    if (!name || !email || !password || !nid) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        error: 'All fields are required: name, email, password, nid'
      });
    }

    // Validate field formats
    if (name.length < 2 || name.length > 50) {
      console.log('❌ Invalid name length');
      return res.status(400).json({
        error: 'Name must be between 2 and 50 characters'
      });
    }

    if (password.length < 6) {
      console.log('❌ Invalid password length');
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    if (nid.length < 10 || nid.length > 20) {
      console.log('❌ Invalid NID length');
      return res.status(400).json({
        error: 'National ID must be between 10 and 20 characters'
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    console.log('✅ Input validation passed');

    // Check if user with email already exists
    console.log('🔍 Checking if email already exists:', email);
    const emailExists = await User.emailExists(email);
    
    if (emailExists) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Check if user with NID already exists
    console.log('🔍 Checking if NID already exists:', nid);
    const nidExists = await User.nidExists(nid);
    
    if (nidExists) {
      console.log('❌ NID already exists:', nid);
      return res.status(400).json({
        error: 'User with this National ID already exists'
      });
    }

    console.log('✅ Email and NID are unique');

    // Create new user
    console.log('👤 Creating new user:', email);
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      nid: nid.trim()
    });

    // Save user to database (password will be hashed by pre-save middleware)
    console.log('💾 Saving user to database...');
    const savedUser = await newUser.save();
    
    console.log('✅ User saved successfully with ID:', savedUser._id);

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      userId: savedUser._id,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        nid: savedUser.nid,
        createdAt: savedUser.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      console.log('❌ Duplicate key error for field:', field);
      
      if (field === 'email') {
        return res.status(400).json({
          error: 'User with this email already exists'
        });
      } else if (field === 'nid') {
        return res.status(400).json({
          error: 'User with this National ID already exists'
        });
      }
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.log('❌ Validation error:', error.message);
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Handle other errors
    console.error('❌ Unexpected error during signup:', error);
    res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
});

/**
 * GET /api/auth/health
 * Health check endpoint for authentication service
 */
router.get('/health', (req, res) => {
  console.log('🏥 Auth health check requested');
  res.status(200).json({
    status: 'OK',
    service: 'Authentication Service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
