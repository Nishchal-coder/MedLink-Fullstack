import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Hospital, Patient } from '../models';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await Patient.deleteMany({});
    console.log('Cleared existing data');

    // Create hospitals
    const hospital1 = new Hospital({
      name: 'City General Hospital',
      location: 'Downtown',
      contactPhone: '+1-555-0101'
    });

    const hospital2 = new Hospital({
      name: 'Metro Medical Center',
      location: 'Uptown',
      contactPhone: '+1-555-0102'
    });

    await hospital1.save();
    await hospital2.save();
    console.log('Created hospitals');

    // Create users
    const superadmin = new User({
      username: 'superadmin',
      password: 'admin123',
      role: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      contactNumber: '+1-555-0001'
    });

    const admin = new User({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      hospital: hospital1._id,
      firstName: 'Hospital',
      lastName: 'Admin',
      contactNumber: '+1-555-0002'
    });

    const doctor = new User({
      username: 'doctor',
      password: 'doctor123',
      role: 'doctor',
      hospital: hospital1._id,
      firstName: 'Dr. John',
      lastName: 'Smith',
      specialization: 'Cardiology',
      contactNumber: '+1-555-0003'
    });

    const user = new User({
      username: 'user',
      password: 'user123',
      role: 'user',
      hospital: hospital1._id,
      firstName: 'Jane',
      lastName: 'Doe',
      contactNumber: '+1-555-0004'
    });

    await superadmin.save();
    await admin.save();
    await doctor.save();
    await user.save();
    console.log('Created users');

    // Create patient for the user
    const patient = new Patient({
      user: user._id,
      hospital: hospital1._id,
      mrn: 'MRN000001',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'female',
      bloodGroup: 'O+',
      hasBloodType: true,
      diseases: ['Hypertension'],
      allergies: ['Penicillin'],
      medications: ['Lisinopril 10mg'],
      address: '123 Main St, City, State 12345',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+1-555-0005'
    });

    await patient.save();
    console.log('Created patient');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo accounts created:');
    console.log('┌─────────────┬────────────┬──────────┬─────────────────┐');
    console.log('│ Username    │ Password   │ Role     │ Description     │');
    console.log('├─────────────┼────────────┼──────────┼─────────────────┤');
    console.log('│ superadmin  │ admin123   │ Super    │ Full system     │');
    console.log('│             │            │ Admin    │ access          │');
    console.log('├─────────────┼────────────┼──────────┼─────────────────┤');
    console.log('│ admin       │ admin123   │ Admin    │ Hospital        │');
    console.log('│             │            │          │ administration  │');
    console.log('├─────────────┼────────────┼──────────┼─────────────────┤');
    console.log('│ doctor      │ doctor123  │ Doctor   │ Medical staff   │');
    console.log('├─────────────┼────────────┼──────────┼─────────────────┤');
    console.log('│ user        │ user123    │ User     │ Patient         │');
    console.log('└─────────────┴────────────┴──────────┴─────────────────┘');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedDatabase();
