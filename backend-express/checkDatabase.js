const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('Connected to MongoDB');

    // Check users collection
    const User = require('./dist/models/User.js').User;
    const users = await User.find({}).select('-password');
    console.log('\n📊 USERS in database:');
    console.log(JSON.stringify(users, null, 2));

    // Check patients collection
    const Patient = require('./dist/models/Patient.js').Patient;
    const patients = await Patient.find({});
    console.log('\n🏥 PATIENTS in database:');
    console.log(JSON.stringify(patients, null, 2));

    // Check hospitals collection
    const Hospital = require('./dist/models/Hospital.js').Hospital;
    const hospitals = await Hospital.find({});
    console.log('\n🏨 HOSPITALS in database:');
    console.log(JSON.stringify(hospitals, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkDatabase();
