const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('../dist/models/User.js').User;

const testLogin = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('✅ Connected to MongoDB');

    // Test admin login
    console.log('🔍 Testing admin login...');
    const adminUser = await User.findOne({ username: 'cmcadmin' }).select('+password');
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   - Username: ${adminUser.username}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - Hospital: ${adminUser.hospital}`);
      console.log(`   - Status: ${adminUser.status}`);
      
      // Test password verification
      const isPasswordValid = await adminUser.comparePassword('cmcadmin');
      console.log(`   - Password valid: ${isPasswordValid}`);
    } else {
      console.log('❌ Admin user not found');
    }

    // Test doctor login (if any doctors exist)
    console.log('\n🔍 Testing doctor login...');
    const doctorUser = await User.findOne({ role: 'doctor' }).select('+password');
    if (doctorUser) {
      console.log('✅ Doctor user found:');
      console.log(`   - Username: ${doctorUser.username}`);
      console.log(`   - Role: ${doctorUser.role}`);
      console.log(`   - Hospital: ${doctorUser.hospital}`);
      console.log(`   - Status: ${doctorUser.status}`);
    } else {
      console.log('ℹ️  No doctor users found');
    }

    console.log('\n🎉 Login test completed!');

  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
testLogin();
