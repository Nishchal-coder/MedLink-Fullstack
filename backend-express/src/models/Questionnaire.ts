import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionnaire {
  _id?: any;
  user: string; // Reference to User
  patient: string; // Reference to Patient
  
  // Health Information (only health-related fields)
  nid: string;
  
  // Medical Information
  bloodType: string;
  height?: string;
  weight?: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationship: string;
  
  // Medical History
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  previousSurgeries?: string;
  
  // Lifestyle Information
  smoking: 'never' | 'former' | 'current';
  alcohol: 'never' | 'occasional' | 'moderate' | 'heavy';
  exercise: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  diet: 'balanced' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'other';
  
  // Metadata
  completedAt: Date;
  version: number; // For tracking questionnaire versions
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestionnaireDocument extends Omit<IQuestionnaire, '_id'>, Document {}

const QuestionnaireSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true
  },
  
  // Health Information (only health-related fields)
  nid: {
    type: String,
    required: true,
    maxlength: 20
  },
  
  // Medical Information
  bloodType: {
    type: String,
    default: 'Not specified'
  },
  height: {
    type: String,
    maxlength: 10
  },
  weight: {
    type: String,
    maxlength: 10
  },
  emergencyContact: {
    type: String,
    required: true,
    maxlength: 100
  },
  emergencyPhone: {
    type: String,
    required: true,
    maxlength: 20
  },
  relationship: {
    type: String,
    required: true,
    maxlength: 50
  },
  
  // Medical History
  allergies: {
    type: String,
    maxlength: 1000
  },
  currentMedications: {
    type: String,
    maxlength: 1000
  },
  chronicConditions: {
    type: String,
    maxlength: 1000
  },
  previousSurgeries: {
    type: String,
    maxlength: 1000
  },
  
  // Lifestyle Information
  smoking: {
    type: String,
    required: true,
    enum: ['never', 'former', 'current'],
    default: 'never'
  },
  alcohol: {
    type: String,
    required: true,
    enum: ['never', 'occasional', 'moderate', 'heavy'],
    default: 'never'
  },
  exercise: {
    type: String,
    required: true,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very-active'],
    default: 'sedentary'
  },
  diet: {
    type: String,
    required: true,
    enum: ['balanced', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'other'],
    default: 'balanced'
  },
  
  // Metadata
  completedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for better query performance
QuestionnaireSchema.index({ user: 1 });
QuestionnaireSchema.index({ patient: 1 });
QuestionnaireSchema.index({ completedAt: -1 });
QuestionnaireSchema.index({ user: 1, version: -1 }); // For getting latest version per user

// Ensure one questionnaire per user (latest version)
QuestionnaireSchema.index({ user: 1 }, { unique: false }); // Allow multiple versions

export const Questionnaire = mongoose.model<IQuestionnaireDocument>('Questionnaire', QuestionnaireSchema);
