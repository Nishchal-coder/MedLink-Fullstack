const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('../dist/models/User.js').User;

const showAdminCredentials = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('💡 Run: node scripts/resetAdminPassword.js to create admin user');
      return;
    }
    
    console.log('');
    console.log('🔐 Admin Login Credentials:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('   - Role: admin');
    console.log('   - Status: ' + adminUser.status);
    console.log('');
    console.log('🌐 Access the admin panel at:');
    console.log('   http://localhost:5173/auth-admin');
    console.log('');
    console.log('📋 Admin Details:');
    console.log(`   - Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Hospital: ${adminUser.hospitalName}`);
    console.log(`   - Position: ${adminUser.adminPosition}`);
    console.log(`   - Department: ${adminUser.department}`);
    console.log(`   - Employee ID: ${adminUser.employeeId}`);
    console.log(`   - Created: ${adminUser.createdAt}`);
    console.log('');
    console.log('💡 To reset password, run: node scripts/resetAdminPassword.js');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
showAdminCredentials();
