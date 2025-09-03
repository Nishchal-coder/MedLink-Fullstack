const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User model
const User = require('../dist/models/User.js').User;

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating new admin user...');
      
      // Create new admin user
      const newAdminUser = new User({
        username: 'admin',
        password: 'admin123', // This will be hashed automatically by the pre-save middleware
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

      await newAdminUser.save();
      console.log('✅ New admin user created successfully!');
    } else {
      console.log('📋 Found existing admin user. Resetting password...');
      
      // Reset password to 'admin123'
      adminUser.password = 'admin123'; // This will be hashed by the pre-save middleware
      adminUser.status = 'Active';
      adminUser.initialSetupCompleted = true;
      
      // Update admin details if they're missing
      if (!adminUser.firstName) adminUser.firstName = 'System';
      if (!adminUser.lastName) adminUser.lastName = 'Administrator';
      if (!adminUser.email) adminUser.email = 'admin@medlink.com';
      if (!adminUser.contactNumber) adminUser.contactNumber = '+1-555-0123';
      if (!adminUser.hospitalName) adminUser.hospitalName = 'MedLink General Hospital';
      if (!adminUser.hospitalAddress) adminUser.hospitalAddress = '123 Healthcare Drive, Medical City, MC 12345';
      if (!adminUser.hospitalContact) adminUser.hospitalContact = '+1-555-0100';
      if (!adminUser.adminPosition) adminUser.adminPosition = 'Hospital Administrator';
      if (!adminUser.department) adminUser.department = 'Administration';
      if (!adminUser.employeeId) adminUser.employeeId = 'ADMIN001';
      if (!adminUser.address) adminUser.address = '456 Admin Street, Medical City, MC 12345';
      if (!adminUser.emergencyContact) adminUser.emergencyContact = 'Emergency Services';
      if (!adminUser.emergencyPhone) adminUser.emergencyPhone = '+1-555-9111';
      
      await adminUser.save();
      console.log('✅ Admin password reset successfully!');
    }
    
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('   - Role: admin');
    console.log('   - Status: Active');
    console.log('');
    console.log('🌐 Access the admin panel at:');
    console.log('   http://localhost:5173/auth-admin');
    console.log('');
    console.log('📋 Admin Details:');
    console.log('   - Name: System Administrator');
    console.log('   - Email: admin@medlink.com');
    console.log('   - Hospital: MedLink General Hospital');
    console.log('   - Position: Hospital Administrator');
    console.log('   - Department: Administration');
    console.log('   - Employee ID: ADMIN001');

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
resetAdminPassword();
