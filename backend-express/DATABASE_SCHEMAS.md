# MedLink Database Schemas

## Overview

This document outlines the complete database schema structure for the MedLink healthcare system. All schemas are implemented using Mongoose and MongoDB.

## 🔐 User Schema

**Collection**: `users`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `username` | String | Yes | Unique username (3-30 chars) |
| `password` | String | Yes | Hashed password (min 6 chars) |
| `role` | String | Yes | Enum: 'superadmin', 'admin', 'doctor', 'user', 'emergency_access' |
| `hospital` | ObjectId | No | Reference to Hospital collection |
| `mustChangePassword` | Boolean | No | Default: false |
| `emergencyAccessExpiresAt` | Date | No | Emergency access expiration |
| `nationalId` | String | No | National ID (max 36 chars) |
| `contactNumber` | String | No | Phone number (max 20 chars) |
| `isPhoneVerified` | Boolean | No | Default: false |
| `phoneVerificationCode` | String | No | Verification code (max 6 chars) |
| `verificationCodeExpiresAt` | Date | No | Code expiration time |
| `specialization` | String | No | Doctor specialization (max 255 chars) |
| `profilePicture` | String | No | Profile picture URL |
| `bio` | String | No | User biography |
| `dateOfBirth` | Date | No | Date of birth |
| `gender` | String | No | Enum: 'male', 'female', 'other' |
| `address` | String | No | User address |
| `status` | String | No | Enum: 'Active', 'Inactive' (default: 'Active') |
| `firstName` | String | No | First name (max 50 chars) |
| `lastName` | String | No | Last name (max 50 chars) |
| `createdAt` | Date | Yes | Document creation time |
| `updatedAt` | Date | Yes | Document update time |

### Indexes
- `username` (unique)
- `role`
- `hospital`
- `status`

### Virtual Fields
- `fullName`: Computed from firstName + lastName

### Methods
- `comparePassword(candidatePassword)`: Compare password with hash
- `hasActiveEmergencyAccess()`: Check if emergency access is valid

---

## 👥 Patient Schema

**Collection**: `patients`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `user` | ObjectId | Yes | Reference to User collection (unique) |
| `hospital` | ObjectId | Yes | Reference to Hospital collection |
| `mrn` | String | Yes | Medical Record Number (unique, max 50 chars) |
| `dateOfBirth` | Date | No | Date of birth |
| `gender` | String | No | Gender (max 32 chars) |
| `bloodGroup` | String | No | Enum: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-' |
| `hasBloodType` | Boolean | No | Default: false |
| `diseases` | [String] | No | Array of diseases (default: []) |
| `address` | String | No | Address (max 255 chars) |
| `emergencyContactName` | String | No | Emergency contact name (max 255 chars) |
| `emergencyContactPhone` | String | No | Emergency contact phone (max 20 chars) |
| `emergencyContactRelation` | String | No | Relationship to patient (max 100 chars) |
| `allergies` | [String] | No | Array of allergies (default: []) |
| `medications` | [String] | No | Array of medications (default: []) |
| `medicalHistory` | String | No | Medical history text |
| `photo` | String | No | Patient photo URL |
| `age` | Number | No | Calculated age |
| `emergencyContact` | String | No | Legacy emergency contact (max 255 chars) |
| `testResults` | [Mixed] | No | Array of test results (default: []) |
| `medicalImagesSummary` | [Mixed] | No | Array of medical images (default: []) |
| `lastUpdated` | Date | No | Last update time (default: now) |
| `updatedBy` | ObjectId | No | Reference to User who last updated |
| `createdAt` | Date | Yes | Document creation time |
| `updatedAt` | Date | Yes | Document update time |

### Indexes
- `hospital`
- `user` (unique)
- `mrn` (unique)

### Pre-save Middleware
- Auto-generates MRN if not provided
- Calculates age from dateOfBirth
- Updates lastUpdated timestamp

---

## 🏥 Hospital Schema

**Collection**: `hospitals`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `name` | String | Yes | Hospital name |
| `location` | String | No | Hospital location |
| `contactPhone` | String | No | Hospital contact phone |
| `createdAt` | Date | Yes | Document creation time |
| `updatedAt` | Date | Yes | Document update time |

---

## 📋 Medical Record Schema

**Collection**: `medicalrecords`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `patient` | ObjectId | Yes | Reference to Patient collection |
| `hospital` | ObjectId | Yes | Reference to Hospital collection |
| `doctor` | ObjectId | No | Reference to User collection |
| `recordType` | String | Yes | Enum: 'blood_test', 'x_ray', 'mri', 'ct_scan', 'ultrasound', 'ecg', 'biopsy', 'surgery', 'consultation', 'vaccination', 'other' |
| `title` | String | Yes | Record title |
| `description` | String | Yes | Record description |
| `diagnosis` | Mixed | No | Diagnosis data |
| `prescriptions` | Mixed | No | Prescriptions data |
| `treatments` | Mixed | No | Treatments data |
| `status` | String | Yes | Enum: 'active', 'pending', 'completed', 'archived' |
| `priority` | String | Yes | Enum: 'low', 'medium', 'high', 'critical' |
| `recordDate` | Date | Yes | Date of record |
| `attachments` | [String] | No | Array of attachment URLs |
| `createdAt` | Date | Yes | Document creation time |
| `updatedAt` | Date | Yes | Document update time |

### Indexes
- `patient`
- `hospital`
- `doctor`
- `recordType`
- `status`
- `recordDate`

---

## 💊 Prescription Schema

**Collection**: `prescriptions`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `patient` | ObjectId | Yes | Reference to Patient collection |
| `doctor` | ObjectId | Yes | Reference to User collection |
| `hospital` | ObjectId | Yes | Reference to Hospital collection |
| `medicationName` | String | Yes | Name of medication |
| `dosage` | String | Yes | Dosage information |
| `frequency` | String | Yes | Frequency of administration |
| `duration` | String | Yes | Duration of treatment |
| `instructions` | String | Yes | Instructions for use |
| `status` | String | Yes | Enum: 'active', 'completed', 'discontinued', 'expired' |
| `prescribedDate` | Date | Yes | Date prescribed |
| `startDate` | Date | Yes | Start date of medication |
| `endDate` | Date | Yes | End date of medication |
| `sideEffects` | String | No | Potential side effects |
| `contraindications` | String | No | Contraindications |
| `createdAt` | Date | Yes | Document creation time |
| `updatedAt` | Date | Yes | Document update time |

### Indexes
- `patient`
- `doctor`
- `hospital`
- `status`
- `prescribedDate`

---

## 📁 File Asset Schema

**Collection**: `fileassets`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `patient` | ObjectId | Yes | Reference to Patient collection |
| `hospital` | ObjectId | Yes | Reference to Hospital collection |
| `uploadedBy` | ObjectId | No | Reference to User collection |
| `file` | String | Yes | File path/URL |
| `fileType` | String | Yes | Enum: 'photo', 'report', 'document', 'image', 'pdf', 'lab_result' |
| `originalFilename` | String | Yes | Original filename |
| `fileSize` | Number | Yes | File size in bytes |
| `mimeType` | String | Yes | MIME type |
| `sha256` | String | Yes | File hash for integrity |
| `uploadedAt` | Date | Yes | Upload timestamp |

### Indexes
- `patient`
- `hospital`
- `uploadedBy`
- `fileType`
- `uploadedAt`

---

## 📊 Audit Log Schema

**Collection**: `auditlogs`

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Yes | MongoDB document ID |
| `user` | ObjectId | No | Reference to User collection |
| `action` | String | Yes | Enum: 'create', 'update', 'delete', 'read', 'access', 'download', 'share' |
| `objectType` | String | Yes | Type of object affected |
| `objectId` | String | Yes | ID of object affected |
| `changes` | Mixed | No | Changes made |
| `ipAddress` | String | No | IP address of user |
| `metadata` | Mixed | No | Additional metadata |
| `timestamp` | Date | Yes | Action timestamp |

### Indexes
- `user`
- `action`
- `objectType`
- `objectId`
- `timestamp`

---

## 🔗 Relationships

### One-to-One Relationships
- **User ↔ Patient**: One user can have one patient profile
- **User ↔ Hospital**: One user belongs to one hospital (for doctors/admins)

### One-to-Many Relationships
- **Hospital → Users**: One hospital can have many users
- **Hospital → Patients**: One hospital can have many patients
- **Hospital → Medical Records**: One hospital can have many medical records
- **Hospital → Prescriptions**: One hospital can have many prescriptions
- **Hospital → File Assets**: One hospital can have many file assets
- **Patient → Medical Records**: One patient can have many medical records
- **Patient → Prescriptions**: One patient can have many prescriptions
- **Patient → File Assets**: One patient can have many file assets
- **User → Medical Records**: One doctor can create many medical records
- **User → Prescriptions**: One doctor can prescribe many prescriptions
- **User → Audit Logs**: One user can generate many audit logs

### Many-to-Many Relationships
- **Users ↔ Hospitals**: Users can be associated with multiple hospitals (through roles)

---

## 📝 Data Validation Rules

### User Validation
- Username: 3-30 characters, unique
- Password: Minimum 6 characters
- Email: Valid email format (if provided)
- Phone: Valid phone number format (if provided)
- National ID: Maximum 36 characters

### Patient Validation
- MRN: Unique, maximum 50 characters
- Blood Group: Must be valid enum value
- Emergency Contact Phone: Valid phone format
- Age: Calculated automatically from dateOfBirth

### Medical Record Validation
- Record Type: Must be valid enum value
- Priority: Must be valid enum value
- Status: Must be valid enum value
- Record Date: Cannot be in the future

### Prescription Validation
- Status: Must be valid enum value
- End Date: Must be after start date
- Prescribed Date: Cannot be in the future

---

## 🔒 Security Considerations

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 12
- Password field is excluded from JSON responses
- Password change requires current password verification

### Data Access Control
- Users can only access their own patient data
- Doctors can access patient data for their hospital
- Admins can access all data within their hospital
- Superadmins can access all data across all hospitals

### Audit Trail
- All data modifications are logged in audit logs
- File uploads are tracked with SHA256 hashes
- Access patterns are monitored for security

---

## 🚀 Migration Notes

### Required Fields for New Users
When creating new users, the following fields are required:
- `username` (unique)
- `password` (min 6 chars)
- `role` (enum value)

### Required Fields for New Patients
When creating new patients, the following fields are required:
- `user` (reference to existing user)
- `hospital` (reference to existing hospital)
- `mrn` (unique medical record number)

### Auto-generated Fields
- `_id`: MongoDB ObjectId
- `createdAt`: Current timestamp
- `updatedAt`: Current timestamp
- `lastUpdated`: Current timestamp (for patients)
- `mrn`: Auto-generated if not provided (for patients)
- `age`: Calculated from dateOfBirth (for patients)
