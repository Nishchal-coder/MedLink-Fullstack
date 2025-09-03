import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasActiveEmergencyAccess(): boolean;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'doctor', 'user', 'emergency_access'],
    default: 'user'
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: false
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  emergencyAccessExpiresAt: {
    type: Date,
    default: null
  },
  nationalId: {
    type: String,
    maxlength: 36
  },
  contactNumber: {
    type: String,
    maxlength: 20,
    match: /^[0-9+\-()\s]+$/
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationCode: {
    type: String,
    maxlength: 6
  },
  verificationCodeExpiresAt: {
    type: Date
  },
  specialization: {
    type: String,
    maxlength: 255
  },
  profilePicture: {
    type: String
  },
  bio: {
    type: String
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  address: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50
  },
  initialSetupCompleted: {
    type: Boolean,
    default: false
  },
  // Admin-specific fields
  email: {
    type: String,
    required: true,
    maxlength: 255,
    unique: true
  },
  // Hospital information for admins
  hospitalName: {
    type: String,
    maxlength: 200
  },
  hospitalAddress: {
    type: String,
    maxlength: 500
  },
  hospitalContact: {
    type: String,
    maxlength: 20,
    match: /^[0-9+\-()\s]+$/
  },
  adminPosition: {
    type: String,
    maxlength: 100
  },
  department: {
    type: String,
    maxlength: 100
  },
  employeeId: {
    type: String,
    maxlength: 50
  },
  emergencyContact: {
    type: String,
    maxlength: 100
  },
  emergencyPhone: {
    type: String,
    maxlength: 20,
    match: /^[0-9+\-()\s]+$/
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.password;
      delete ret.phoneVerificationCode;
      return ret;
    }
  }
});

// Indexes
// Note: username and email fields already have unique: true, so no need for explicit indexes
UserSchema.index({ role: 1 });
UserSchema.index({ hospital: 1 });
UserSchema.index({ status: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check emergency access
UserSchema.methods.hasActiveEmergencyAccess = function(): boolean {
  return !!(this.emergencyAccessExpiresAt && new Date() <= this.emergencyAccessExpiresAt);
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

export const User = mongoose.model('User', UserSchema);
