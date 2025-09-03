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

// Questionnaire Schema
const questionnaireSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  nid: { type: String, required: true, unique: true },
  bloodType: { type: String },
  height: { type: String },
  weight: { type: String },
  emergencyContact: { type: String },
  emergencyPhone: { type: String },
  relationship: { type: String },
  allergies: { type: String },
  currentMedications: { type: String },
  chronicConditions: { type: String },
  previousSurgeries: { type: String },
  smoking: { type: String },
  alcohol: { type: String },
  exercise: { type: String },
  diet: { type: String },
  completedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

// Check patient by NID
async function checkPatientByNID() {
  try {
    console.log('🔍 Checking for patient with NID: 123456789');
    
    // Check in User collection
    const user = await User.findOne({ nationalId: '123456789' });
    if (user) {
      console.log(`✅ Found user with NID: ${user.firstName} ${user.lastName} (${user.role})`);
    } else {
      console.log('❌ No user found with NID: 123456789');
    }
    
    // Check in Questionnaire collection
    const questionnaire = await Questionnaire.findOne({ nid: '123456789' });
    if (questionnaire) {
      console.log(`✅ Found questionnaire with NID: ${questionnaire.nid}`);
      console.log(`User ID: ${questionnaire.user}`);
      console.log(`Patient ID: ${questionnaire.patient}`);
    } else {
      console.log('❌ No questionnaire found with NID: 123456789');
    }
    
    // List all available NIDs
    console.log('\n📋 Available NIDs in system:');
    const allUsers = await User.find({ nationalId: { $exists: true, $ne: null } }).select('firstName lastName nationalId role');
    allUsers.forEach(user => {
      console.log(`- ${user.nationalId}: ${user.firstName} ${user.lastName} (${user.role})`);
    });
    
    const allQuestionnaires = await Questionnaire.find().select('nid user');
    console.log('\n📋 Available NIDs in questionnaires:');
    allQuestionnaires.forEach(q => {
      console.log(`- ${q.nid}: User ID ${q.user}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking patient:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
checkPatientByNID();
