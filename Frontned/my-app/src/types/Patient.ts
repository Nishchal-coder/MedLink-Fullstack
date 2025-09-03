export interface Patient {
  _id?: string;
  user: string; // User ID reference
  hospital: string; // Hospital ID reference
  mrn: string; // Medical Record Number
  name?: string; // Full name (computed from user data)
  nationalId?: string; // National ID from user
  dateOfBirth?: Date;
  gender?: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  hasBloodType: boolean;
  photo?: string; // URL to profile picture
  email?: string; // From user data
  phone?: string; // From user contactNumber
  address?: string;
  emergencyContact?: string; // Legacy field
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  medicalHistory?: string;
  allergies: string[];
  medications: string[];
  diseases: string[];
  age?: number; // Calculated from dateOfBirth
  testResults: any[];
  medicalImagesSummary: any[];
  lastUpdated: Date;
  updatedBy?: string; // User ID who last updated
  createdAt: Date;
  updatedAt: Date;
  
  // Frontend computed fields
  status?: string; // From user status
  userId?: string; // Alias for user field
  dob?: string; // Alias for dateOfBirth
  bloodType?: string; // Alias for bloodGroup
}

export interface MedicalTest {
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

export interface MedicalImage {
  _id?: string;
  patient: string;
  hospital: string;
  uploadedBy?: string;
  imageType: 'x_ray' | 'mri' | 'ct_scan' | 'ultrasound' | 'ecg' | 'endoscopy' | 'biopsy' | 'other';
  title: string;
  description?: string;
  imageFile: string; // File path/URL
  thumbnail?: string;
  imageDate: Date;
  bodyPart?: string;
  findings?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  _id?: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  address?: string;
  priority: number; // 1 = primary, 2 = secondary, 3 = tertiary
  isActive: boolean;
}

export interface MedicalRecord {
  _id?: string;
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

export interface Prescription {
  _id?: string;
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
