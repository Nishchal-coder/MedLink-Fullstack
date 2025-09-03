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

const User = mongoose.model('User', userSchema);

// Add NIDs to real patients
async function addNIDsToRealPatients() {
  try {
    console.log('🔧 Adding NIDs to real patients...');
    
    // Find users without NIDs who are actual patients (not doctors/admins)
    const usersWithoutNID = await User.find({ 
      nationalId: { $exists: false },
      role: 'user'
    }).select('firstName lastName email username');
    
    console.log(`Found ${usersWithoutNID.length} patients without NIDs`);
    
    if (usersWithoutNID.length === 0) {
      console.log('✅ All patients already have NIDs');
      return;
    }
    
    // Generate NIDs for each patient
    for (let i = 0; i < usersWithoutNID.length; i++) {
      const user = usersWithoutNID[i];
      
      // Generate a unique NID based on user ID and index
      const nid = `NID${user._id.toString().slice(-6)}${(i + 1).toString().padStart(3, '0')}`;
      
      // Update user with NID
      await User.findByIdAndUpdate(user._id, { nationalId: nid });
      
      console.log(`✅ Added NID ${nid} to ${user.firstName} ${user.lastName} (${user.email})`);
    }
    
    console.log(`\n🎉 Successfully added NIDs to ${usersWithoutNID.length} patients`);
    console.log('\n📋 You can now test the emergency portal with these NIDs:');
    
    // Show the updated list
    const updatedUsers = await User.find({ 
      nationalId: { $exists: true, $ne: null },
      role: 'user'
    }).select('firstName lastName nationalId email');
    
    updatedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} - NID: ${user.nationalId}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding NIDs:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// Run the script
addNIDsToRealPatients();
