import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';
import { IFileAsset } from '../types';

export interface IFileAssetDocument extends Omit<IFileAsset, '_id'>, Document {}

const FileAssetSchema = new Schema({
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
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['photo', 'report', 'document', 'image', 'pdf', 'lab_result'],
    required: true
  },
  originalFilename: {
    type: String,
    required: true,
    maxlength: 255
  },
  fileSize: {
    type: Number,
    required: true,
    default: 0
  },
  image:{
    type: String,
  },  
  mimeType: {
    type: String,
    required: true,
    default: 'application/octet-stream',
    maxlength: 100
  },
  sha256: {
    type: String,
    required: true,
    maxlength: 64
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes
FileAssetSchema.index({ patient: 1, fileType: 1 });
FileAssetSchema.index({ hospital: 1 });
FileAssetSchema.index({ uploadedBy: 1 });
FileAssetSchema.index({ uploadedAt: -1 });

// Compound unique index
FileAssetSchema.index({ patient: 1, fileType: 1, sha256: 1 }, { unique: true });

// Pre-save middleware to generate SHA256 hash
FileAssetSchema.pre('save', function(next) {
  const doc = this as any;
  if (!doc.sha256 && doc.file) {
    // Generate SHA256 hash from file path and content
    doc.sha256 = crypto.createHash('sha256').update(doc.file + doc.originalFilename).digest('hex');
  }
  next();
});

export const FileAsset = mongoose.model('FileAsset', FileAssetSchema);
