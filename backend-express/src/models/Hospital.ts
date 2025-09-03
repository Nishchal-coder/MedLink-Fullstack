import mongoose, { Document, Schema } from 'mongoose';
import { IHospital } from '../types';

export interface IHospitalDocument extends Omit<IHospital, '_id'>, Document {}

const HospitalSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 255
  },
  location: {
    type: String,
    maxlength: 255
  },
  contactPhone: {
    type: String,
    maxlength: 20,
    match: /^[0-9+\-()\s]+$/
  }
}, {
  timestamps: true
});

// Note: name field already has unique: true, so no need for explicit index

export const Hospital = mongoose.model('Hospital', HospitalSchema);
