const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('../dist/models/User.js').User;

const createDummyAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with username "admin"');
      console.log('📋 Admin details:');
      console.log(`   - Username: ${existingAdmin.username}`);
      console.log(`   - Role: ${existingAdmin.role}`);
      console.log(`   - Status: ${existingAdmin.status}`);
      console.log(`   - Created: ${existingAdmin.createdAt}`);
      return;
    }

    // Create dummy admin user
    const adminUser = new User({
      username: 'admin',
      password: 'admin', // This will be hashed automatically by the pre-save middleware
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@medlink.com',
      contactNumber: '+1-555-0123',
      hospitalName: 'MedLink General Hospital',
      hospitalAddress: '123 Healthcare Drive, Medical City, MC 12345',
      hospitalContact: '+1-555-0100',
      adminPosition: 'Hospital Administrator',
      department: 'Administration',
      employeeId: 'ADMIN001',
      address: '456 Admin Street, Medical City, MC 12345',
      emergencyContact: 'Emergency Services',
      emergencyPhone: '+1-555-9111',
      status: 'Active',
      initialSetupCompleted: true
    });

    // Save the admin user
    await adminUser.save();
    
    console.log('✅ Dummy admin user created successfully!');
    console.log('📋 Admin credentials:');
    console.log('   - Username: admin');
    console.log('   - Password: admin');
    console.log('   - Role: admin');
    console.log('   - Status: Active');
    console.log('   - Email: admin@medlink.com');
    console.log('   - Hospital: MedLink General Hospital');
    console.log('');
    console.log('🔐 You can now login to the admin panel at: /auth-admin');
    console.log('   Use these credentials to access the admin dashboard.');

  } catch (error) {
    console.error('❌ Error creating dummy admin:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
createDummyAdmin();
