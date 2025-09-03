import { Request } from 'express';

export interface IUser {
  _id?: any;
  username: string;
  password: string;
  role: 'superadmin' | 'admin' | 'doctor' | 'user' | 'emergency_access';
  hospital?: string;
  hospitalName?: string;
  mustChangePassword: boolean;
  emergencyAccessExpiresAt?: Date;
  nationalId?: string;
  contactNumber?: string;
  isPhoneVerified: boolean;
  phoneVerificationCode?: string;
  verificationCodeExpiresAt?: Date;
  specialization?: string;
  profilePicture?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  status: 'Active' | 'Inactive';
  firstName?: string;
  lastName?: string;
  initialSetupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHospital {
  _id?: any;
  name: string;
  location?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatient {
  _id?: any;
  user: string;
  hospital: string;
  mrn: string;
  dateOfBirth?: Date;
  gender?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  hasBloodType: boolean;
  height?: string;
  weight?: string;
  diseases: string[];
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  allergies: string[];
  medications: string[];
  medicalHistory?: string;
  photo?: string;
  age?: number;
  emergencyContact?: string;
  testResults: any[];
  medicalImagesSummary: any[];
  createdAt: Date;
  updatedAt: Date;
  lastUpdated: Date;
  updatedBy?: string;
}

export interface IMedicalRecord {
  _id?: any;
  patient: string;
  hospital: string;
  doctor?: string;
  recordType: 'blood_test' | 'x_ray' | 'mri' | 'ct_scan' | 'ultrasound' | 'ecg' | 'biopsy' | 'surgery' | 'consultation' | 'vaccination' | 'other';
  title: string;
  description: string;
  diagnosis: any;
  prescriptions: any;
  treatments: any;
  status: 'active' | 'pending' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  recordDate: Date;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrescription {
  _id?: any;
  patient: string;
  doctor: string;
  hospital: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'active' | 'completed' | 'discontinued' | 'expired';
  prescribedDate: Date;
  startDate: Date;
  endDate: Date;
  sideEffects?: string;
  contraindications?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFileAsset {
  _id?: any;
  patient: string;
  hospital: string;
  uploadedBy?: string;
  file: string;
  fileType: 'photo' | 'report' | 'document' | 'image' | 'pdf' | 'lab_result';
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  sha256: string;
  uploadedAt: Date;
}

export interface IAuditLog {
  _id?: any;
  user?: string;
  action: 'create' | 'update' | 'delete' | 'read' | 'access' | 'download' | 'share';
  objectType: string;
  objectId: string;
  changes?: any;
  ipAddress?: string;
  metadata?: any;
  timestamp: Date;
}

export interface IAppointment {
  _id?: string;
  patient: string;
  doctor: string;
  hospital: string;
  appointmentType: 'consultation' | 'follow_up' | 'emergency' | 'routine' | 'specialist' | 'other';
  scheduledDate: Date;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason?: string;
  notes?: string;
  symptoms: string[];
  reminderSent: boolean;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicalTest {
  _id?: string;
  patient: string;
  hospital: string;
  doctor?: string;
  testType: 'blood_test' | 'urine_test' | 'x_ray' | 'mri' | 'ct_scan' | 'ultrasound' | 'ecg' | 'biopsy' | 'culture' | 'genetic' | 'other';
  testName: string;
  testDate: Date;
  results: any;
  normalRange: any;
  interpretation?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedicalImage {
  _id?: string;
  patient: string;
  hospital: string;
  uploadedBy?: string;
  imageType: 'x_ray' | 'mri' | 'ct_scan' | 'ultrasound' | 'ecg' | 'endoscopy' | 'biopsy' | 'other';
  title: string;
  description?: string;
  imageFile: string;
  thumbnail?: string;
  imageDate: Date;
  bodyPart?: string;
  findings?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestionnaire {
  _id?: any;
  user: string;
  patient: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phone: string;
  email: string;
  nid: string;
  bloodType: string;
  height?: string;
  weight?: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationship: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  previousSurgeries?: string;
  smoking: 'never' | 'former' | 'current';
  alcohol: 'never' | 'occasional' | 'moderate' | 'heavy';
  exercise: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  diet: 'balanced' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'other';
  completedAt: Date;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthRequest extends Request {
  user?: IUser;
  userHospital?: string;
}

export interface IDashboardData {
  totalRecords: number;
  activeRecords: number;
  pendingRecords: number;
  totalPrescriptions: number;
  activePrescriptions: number;
  recentRecords: IMedicalRecord[];
  recentPrescriptions: IPrescription[];
}
