const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ['superadmin', 'admin', 'doctor', 'user', 'emergency_access'], default: 'user' },
  email: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Sample doctor usernames to remove
const sampleDoctorUsernames = [
  'dr.smith',
  'dr.johnson', 
  'dr.williams',
  'dr.brown',
  'dr.davis'
];

async function removeSampleDoctors() {
  try {
    console.log('Starting to remove sample doctors...');
    
    // Find and remove doctors with these usernames
    const result = await User.deleteMany({
      username: { $in: sampleDoctorUsernames },
      role: 'doctor'
    });
    
    console.log(`✅ Successfully removed ${result.deletedCount} sample doctors from User collection`);
    
    if (result.deletedCount === 0) {
      console.log('No sample doctors found to remove.');
    } else {
      console.log('Removed usernames:', sampleDoctorUsernames);
    }
    
  } catch (error) {
    console.error('❌ Error removing sample doctors:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
removeSampleDoctors();
