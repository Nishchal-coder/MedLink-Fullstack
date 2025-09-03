# Multi-Hospital Doctor Management System

This system allows different hospital administrators to manage doctors for their specific hospitals. Each hospital admin can only create, view, update, and delete doctors for their assigned hospital.

## System Overview

### Hospitals Supported
- **CMC** (City Medical Center)
- **KMC** (King Medical Center)

### User Roles
- **Superadmin**: Can access and manage all hospitals
- **Hospital Admin**: Can only access and manage their assigned hospital
- **Doctor**: Can only access their own hospital's data
- **User**: Can only access their assigned hospital's data

## Database Schema

### Doctor Model (`src/models/Doctor.ts`)

The Doctor model includes all the fields you specified:

#### Personal Information
- `username` (required, unique) - Username for login
- `firstName` (required) - First name
- `lastName` (required) - Last name
- `email` (required, unique) - Email address
- `dateOfBirth` (required) - Date of birth with age validation (22-80 years)
- `gender` (required) - Gender (male/female/other)

#### Contact Information
- `contactNumber` (required) - Phone number
- `address` (required) - Physical address

#### Medical Credentials
- `specialization` (required) - Medical specialization
- `medicalLicenseNumber` (required, unique) - Medical license number
- `yearsOfExperience` (optional) - Years of experience (0-50)
- `hospital` (required) - Hospital assignment (CMC or KMC)

#### Education
- `educationalBackground` (optional, array) - Array of educational qualifications

#### Professional Certifications
- `certifications` (optional, array) - Array of professional certifications

#### Languages Spoken
- `languages` (optional, array) - Array of languages spoken

#### Account Security
- `password` (required) - Hashed password with strong validation
- `status` - Account status (Active/Inactive)
- `mustChangePassword` - Flag for password change requirement
- `initialSetupCompleted` - Flag for initial setup completion

#### Timestamps
- `createdAt` - Document creation timestamp
- `updatedAt` - Document last update timestamp

## Access Control

### Hospital-Based Middleware (`src/middleware/hospitalAuth.ts`)

The system uses hospital-based middleware to ensure proper access control:

1. **`requireHospitalAccess`**: Ensures users can only access their hospital's data
2. **`validateHospitalAccess`**: Validates that requested hospital matches user's hospital
3. **`requireDoctorHospitalAccess`**: Ensures admin can only manage doctors for their hospital
4. **`getUserHospital`**: Helper function to get user's hospital

### How It Works

1. **CMC Admin Login**: When a CMC admin logs in, they can only:
   - View CMC doctors
   - Create new CMC doctors
   - Update CMC doctors
   - Delete CMC doctors

2. **KMC Admin Login**: When a KMC admin logs in, they can only:
   - View KMC doctors
   - Create new KMC doctors
   - Update KMC doctors
   - Delete KMC doctors

3. **Superadmin**: Can access and manage doctors from all hospitals

## API Endpoints

### Doctor Management Routes (`src/routes/doctors.ts`)

All routes require authentication and hospital access:

- `GET /api/doctors` - Get all doctors for admin's hospital
- `GET /api/doctors/count` - Get doctor count for admin's hospital
- `GET /api/doctors/:id` - Get specific doctor (must belong to admin's hospital)
- `POST /api/doctors` - Create new doctor (automatically assigned to admin's hospital)
- `PUT /api/doctors/:id` - Update doctor (must belong to admin's hospital)
- `DELETE /api/doctors/:id` - Delete doctor (must belong to admin's hospital)

## Usage Examples

### Creating Hospital Admins

```typescript
// CMC Admin
const cmcAdmin = {
  username: 'cmc_admin',
  password: 'AdminPass123!',
  firstName: 'CMC',
  lastName: 'Administrator',
  email: 'admin@cmc.com',
  role: 'admin',
  hospitalName: 'CMC', // This determines their access
  // ... other fields
};

// KMC Admin
const kmcAdmin = {
  username: 'kmc_admin',
  password: 'AdminPass123!',
  firstName: 'KMC',
  lastName: 'Administrator',
  email: 'admin@kmc.com',
  role: 'admin',
  hospitalName: 'KMC', // This determines their access
  // ... other fields
};
```

### Creating Doctors

```typescript
// CMC Doctor (created by CMC admin)
const cmcDoctor = {
  username: 'dr_sarah_johnson_cmc',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@cmc.com',
  dateOfBirth: new Date('1985-03-15'),
  gender: 'female',
  contactNumber: '+1-555-123-4567',
  address: '123 Medical Center Drive, Suite 200',
  specialization: 'Cardiology',
  medicalLicenseNumber: 'CMC-CARD-2023-001',
  yearsOfExperience: 12,
  hospital: 'CMC', // Automatically set by admin's hospital
  educationalBackground: [
    'Bachelor of Science in Biology - University of California, 2007',
    'Doctor of Medicine (MD) - Stanford University School of Medicine, 2011'
  ],
  certifications: [
    'Board Certified in Internal Medicine',
    'Board Certified in Cardiovascular Disease'
  ],
  languages: ['English', 'Spanish', 'French'],
  password: 'SecurePass123!'
};

// KMC Doctor (created by KMC admin)
const kmcDoctor = {
  username: 'dr_emily_rodriguez_kmc',
  firstName: 'Emily',
  lastName: 'Rodriguez',
  email: 'emily.rodriguez@kmc.com',
  dateOfBirth: new Date('1989-11-08'),
  gender: 'female',
  contactNumber: '+1-555-345-6789',
  address: '789 Medical Boulevard, Suite 300',
  specialization: 'Pediatrics',
  medicalLicenseNumber: 'KMC-PED-2023-001',
  yearsOfExperience: 8,
  hospital: 'KMC', // Automatically set by admin's hospital
  educationalBackground: [
    'Bachelor of Science in Biology - University of Texas, 2011',
    'Doctor of Medicine (MD) - Baylor College of Medicine, 2015'
  ],
  certifications: [
    'Board Certified in Pediatrics',
    'Board Certified in Pediatric Emergency Medicine'
  ],
  languages: ['English', 'Spanish'],
  password: 'SecurePass123!'
};
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- Must contain uppercase letter, lowercase letter, number, and special character
- Automatically hashed using bcrypt

### Username Requirements
- 3-30 characters
- Only letters, numbers, and underscores allowed
- Must be unique

### Email Requirements
- Valid email format
- Must be unique
- Automatically converted to lowercase

### Medical License Number
- Must be unique
- Only uppercase letters, numbers, and hyphens allowed
- Maximum 100 characters

### Age Validation
- Doctors must be between 22 and 80 years old

### Hospital Validation
- Must be either 'CMC' or 'KMC'

## Running Examples

### Single Hospital Example
```bash
# Run the basic doctor creation example
npx ts-node src/scripts/createDoctorExample.ts
```

### Multi-Hospital Example
```bash
# Run the multi-hospital example
npx ts-node src/scripts/createMultiHospitalDoctors.ts
```

This will:
1. Create hospital admin users (CMC and KMC)
2. Create sample doctors for both hospitals
3. Demonstrate hospital-based access control
4. Show how data is filtered by hospital

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **Hospital Isolation**: Admins can only access their assigned hospital's data
3. **Input Validation**: Comprehensive validation for all fields
4. **Unique Constraints**: Username, email, and medical license number must be unique
5. **Access Control**: Middleware ensures proper hospital-based access
6. **Audit Logging**: All operations are logged for security tracking

## Database Indexes

The system includes optimized indexes for better performance:

- `username` - For login lookups
- `email` - For email-based operations
- `medicalLicenseNumber` - For license validation
- `hospital` - For hospital-based filtering
- `specialization` - For specialization-based queries
- `status` - For status-based filtering
- `createdAt` - For chronological ordering
- Compound indexes for common query patterns

## Error Handling

The system includes comprehensive error handling:

- Validation errors with specific messages
- Hospital access denied errors
- Duplicate entry errors
- Authentication errors
- Authorization errors

## Testing the System

1. **Create Hospital Admins**: Use the example script to create CMC and KMC admins
2. **Login as CMC Admin**: Only CMC doctors will be visible and manageable
3. **Login as KMC Admin**: Only KMC doctors will be visible and manageable
4. **Login as Superadmin**: All doctors from both hospitals will be visible and manageable

## Frontend Integration

The frontend should:
1. Use the admin's hospital information to filter data
2. Display only relevant hospital data
3. Ensure hospital selection is not editable by hospital admins
4. Show appropriate error messages for access denied scenarios

This system provides a secure, scalable solution for multi-hospital doctor management with proper access control and data isolation.
