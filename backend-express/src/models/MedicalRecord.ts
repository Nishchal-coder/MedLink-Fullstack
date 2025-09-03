import mongoose, { Document, Schema } from 'mongoose';
import { IMedicalRecord } from '../types';

export interface IMedicalRecordDocument extends Omit<IMedicalRecord, '_id'>, Document {}

const MedicalRecordSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  recordType: {
    type: String,
    enum: ['blood_test', 'x_ray', 'mri', 'ct_scan', 'ultrasound', 'ecg', 'biopsy', 'surgery', 'consultation', 'vaccination', 'other'],
    default: 'other'
  },
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  diagnosis: {
    type: Schema.Types.Mixed,
    default: {}
  },
  prescriptions: {
    type: Schema.Types.Mixed,
    default: {}
  },
  treatments: {
    type: Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'archived'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  recordDate: {
    type: Date,
    default: Date.now
  },
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: 'FileAsset'
  }]
}, {
  timestamps: true
});

// Indexes
MedicalRecordSchema.index({ patient: 1 });
MedicalRecordSchema.index({ hospital: 1 });
MedicalRecordSchema.index({ doctor: 1 });
MedicalRecordSchema.index({ status: 1 });
MedicalRecordSchema.index({ priority: 1 });
MedicalRecordSchema.index({ recordDate: -1 });
MedicalRecordSchema.index({ createdAt: -1 });

export const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);
