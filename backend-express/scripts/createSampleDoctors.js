const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'doctor', 'user', 'emergency_access'], default: 'user' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  specialization: { type: String },
  contactNumber: { type: String },
  address: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  mustChangePassword: { type: Boolean, default: true },
  initialSetupCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// Sample doctor data
const sampleDoctors = [
  {
    username: 'dr.smith',
    firstName: 'John',
    lastName: 'Smith',
    email: 'dr.smith@hospital.com',
    specialization: 'Cardiology',
    contactNumber: '+1-555-0101',
    address: '123 Medical Center Dr, Suite 100',
    gender: 'male',
    dateOfBirth: new Date('1980-05-15')
  },
  {
    username: 'dr.johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'dr.johnson@hospital.com',
    specialization: 'Pediatrics',
    contactNumber: '+1-555-0102',
    address: '456 Health Plaza, Suite 200',
    gender: 'female',
    dateOfBirth: new Date('1985-08-22')
  },
  {
    username: 'dr.williams',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'dr.williams@hospital.com',
    specialization: 'Neurology',
    contactNumber: '+1-555-0103',
    address: '789 Care Street, Suite 300',
    gender: 'male',
    dateOfBirth: new Date('1978-12-10')
  },
  {
    username: 'dr.brown',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'dr.brown@hospital.com',
    specialization: 'Orthopedics',
    contactNumber: '+1-555-0104',
    address: '321 Wellness Ave, Suite 400',
    gender: 'female',
    dateOfBirth: new Date('1982-03-28')
  },
  {
    username: 'dr.davis',
    firstName: 'David',
    lastName: 'Davis',
    email: 'dr.davis@hospital.com',
    specialization: 'Emergency Medicine',
    contactNumber: '+1-555-0105',
    address: '654 Emergency Lane, Suite 500',
    gender: 'male',
    dateOfBirth: new Date('1987-11-05')
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

// Create doctors
async function createSampleDoctors() {
  try {
    console.log('Starting to create sample doctors...');
    
    const createdDoctors = [];
    
    for (const doctorData of sampleDoctors) {
      // Check if doctor already exists
      const existingDoctor = await User.findOne({ 
        $or: [
          { username: doctorData.username },
          { email: doctorData.email }
        ]
      });
      
      if (existingDoctor) {
        console.log(`Doctor ${doctorData.username} already exists, skipping...`);
        continue;
      }
      
      // Generate random password
      const password = generateRandomPassword();
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create doctor
      const doctor = new User({
        ...doctorData,
        password: hashedPassword,
        role: 'doctor',
        mustChangePassword: true,
        initialSetupCompleted: false
      });
      
      await doctor.save();
      
      createdDoctors.push({
        username: doctorData.username,
        password: password,
        email: doctorData.email,
        specialization: doctorData.specialization
      });
      
      console.log(`✅ Created doctor: ${doctorData.username}`);
    }
    
    console.log('\n📋 Created Doctors Summary:');
    console.log('========================');
    createdDoctors.forEach((doctor, index) => {
      console.log(`${index + 1}. Username: ${doctor.username}`);
      console.log(`   Password: ${doctor.password}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Specialization: ${doctor.specialization}`);
      console.log('');
    });
    
    if (createdDoctors.length === 0) {
      console.log('No new doctors were created (all already exist).');
    } else {
      console.log(`✅ Successfully created ${createdDoctors.length} doctors!`);
      console.log('⚠️  IMPORTANT: Save these credentials securely!');
      console.log('⚠️  Doctors will be required to change their password on first login.');
    }
    
  } catch (error) {
    console.error('❌ Error creating doctors:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
createSampleDoctors();
