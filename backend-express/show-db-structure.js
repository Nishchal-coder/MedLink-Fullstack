const mongoose = require('mongoose');
require('dotenv').config();
const { User, Hospital, Patient } = require('./dist/models');

async function showDatabaseStructure() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('\n📊 DATABASE STRUCTURE:');
    console.log('Database:', process.env.MONGODB_URI.split('/').pop());
    
    // Show collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections:');
    collections.forEach(col => console.log('  -', col.name));
    
    // Show user types
    console.log('\n👥 User Types in Database:');
    const userTypes = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    userTypes.forEach(type => console.log(`  - ${type._id}: ${type.count} users`));
    
    // Show sample users
    console.log('\n🔍 Sample Users:');
    const users = await User.find().select('username role firstName lastName').limit(5);
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.role}): ${user.firstName} ${user.lastName}`);
    });
    
    // Show hospitals
    console.log('\n🏥 Hospitals:');
    const hospitals = await Hospital.find().select('name location');
    hospitals.forEach(hospital => {
      console.log(`  - ${hospital.name} (${hospital.location})`);
    });
    
    // Show patients
    console.log('\n👤 Patients:');
    const patients = await Patient.find().populate('user', 'username role').select('mrn user').limit(5);
    patients.forEach(patient => {
      console.log(`  - MRN: ${patient.mrn}, User: ${patient.user.username} (${patient.user.role})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

showDatabaseStructure();
