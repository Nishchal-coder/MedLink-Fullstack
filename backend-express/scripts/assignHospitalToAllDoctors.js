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

// Assign hospital to all doctors
async function assignHospitalToAllDoctors() {
  try {
    console.log('🏥 Assigning hospitals to all doctors...');
    
    // Find all doctors without hospital assignment
    const doctorsWithoutHospital = await User.find({ 
      role: 'doctor', 
      hospital: { $exists: false } 
    });
    
    const doctorsWithNullHospital = await User.find({ 
      role: 'doctor', 
      hospital: null 
    });
    
    const allDoctorsNeedingHospital = [...doctorsWithoutHospital, ...doctorsWithNullHospital];
    
    if (allDoctorsNeedingHospital.length === 0) {
      console.log('✅ All doctors already have hospital assignments');
      return;
    }
    
    console.log(`Found ${allDoctorsNeedingHospital.length} doctors without hospital assignment`);
    
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
    
    // Update all doctors using findByIdAndUpdate to avoid validation errors
    for (const doctor of allDoctorsNeedingHospital) {
      await User.findByIdAndUpdate(doctor._id, { hospital: defaultHospital._id }, { new: true });
      console.log(`✅ Assigned hospital to Dr. ${doctor.firstName} ${doctor.lastName}`);
    }
    
    console.log(`\n🎉 Successfully assigned hospital to ${allDoctorsNeedingHospital.length} doctors`);
    console.log(`Hospital: ${defaultHospital.name} (ID: ${defaultHospital._id})`);
    
  } catch (error) {
    console.error('❌ Error assigning hospitals:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
assignHospitalToAllDoctors();
