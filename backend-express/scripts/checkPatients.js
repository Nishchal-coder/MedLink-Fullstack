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

// Check patients
async function checkPatients() {
  try {
    console.log('🔍 Checking patients in Patient collection...');
    
    const patients = await Patient.find().populate('user', 'firstName lastName nationalId');
    
    if (patients.length === 0) {
      console.log('❌ No patients found in Patient collection');
    } else {
      console.log(`✅ Found ${patients.length} patients:`);
      patients.forEach((patient, index) => {
        console.log(`${index + 1}. MRN: ${patient.mrn}`);
        console.log(`   User: ${patient.user?.firstName} ${patient.user?.lastName}`);
        console.log(`   NID: ${patient.user?.nationalId}`);
        console.log(`   Hospital: ${patient.hospital}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking patients:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
checkPatients();
