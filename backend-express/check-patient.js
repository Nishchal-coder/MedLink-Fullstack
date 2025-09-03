const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { User, Hospital, Patient } = require('./dist/models');

async function checkPatient() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ username: 'nishchal' });
    if (!user) {
      console.error('❌ User not found');
      return;
    }
    console.log('✅ Found user:', user._id);

    // Check if patient exists
    const patient = await Patient.findOne({ user: user._id })
      .populate('user', 'username firstName lastName')
      .populate('hospital', 'name location');

    if (patient) {
      console.log('✅ Patient profile exists:', {
        id: patient._id,
        mrn: patient.mrn,
        user: patient.user,
        hospital: patient.hospital,
        age: patient.age,
        createdAt: patient.createdAt
      });
    } else {
      console.log('❌ Patient profile not found');
    }

    // Test the /patients/me endpoint logic
    console.log('\n🔍 Testing /patients/me endpoint logic...');
    
    const patientForMe = await Patient.findOne({ user: user._id })
      .populate('user', 'username firstName lastName contactNumber')
      .populate('hospital', 'name location')
      .populate('updatedBy', 'username firstName lastName');

    if (patientForMe) {
      console.log('✅ /patients/me would return:', {
        patient: {
          _id: patientForMe._id,
          user: patientForMe.user,
          hospital: patientForMe.hospital,
          mrn: patientForMe.mrn,
          age: patientForMe.age
        }
      });
    } else {
      console.log('❌ /patients/me would return 404');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

checkPatient();
