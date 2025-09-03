const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { User, Hospital, Patient, MedicalRecord, Prescription, FileAsset, AuditLog } = require('../dist/models');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create default hospital
    const defaultHospital = await Hospital.findOneAndUpdate(
      { name: 'MedLink General Hospital' },
      {
        name: 'MedLink General Hospital',
        location: 'Main City, State',
        contactPhone: '+1-555-0123'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Default hospital created/updated:', defaultHospital._id);

    // Create superadmin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('superadmin123', 12);
    
    const superadmin = await User.findOneAndUpdate(
      { username: 'superadmin' },
      {
        username: 'superadmin',
        password: hashedPassword,
        role: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        status: 'Active',
        mustChangePassword: false,
        isPhoneVerified: false,
        hospital: defaultHospital._id
      },
      { upsert: true, new: true }
    );
    console.log('✅ Superadmin user created/updated:', superadmin._id);

    // Create indexes for better performance
    console.log('🔍 Creating database indexes...');
    
    // User indexes
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ hospital: 1 });
    await User.collection.createIndex({ status: 1 });
    
    // Patient indexes
    await Patient.collection.createIndex({ user: 1 }, { unique: true });
    await Patient.collection.createIndex({ hospital: 1 });
    await Patient.collection.createIndex({ mrn: 1 }, { unique: true });
    
    // Medical records indexes
    await MedicalRecord.collection.createIndex({ patient: 1 });
    await MedicalRecord.collection.createIndex({ hospital: 1 });
    await MedicalRecord.collection.createIndex({ doctor: 1 });
    await MedicalRecord.collection.createIndex({ recordType: 1 });
    await MedicalRecord.collection.createIndex({ status: 1 });
    await MedicalRecord.collection.createIndex({ recordDate: 1 });
    
    // Prescriptions indexes
    await Prescription.collection.createIndex({ patient: 1 });
    await Prescription.collection.createIndex({ doctor: 1 });
    await Prescription.collection.createIndex({ hospital: 1 });
    await Prescription.collection.createIndex({ status: 1 });
    await Prescription.collection.createIndex({ prescribedDate: 1 });
    
    // File assets indexes
    await FileAsset.collection.createIndex({ patient: 1 });
    await FileAsset.collection.createIndex({ hospital: 1 });
    await FileAsset.collection.createIndex({ uploadedBy: 1 });
    await FileAsset.collection.createIndex({ fileType: 1 });
    await FileAsset.collection.createIndex({ uploadedAt: 1 });
    
    // Audit logs indexes
    await AuditLog.collection.createIndex({ user: 1 });
    await AuditLog.collection.createIndex({ action: 1 });
    await AuditLog.collection.createIndex({ objectType: 1 });
    await AuditLog.collection.createIndex({ objectId: 1 });
    await AuditLog.collection.createIndex({ timestamp: 1 });
    
    console.log('✅ Database indexes created successfully');

    console.log('✅ Database initialization completed successfully');
    console.log('📋 Summary:');
    console.log(`   - Default Hospital: ${defaultHospital._id}`);
    console.log(`   - Superadmin User: ${superadmin._id}`);
    console.log(`   - Database: ${process.env.MONGODB_URI}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
