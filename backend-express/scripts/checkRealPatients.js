const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'doctor', 'user', 'emergency_access'], default: 'user' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  contactNumber: { type: String },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  mustChangePassword: { type: Boolean, default: true },
  initialSetupCompleted: { type: Boolean, default: false },
  nationalId: { type: String, maxlength: 36 },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }
}, {
  timestamps: true
});

// Patient Schema
const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  mrn: { type: String, required: true, unique: true, maxlength: 50 },
  dateOfBirth: { type: Date },
  gender: { type: String, maxlength: 32 },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  hasBloodType: { type: Boolean, default: false },
  height: { type: String, maxlength: 10 },
  weight: { type: String, maxlength: 10 },
  diseases: { type: [String], default: [] },
  address: { type: String, maxlength: 255 },
  emergencyContactName: { type: String, maxlength: 255 },
  emergencyContactPhone: { type: String, maxlength: 20 },
  emergencyContactRelation: { type: String, maxlength: 100 },
  allergies: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  medicalHistory: { type: String },
  photo: { type: String },
  age: { type: Number },
  emergencyContact: { type: String, maxlength: 255 },
  testResults: { type: [mongoose.Schema.Types.Mixed], default: [] },
  medicalImagesSummary: { type: [mongoose.Schema.Types.Mixed], default: [] },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);

// Check real patients in database
async function checkRealPatients() {
  try {
    console.log('🔍 Checking REAL patients in your database...');
    
    // Find all users with NIDs (real patients)
    const usersWithNID = await User.find({ 
      nationalId: { $exists: true, $ne: null, $ne: '' },
      role: 'user' // Only actual patients, not doctors/admins
    }).select('firstName lastName nationalId email contactNumber address dateOfBirth gender');
    
    console.log(`\n📋 REAL PATIENTS WITH NIDs (${usersWithNID.length} found):`);
    if (usersWithNID.length === 0) {
      console.log('❌ No real patients with NIDs found in your database');
      console.log('💡 You need to register real patients with NIDs to test the emergency portal');
    } else {
      usersWithNID.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.firstName} ${user.lastName}`);
        console.log(`   NID: ${user.nationalId}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Contact: ${user.contactNumber || 'Not provided'}`);
        console.log(`   Address: ${user.address || 'Not provided'}`);
        console.log(`   DOB: ${user.dateOfBirth ? user.dateOfBirth.toDateString() : 'Not provided'}`);
        console.log(`   Gender: ${user.gender}`);
        console.log('');
      });
    }
    
    // Find all patients in Patient collection
    const patients = await Patient.find().populate('user', 'firstName lastName nationalId');
    
    console.log(`📋 PATIENTS IN PATIENT COLLECTION (${patients.length} found):`);
    if (patients.length === 0) {
      console.log('❌ No patients found in Patient collection');
    } else {
      patients.forEach((patient, index) => {
        console.log(`${index + 1}. MRN: ${patient.mrn}`);
        console.log(`   User: ${patient.user?.firstName} ${patient.user?.lastName}`);
        console.log(`   NID: ${patient.user?.nationalId || 'Not provided'}`);
        console.log(`   Hospital: ${patient.hospital}`);
        console.log('');
      });
    }
    
    // Check for users without NIDs
    const usersWithoutNID = await User.find({ 
      nationalId: { $exists: false },
      role: 'user'
    }).select('firstName lastName email');
    
    console.log(`📋 USERS WITHOUT NIDs (${usersWithoutNID.length} found):`);
    if (usersWithoutNID.length > 0) {
      usersWithoutNID.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      });
      console.log('\n💡 These users need NIDs to be searchable in the emergency portal');
    }
    
  } catch (error) {
    console.error('❌ Error checking real patients:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
checkRealPatients();
