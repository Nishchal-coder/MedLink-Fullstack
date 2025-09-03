const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

// Check questionnaire data for NID 1234567890
async function checkQuestionnaireData() {
  try {
    console.log('🔍 Checking Questionnaire data for NID: 1234567890');
    
    // Find questionnaire with this NID
    const questionnaire = await Questionnaire.findOne({ nid: '1234567890' });
    
    if (questionnaire) {
      console.log('✅ Found questionnaire data:');
      console.log(`ID: ${questionnaire._id}`);
      console.log(`User ID: ${questionnaire.user}`);
      console.log(`Patient ID: ${questionnaire.patient}`);
      console.log(`NID: ${questionnaire.nid}`);
      console.log(`Blood Type: ${questionnaire.bloodType}`);
      console.log(`Height: ${questionnaire.height}`);
      console.log(`Weight: ${questionnaire.weight}`);
      console.log(`Emergency Contact: ${questionnaire.emergencyContact}`);
      console.log(`Emergency Phone: ${questionnaire.emergencyPhone}`);
      console.log(`Relationship: ${questionnaire.relationship}`);
      console.log(`Allergies: ${questionnaire.allergies}`);
      console.log(`Current Medications: ${questionnaire.currentMedications}`);
      console.log(`Chronic Conditions: ${questionnaire.chronicConditions}`);
      console.log(`Previous Surgeries: ${questionnaire.previousSurgeries}`);
      console.log(`Smoking: ${questionnaire.smoking}`);
      console.log(`Alcohol: ${questionnaire.alcohol}`);
      console.log(`Exercise: ${questionnaire.exercise}`);
      console.log(`Diet: ${questionnaire.diet}`);
      console.log(`Completed At: ${questionnaire.completedAt}`);
    } else {
      console.log('❌ No questionnaire found with NID: 1234567890');
    }
    
    // List all questionnaires with NIDs
    console.log('\n📋 All Questionnaires with NIDs:');
    const allQuestionnaires = await Questionnaire.find().select('nid user patient');
    allQuestionnaires.forEach((q, index) => {
      console.log(`${index + 1}. NID: ${q.nid} - User: ${q.user} - Patient: ${q.patient}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking questionnaire data:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
checkQuestionnaireData();
