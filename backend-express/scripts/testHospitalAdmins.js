const mongoose = require('mongoose');
require('dotenv').config();

// Import the User and Hospital models
const User = require('../dist/models/User.js').User;
const Hospital = require('../dist/models/Hospital.js').Hospital;

const testHospitalAdmins = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('✅ Connected to MongoDB');

    // Test CMC Admin
    console.log('🔍 Testing CMC Admin...');
    const cmcAdmin = await User.findOne({ username: 'cmcadmin' }).populate('hospital');
    if (cmcAdmin) {
      console.log('✅ CMC Admin found:');
      console.log(`   - Username: ${cmcAdmin.username}`);
      console.log(`   - Role: ${cmcAdmin.role}`);
      console.log(`   - Hospital: ${cmcAdmin.hospital?.name || 'Not assigned'}`);
      console.log(`   - Status: ${cmcAdmin.status}`);
    } else {
      console.log('❌ CMC Admin not found');
    }

    // Test KMC Admin
    console.log('\n🔍 Testing KMC Admin...');
    const kmcAdmin = await User.findOne({ username: 'kmcadmin' }).populate('hospital');
    if (kmcAdmin) {
      console.log('✅ KMC Admin found:');
      console.log(`   - Username: ${kmcAdmin.username}`);
      console.log(`   - Role: ${kmcAdmin.role}`);
      console.log(`   - Hospital: ${kmcAdmin.hospital?.name || 'Not assigned'}`);
      console.log(`   - Status: ${kmcAdmin.status}`);
    } else {
      console.log('❌ KMC Admin not found');
    }

    // List all hospitals
    console.log('\n🏥 All Hospitals:');
    const hospitals = await Hospital.find();
    hospitals.forEach(hospital => {
      console.log(`   - ${hospital.name} (${hospital._id})`);
    });

    // List all admins
    console.log('\n👤 All Admin Users:');
    const admins = await User.find({ role: 'admin' }).populate('hospital');
    admins.forEach(admin => {
      console.log(`   - ${admin.username} (${admin.hospital?.name || 'No hospital'})`);
    });

    console.log('\n🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing hospital admins:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
testHospitalAdmins();
