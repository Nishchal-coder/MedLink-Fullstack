import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface IPrescription {
  _id?: any;
  patientId: string; // Reference to User
  doctorId: string; // Reference to User (doctor)
  patientNID: string; // NID for easy lookup
  hospital: string;
  diagnosis: string;
  notes?: string;
  medicines: IMedicine[];
  status: 'active' | 'completed' | 'cancelled';
  prescribedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrescriptionDocument extends Omit<IPrescription, '_id'>, Document {}

const MedicineSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  dosage: {
    type: String,
    required: true,
    maxlength: 50
  },
  frequency: {
    type: String,
    required: true,
    maxlength: 100
  },
  duration: {
    type: String,
    required: true,
    maxlength: 50
  },
  instructions: {
    type: String,
    maxlength: 500
  }
});

const PrescriptionSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patientNID: {
    type: String,
    required: true,
    index: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true
  },
  diagnosis: {
    type: String,
    required: true,
    maxlength: 1000
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  medicines: [MedicineSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  prescribedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PrescriptionSchema.index({ patientId: 1, prescribedAt: -1 });
PrescriptionSchema.index({ patientNID: 1, prescribedAt: -1 });
PrescriptionSchema.index({ doctorId: 1, prescribedAt: -1 });
PrescriptionSchema.index({ hospital: 1, prescribedAt: -1 });
PrescriptionSchema.index({ status: 1 });

export const Prescription = mongoose.model<IPrescriptionDocument>('Prescription', PrescriptionSchema);
