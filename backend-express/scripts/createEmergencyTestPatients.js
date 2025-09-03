const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
  nationalId: { type: String, maxlength: 36 }
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

// Hospital Schema
const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String },
  email: { type: String },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Sample emergency test patients
const emergencyTestPatients = [
  {
    username: 'john.doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    nationalId: '1234567890',
    contactNumber: '+1-555-0123',
    address: '123 Main Street, City, State 12345',
    gender: 'male',
    dateOfBirth: new Date('1985-03-15'),
    bloodGroup: 'O+',
    diseases: ['Diabetes Type 2', 'Hypertension'],
    allergies: ['Penicillin', 'Peanuts', 'Latex'],
    medications: ['Metformin', 'Lisinopril', 'Aspirin'],
    medicalHistory: 'Patient has a history of diabetes and hypertension. Previous heart surgery in 2020.',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1-555-0124',
    emergencyContactRelation: 'Spouse'
  },
  {
    username: 'sarah.johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    nationalId: '0987654321',
    contactNumber: '+1-555-0456',
    address: '456 Oak Avenue, City, State 12345',
    gender: 'female',
    dateOfBirth: new Date('1992-07-22'),
    bloodGroup: 'A-',
    diseases: ['Hypothyroidism'],
    allergies: ['Sulfa drugs', 'Shellfish'],
    medications: ['Levothyroxine', 'Vitamin D'],
    medicalHistory: 'Patient has hypothyroidism and vitamin D deficiency. No major surgeries.',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '+1-555-0457',
    emergencyContactRelation: 'Brother'
  },
  {
    username: 'mike.wilson',
    firstName: 'Michael',
    lastName: 'Wilson',
    email: 'mike.wilson@example.com',
    nationalId: '1122334455',
    contactNumber: '+1-555-0789',
    address: '789 Pine Road, City, State 12345',
    gender: 'male',
    dateOfBirth: new Date('1978-11-08'),
    bloodGroup: 'B+',
    diseases: ['Asthma', 'Heart Disease'],
    allergies: ['Dust', 'Mold', 'Aspirin'],
    medications: ['Albuterol', 'Metoprolol', 'Atorvastatin'],
    medicalHistory: 'Patient has asthma and heart disease. Heart attack in 2019, stent placed.',
    emergencyContactName: 'Lisa Wilson',
    emergencyContactPhone: '+1-555-0790',
    emergencyContactRelation: 'Wife'
  },
  {
    username: 'emily.brown',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@example.com',
    nationalId: '5566778899',
    contactNumber: '+1-555-0321',
    address: '321 Elm Street, City, State 12345',
    gender: 'female',
    dateOfBirth: new Date('1990-04-12'),
    bloodGroup: 'AB+',
    diseases: ['Epilepsy'],
    allergies: ['None known'],
    medications: ['Levetiracetam', 'Folic Acid'],
    medicalHistory: 'Patient has epilepsy since childhood. Controlled with medication.',
    emergencyContactName: 'Robert Brown',
    emergencyContactPhone: '+1-555-0322',
    emergencyContactRelation: 'Father'
  }
];

// Generate random password
function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Create emergency test patients
async function createEmergencyTestPatients() {
  try {
    console.log('🚨 Creating emergency test patients...');
    
    // Find or create default hospital
    let defaultHospital = await Hospital.findOne({ name: 'MedLink General Hospital' });
    if (!defaultHospital) {
      defaultHospital = new Hospital({
        name: 'MedLink General Hospital',
        location: '123 Medical Center Drive, City, State 12345',
        contactNumber: '+1-555-0000',
        email: 'info@medlinkhospital.com',
        address: '123 Medical Center Drive, City, State 12345'
      });
      await defaultHospital.save();
      console.log('✅ Created default hospital');
    }
    
    const createdPatients = [];
    
    for (const patientData of emergencyTestPatients) {
      // Check if patient already exists
      const existingUser = await User.findOne({ 
        $or: [
          { username: patientData.username },
          { email: patientData.email },
          { nationalId: patientData.nationalId }
        ]
      });
      
      if (existingUser) {
        console.log(`Patient ${patientData.username} already exists, skipping...`);
        continue;
      }
      
      // Generate random password
      const password = generateRandomPassword();
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = new User({
        username: patientData.username,
        password: hashedPassword,
        role: 'user',
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        email: patientData.email,
        nationalId: patientData.nationalId,
        contactNumber: patientData.contactNumber,
        address: patientData.address,
        gender: patientData.gender,
        dateOfBirth: patientData.dateOfBirth,
        mustChangePassword: true,
        initialSetupCompleted: true
      });
      
      await user.save();
      
      // Create patient profile with manually generated MRN
      const patient = new Patient({
        user: user._id,
        hospital: defaultHospital._id,
        mrn: `MRN${user._id.toString().slice(-6).padStart(6, '0')}`, // Manually generate MRN
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
        bloodGroup: patientData.bloodGroup,
        hasBloodType: true,
        diseases: patientData.diseases,
        address: patientData.address,
        emergencyContactName: patientData.emergencyContactName,
        emergencyContactPhone: patientData.emergencyContactPhone,
        emergencyContactRelation: patientData.emergencyContactRelation,
        allergies: patientData.allergies,
        medications: patientData.medications,
        medicalHistory: patientData.medicalHistory,
        lastUpdated: new Date()
      });
      
      await patient.save();
      
      createdPatients.push({
        username: patientData.username,
        password: password,
        email: patientData.email,
        nationalId: patientData.nationalId,
        mrn: patient.mrn
      });
      
      console.log(`✅ Created emergency test patient: ${patientData.firstName} ${patientData.lastName}`);
    }
    
    console.log('\n📋 Emergency Test Patients Summary:');
    console.log('==================================');
    createdPatients.forEach((patient, index) => {
      console.log(`${index + 1}. Name: ${patient.username}`);
      console.log(`   National ID: ${patient.nationalId}`);
      console.log(`   MRN: ${patient.mrn}`);
      console.log(`   Email: ${patient.email}`);
      console.log(`   Password: ${patient.password}`);
      console.log('');
    });
    
    if (createdPatients.length === 0) {
      console.log('No new emergency test patients were created (all already exist).');
    } else {
      console.log(`✅ Successfully created ${createdPatients.length} emergency test patients!`);
      console.log('🚨 These patients can be used to test the emergency portal at /emergency');
      console.log('⚠️  IMPORTANT: Save these credentials securely!');
    }
    
  } catch (error) {
    console.error('❌ Error creating emergency test patients:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
createEmergencyTestPatients();
