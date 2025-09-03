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
const Hospital = mongoose.model('Hospital', hospitalSchema);

// Assign hospital to doctor
async function assignHospitalToDoctor() {
  try {
    console.log('🏥 Assigning hospital to doctor...');
    
    // Find the doctor
    const doctor = await User.findOne({ username: 'sanjeevchettri' });
    if (!doctor) {
      console.log('❌ Doctor not found');
      return;
    }
    
    console.log(`✅ Found doctor: ${doctor.firstName} ${doctor.lastName}`);
    console.log(`Current hospital: ${doctor.hospital}`);
    
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
    
    // Update doctor's hospital
    doctor.hospital = defaultHospital._id;
    await doctor.save();
    
    console.log(`✅ Successfully assigned hospital to doctor`);
    console.log(`Hospital ID: ${defaultHospital._id}`);
    console.log(`Hospital Name: ${defaultHospital.name}`);
    
  } catch (error) {
    console.error('❌ Error assigning hospital:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
assignHospitalToDoctor();
