const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the User and Hospital models
const User = require('../dist/models/User.js').User;
const Hospital = require('../dist/models/Hospital.js').Hospital;

const setupHospitalAdmins = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('✅ Connected to MongoDB');

    // Remove old admin user
    console.log('🗑️  Removing old admin user...');
    const oldAdmin = await User.findOneAndDelete({ username: 'admin' });
    if (oldAdmin) {
      console.log('✅ Old admin user removed successfully');
    } else {
      console.log('ℹ️  No old admin user found to remove');
    }

    // Create or find hospitals
    console.log('🏥 Setting up hospitals...');
    
    // CMC Hospital
    const cmcHospital = await Hospital.findOneAndUpdate(
      { name: 'CMC Hospital' },
      {
        name: 'CMC Hospital',
        location: 'Kathmandu, Nepal',
        contactPhone: '+977-1-4412345'
      },
      { upsert: true, new: true }
    );
    console.log('✅ CMC Hospital created/found:', cmcHospital._id);

    // KMC Hospital
    const kmcHospital = await Hospital.findOneAndUpdate(
      { name: 'KMC Hospital' },
      {
        name: 'KMC Hospital',
        location: 'Kathmandu, Nepal',
        contactPhone: '+977-1-4412346'
      },
      { upsert: true, new: true }
    );
    console.log('✅ KMC Hospital created/found:', kmcHospital._id);

    // Create CMC Admin
    console.log('👤 Creating CMC Admin...');
    const cmcAdminExists = await User.findOne({ username: 'cmcadmin' });
    if (cmcAdminExists) {
      console.log('⚠️  CMC Admin already exists, updating...');
      cmcAdminExists.password = 'cmcadmin';
      cmcAdminExists.hospital = cmcHospital._id;
      cmcAdminExists.status = 'Active';
      await cmcAdminExists.save();
    } else {
      const cmcAdmin = new User({
        username: 'cmcadmin',
        password: 'cmcadmin',
        role: 'admin',
        firstName: 'CMC',
        lastName: 'Administrator',
        email: 'admin@cmchospital.com',
        contactNumber: '+977-1-4412345',
        hospital: cmcHospital._id,
        status: 'Active',
        mustChangePassword: false,
        isPhoneVerified: false,
        initialSetupCompleted: true
      });
      await cmcAdmin.save();
    }
    console.log('✅ CMC Admin created/updated successfully');

    // Create KMC Admin
    console.log('👤 Creating KMC Admin...');
    const kmcAdminExists = await User.findOne({ username: 'kmcadmin' });
    if (kmcAdminExists) {
      console.log('⚠️  KMC Admin already exists, updating...');
      kmcAdminExists.password = 'kmcadmin';
      kmcAdminExists.hospital = kmcHospital._id;
      kmcAdminExists.status = 'Active';
      await kmcAdminExists.save();
    } else {
      const kmcAdmin = new User({
        username: 'kmcadmin',
        password: 'kmcadmin',
        role: 'admin',
        firstName: 'KMC',
        lastName: 'Administrator',
        email: 'admin@kmchospital.com',
        contactNumber: '+977-1-4412346',
        hospital: kmcHospital._id,
        status: 'Active',
        mustChangePassword: false,
        isPhoneVerified: false,
        initialSetupCompleted: true
      });
      await kmcAdmin.save();
    }
    console.log('✅ KMC Admin created/updated successfully');

    console.log('');
    console.log('🎉 Hospital Admin Setup Complete!');
    console.log('');
    console.log('🏥 Hospitals Created:');
    console.log(`   - CMC Hospital: ${cmcHospital._id}`);
    console.log(`   - KMC Hospital: ${kmcHospital._id}`);
    console.log('');
    console.log('👤 Admin Credentials:');
    console.log('   CMC Hospital Admin:');
    console.log('   - Username: cmcadmin');
    console.log('   - Password: cmcadmin');
    console.log('   - Hospital: CMC Hospital');
    console.log('');
    console.log('   KMC Hospital Admin:');
    console.log('   - Username: kmcadmin');
    console.log('   - Password: kmcadmin');
    console.log('   - Hospital: KMC Hospital');
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   - Admin Panel: http://localhost:5173/auth-admin');
    console.log('   - Doctor Panel: http://localhost:5173/auth-doctor');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Admins can now add doctors to their respective hospitals');
    console.log('   2. Doctors will login to the doctor panel');
    console.log('   3. Each admin manages only their hospital\'s data');

  } catch (error) {
    console.error('❌ Error setting up hospital admins:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
setupHospitalAdmins();
