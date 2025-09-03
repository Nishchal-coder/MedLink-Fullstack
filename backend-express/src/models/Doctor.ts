import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDoctor extends Document {
  // Personal Information
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  
  // Contact Information
  contactNumber: string;
  address: string;
  
  // Medical Credentials
  specialization: string;
  medicalLicenseNumber: string;
  yearsOfExperience?: number;
  hospital: string;
  
  // Education
  educationalBackground?: string[];
  
  // Professional Certifications
  certifications?: string[];
  
  // Languages Spoken
  languages?: string[];
  
  // Account Security
  password: string;
  
  // Additional fields for system management
  status: 'Active' | 'Inactive';
  mustChangePassword: boolean;
  initialSetupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const DoctorSchema = new Schema({
  // Personal Information
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [255, 'Email cannot exceed 255 characters'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value: Date) {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 22 && age <= 80; // Doctors should be between 22 and 80 years old
      },
      message: 'Doctor must be between 22 and 80 years old'
    }
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be male, female, or other'
    }
  },
  
  // Contact Information
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    maxlength: [20, 'Contact number cannot exceed 20 characters'],
    match: [/^[0-9+\-()\s]+$/, 'Contact number can only contain numbers, +, -, (, ), and spaces']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  
  // Medical Credentials
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    maxlength: [255, 'Specialization cannot exceed 255 characters']
  },
  medicalLicenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Medical license number cannot exceed 100 characters'],
    match: [/^[A-Z0-9\-]+$/, 'Medical license number can only contain uppercase letters, numbers, and hyphens']
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50'],
    validate: {
      validator: function(value: number) {
        return Number.isInteger(value);
      },
      message: 'Years of experience must be a whole number'
    }
  },
  hospital: {
    type: String,
    required: [true, 'Hospital is required'],
    trim: true,
    maxlength: [255, 'Hospital name cannot exceed 255 characters']
  },
  
  // Education
  educationalBackground: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each education entry cannot exceed 200 characters']
  }],
  
  // Professional Certifications
  certifications: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each certification cannot exceed 200 characters']
  }],
  
  // Languages Spoken
  languages: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each language cannot exceed 50 characters'],
    match: [/^[a-zA-Z\s]+$/, 'Language can only contain letters and spaces']
  }],
  
  // Account Security
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function(value: string) {
        // Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        return passwordRegex.test(value);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  
  // Additional fields for system management
  status: {
    type: String,
    enum: {
      values: ['Active', 'Inactive'],
      message: 'Status must be Active or Inactive'
    },
    default: 'Active'
  },
  mustChangePassword: {
    type: Boolean,
    default: true
  },
  initialSetupCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.password;
      return ret;
    }
  }
});

// Indexes for better query performance
// Note: username, email, and medicalLicenseNumber fields already have unique: true, so no need for explicit indexes
DoctorSchema.index({ hospital: 1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ status: 1 });
DoctorSchema.index({ createdAt: -1 });

// Compound indexes for common queries
DoctorSchema.index({ hospital: 1, status: 1 });
DoctorSchema.index({ specialization: 1, hospital: 1 });

// Pre-save middleware to hash password
DoctorSchema.pre('save', async function(next) {
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
DoctorSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
DoctorSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Virtual for age calculation
DoctorSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Static method to find doctors by hospital
DoctorSchema.statics.findByHospital = function(hospitalName: string) {
  return this.find({ hospital: hospitalName, status: 'Active' });
};

// Static method to find doctors by specialization
DoctorSchema.statics.findBySpecialization = function(specialization: string) {
  return this.find({ specialization: specialization, status: 'Active' });
};

// Static method to find doctors by hospital and specialization
DoctorSchema.statics.findByHospitalAndSpecialization = function(hospitalName: string, specialization: string) {
  return this.find({ 
    hospital: hospitalName, 
    specialization: specialization, 
    status: 'Active' 
  });
};

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);
