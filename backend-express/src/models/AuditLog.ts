import mongoose, { Document, Schema } from 'mongoose';
import { IAuditLog } from '../types';

export interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {}

const AuditLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'read', 'access', 'download', 'share'],
    required: true
  },
  objectType: {
    type: String,
    required: true,
    maxlength: 64
  },
  objectId: {
    type: String,
    required: true,
    maxlength: 64
  },
  changes: {
    type: Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes
AuditLogSchema.index({ objectType: 1, objectId: 1 });
AuditLogSchema.index({ timestamp: 1 });
AuditLogSchema.index({ user: 1 });
AuditLogSchema.index({ action: 1 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
