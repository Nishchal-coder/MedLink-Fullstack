const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema for MERN Application
 * Defines the structure and validation rules for user documents
 * Includes password hashing and comparison methods
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address'
    ],
    index: true // Create index for faster email lookups
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  nid: {
    type: String,
    required: [true, 'National ID is required'],
    unique: true,
    trim: true,
    minlength: [10, 'National ID must be at least 10 characters long'],
    maxlength: [20, 'National ID cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9]+$/, 'National ID can only contain letters and numbers'],
    index: true // Create index for faster NID lookups
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields from JSON output
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      // Remove sensitive fields from object output
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes password if it has been modified (or is new)
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    console.log('📝 Password not modified, skipping hash');
    return next();
  }
  
  try {
    console.log('🔐 Hashing password for user:', this.email);
    
    // Hash password with salt rounds of 12 (higher = more secure but slower)
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    
    console.log('✅ Password hashed successfully for user:', this.email);
    next();
  } catch (error) {
    console.error('❌ Error hashing password for user:', this.email, error);
    next(error);
  }
});

/**
 * Instance method to compare candidate password with stored hash
 * @param {string} candidatePassword - The password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔍 Comparing password for user:', this.email);
    
    // Compare candidate password with stored hash
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    
    console.log('✅ Password comparison result for user:', this.email, ':', isMatch);
    return isMatch;
  } catch (error) {
    console.error('❌ Error comparing password for user:', this.email, error);
    throw error;
  }
};

/**
 * Static method to find user by email
 * @param {string} email - The email to search for
 * @returns {Promise<Object>} - User document or null
 */
userSchema.statics.findByEmail = async function(email) {
  try {
    console.log('🔍 Searching for user with email:', email);
    const user = await this.findOne({ email: email.toLowerCase() });
    console.log('✅ User search result:', user ? 'Found' : 'Not found');
    return user;
  } catch (error) {
    console.error('❌ Error finding user by email:', email, error);
    throw error;
  }
};

/**
 * Static method to check if email exists
 * @param {string} email - The email to check
 * @returns {Promise<boolean>} - True if email exists, false otherwise
 */
userSchema.statics.emailExists = async function(email) {
  try {
    console.log('🔍 Checking if email exists:', email);
    const exists = await this.exists({ email: email.toLowerCase() });
    console.log('✅ Email exists check result:', exists ? 'Exists' : 'Does not exist');
    return !!exists;
  } catch (error) {
    console.error('❌ Error checking if email exists:', email, error);
    throw error;
  }
};

/**
 * Static method to check if NID exists
 * @param {string} nid - The NID to check
 * @returns {Promise<boolean>} - True if NID exists, false otherwise
 */
userSchema.statics.nidExists = async function(nid) {
  try {
    console.log('🔍 Checking if NID exists:', nid);
    const exists = await this.exists({ nid: nid });
    console.log('✅ NID exists check result:', exists ? 'Exists' : 'Does not exist');
    return !!exists;
  } catch (error) {
    console.error('❌ Error checking if NID exists:', nid, error);
    throw error;
  }
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
