import mongoose, { Document, Schema } from 'mongoose';
import { IPatient } from '../types';

export interface IPatientDocument extends Omit<IPatient, '_id'>, Document {}

const PatientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  mrn: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    maxlength: 32
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  hasBloodType: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    maxlength: 10
  },
  weight: {
    type: String,
    maxlength: 10
  },
  diseases: {
    type: [String],
    default: []
  },
  address: {
    type: String,
    maxlength: 255
  },
  emergencyContactName: {
    type: String,
    maxlength: 255
  },
  emergencyContactPhone: {
    type: String,
    maxlength: 20
  },
  emergencyContactRelation: {
    type: String,
    maxlength: 100
  },
  allergies: {
    type: [String],
    default: []
  },
  medications: {
    type: [String],
    default: []
  },
  medicalHistory: {
    type: String
  },
  photo: {
    type: String
  },
  age: {
    type: Number
  },
  emergencyContact: {
    type: String,
    maxlength: 255
  },
  testResults: {
    type: [Schema.Types.Mixed],
    default: []
  },
  medicalImagesSummary: {
    type: [Schema.Types.Mixed],
    default: []
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
PatientSchema.index({ hospital: 1 });
// Note: user and mrn fields already have unique: true, so no need for explicit indexes

// Pre-save middleware to auto-generate MRN and calculate age
PatientSchema.pre('save', function(next) {
  const doc = this as any;
  
  // Auto-generate MRN if not provided
  if (!doc.mrn) {
    if (doc.user) {
      const userId = doc.user.toString();
      const lastSix = userId.slice(-6);
      doc.mrn = `MRN${lastSix.padStart(6, '0')}`;
    } else {
      // Fallback to timestamp if no user ID
      doc.mrn = `MRN${Date.now().toString().slice(-6)}`;
    }
  }
  
  // Calculate age if date of birth is provided
  if (doc.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(doc.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    doc.age = age;
  }
  
  doc.lastUpdated = new Date();
  next();
});

export const Patient = mongoose.model('Patient', PatientSchema);
