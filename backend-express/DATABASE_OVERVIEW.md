# MedLink Database Overview

## 🗄️ Database Structure

### **Single Database: `medlink`**
All data is stored in one MongoDB database with role-based access control.

## 📁 Collections

### 1. **`users` Collection**
Stores ALL user types with role-based differentiation:

```javascript
{
  _id: ObjectId("..."),
  username: "nishchal",
  password: "hashed_password",
  role: "user",                    // ← KEY FIELD: user, admin, doctor, superadmin
  firstName: "Nischal",
  lastName: "Rimal",
  email: "nishchal@example.com",
  contactNumber: "9862089618",
  dateOfBirth: "1990-01-01",
  gender: "male",
  hospital: ObjectId("..."),       // ← Hospital assignment
  status: "Active",
  createdAt: "2025-09-02T...",
  updatedAt: "2025-09-02T..."
}
```

**User Types:**
- `user` - Patients (regular users)
- `admin` - Hospital administrators
- `doctor` - Medical doctors
- `superadmin` - System administrators

### 2. **`patients` Collection**
Only for users with `role: "user"`:

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."),           // ← Reference to users collection
  hospital: ObjectId("..."),       // ← Hospital assignment
  mrn: "MRN000001",               // ← Medical Record Number
  dateOfBirth: "1990-01-01",
  gender: "male",
  bloodGroup: "A+",
  hasBloodType: true,
  diseases: ["Diabetes"],
  allergies: ["Penicillin"],
  medications: ["Metformin"],
  address: "123 Main St",
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "555-0123",
  emergencyContactRelation: "Spouse",
  medicalHistory: "Previous surgeries...",
  testResults: [...],
  medicalImagesSummary: [...],
  age: 34,                        // ← Auto-calculated
  lastUpdated: "2025-09-02T...",
  updatedBy: ObjectId("..."),     // ← Who last updated
  createdAt: "2025-09-02T...",
  updatedAt: "2025-09-02T..."
}
```

### 3. **`hospitals` Collection**
Hospital information:

```javascript
{
  _id: ObjectId("..."),
  name: "MedLink General Hospital",
  location: "Main City, State",
  contactPhone: "+1-555-0123",
  createdAt: "2025-09-02T...",
  updatedAt: "2025-09-02T..."
}
```

### 4. **`medicalrecords` Collection**
Medical records for patients:

```javascript
{
  _id: ObjectId("..."),
  patient: ObjectId("..."),        // ← Reference to patients collection
  hospital: ObjectId("..."),       // ← Hospital where record was created
  doctor: ObjectId("..."),         // ← Doctor who created the record
  recordType: "consultation",      // ← Type of medical record
  title: "Annual Checkup",
  description: "Routine health check",
  diagnosis: {...},
  prescriptions: {...},
  treatments: {...},
  status: "active",
  priority: "low",
  recordDate: "2025-09-02T...",
  attachments: [...],
  createdAt: "2025-09-02T...",
  updatedAt: "2025-09-02T..."
}
```

### 5. **`prescriptions` Collection**
Medication prescriptions:

```javascript
{
  _id: ObjectId("..."),
  patient: ObjectId("..."),        // ← Reference to patients collection
  doctor: ObjectId("..."),         // ← Doctor who prescribed
  hospital: ObjectId("..."),       // ← Hospital where prescribed
  medicationName: "Metformin",
  dosage: "500mg",
  frequency: "Twice daily",
  duration: "30 days",
  instructions: "Take with food",
  status: "active",
  prescribedDate: "2025-09-02T...",
  startDate: "2025-09-02T...",
  endDate: "2025-10-02T...",
  sideEffects: "Nausea, diarrhea",
  contraindications: "Kidney disease",
  createdAt: "2025-09-02T...",
  updatedAt: "2025-09-02T..."
}
```

### 6. **`fileassets` Collection**
Uploaded files and documents:

```javascript
{
  _id: ObjectId("..."),
  patient: ObjectId("..."),        // ← Reference to patients collection
  hospital: ObjectId("..."),       // ← Hospital where uploaded
  uploadedBy: ObjectId("..."),     // ← User who uploaded
  file: "uploads/file-123.jpg",    // ← File path
  fileType: "image",               // ← Type of file
  originalFilename: "xray.jpg",
  fileSize: 1024000,
  mimeType: "image/jpeg",
  sha256: "abc123...",             // ← File hash for integrity
  uploadedAt: "2025-09-02T..."
}
```

### 7. **`auditlogs` Collection**
System audit trail:

```javascript
{
  _id: ObjectId("..."),
  user: ObjectId("..."),           // ← User who performed action
  action: "create",                // ← Action performed
  objectType: "patient",           // ← Type of object affected
  objectId: "patient_id",          // ← ID of object affected
  changes: {...},                  // ← What changed
  ipAddress: "192.168.1.1",
  metadata: {...},
  timestamp: "2025-09-02T..."
}
```

## 🔄 Registration Flow

### **Patient Registration (`/auth-user`)**
1. User registers with `role: "user"`
2. User record created in `users` collection
3. Patient profile automatically created in `patients` collection
4. User assigned to default hospital

### **Admin Registration (`/auth-admin`)**
1. User registers with `role: "admin"`
2. User record created in `users` collection
3. No patient profile created (admins don't have medical records)
4. User assigned to hospital (if specified)

### **Doctor Registration (`/auth-doctor`)**
1. User registers with `role: "doctor"`
2. User record created in `users` collection
3. No patient profile created (doctors manage other patients)
4. User assigned to hospital (if specified)

## 🔐 Access Control

### **Role-Based Permissions:**
- **`user`**: Can only access their own patient data
- **`doctor`**: Can access patient data for their hospital
- **`admin`**: Can access all data within their hospital
- **`superadmin`**: Can access all data across all hospitals

### **Data Relationships:**
```
users (1) ←→ (1) patients    // One user can have one patient profile
users (N) ←→ (1) hospitals   // Many users belong to one hospital
patients (1) ←→ (N) medicalrecords  // One patient has many medical records
patients (1) ←→ (N) prescriptions   // One patient has many prescriptions
patients (1) ←→ (N) fileassets      // One patient has many uploaded files
```

## 📊 Current Database Stats

Based on the current database:
- **Total Users**: 13
  - Superadmin: 1
  - Admin: 1
  - Doctor: 2
  - User (Patients): 9
- **Total Patients**: 5 (only users with role="user")
- **Total Hospitals**: 3
- **Collections**: 7

## 🎯 Key Points

1. **Single Database**: All data in one MongoDB database
2. **Role-Based**: User type determined by `role` field in `users` collection
3. **Patient Profiles**: Only created for users with `role: "user"`
4. **Hospital Assignment**: All users belong to a hospital
5. **Audit Trail**: All actions logged in `auditlogs` collection
6. **File Management**: Secure file uploads with integrity checks
7. **Relationships**: Proper foreign key relationships between collections

This structure allows for:
- ✅ Efficient data management
- ✅ Role-based access control
- ✅ Scalable architecture
- ✅ Audit compliance
- ✅ Data integrity
- ✅ Easy maintenance
