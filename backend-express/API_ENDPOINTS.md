# MedLink Healthcare API Endpoints

**Base URL**: `http://localhost:5001/api`

## 🔐 Authentication Endpoints (`/auth`)

### Public Routes (No Authentication Required)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/auth/register` | Register new user | `{username, password, firstName, lastName, role, contactNumber, dateOfBirth, gender}` |
| `POST` | `/auth/login` | User login | `{username, password}` |
| `POST` | `/auth/refresh-token` | Refresh access token | `{refreshToken}` |

### Protected Routes (Authentication Required)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/auth/logout` | User logout | `{}` |
| `GET` | `/auth/profile` | Get user profile | `{}` |
| `PUT` | `/auth/update-profile` | Update user profile | `{firstName, lastName, contactNumber, etc.}` |
| `POST` | `/auth/change-password` | Change password | `{currentPassword, newPassword}` |

## 👥 Patient Endpoints (`/patients`)

### All routes require authentication

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `GET` | `/patients/` | Get all patients | Admin/Doctor/SuperAdmin | `{}` |
| `GET` | `/patients/me` | Get current user's patient data | User only | `{}` |
| `GET` | `/patients/:id` | Get specific patient | User/Admin/Doctor | `{}` |
| `POST` | `/patients/` | Create new patient | Admin only | `{mrn, dateOfBirth, gender, bloodGroup, diseases, allergies, medications, address, emergencyContactName, emergencyContactPhone}` |
| `PUT` | `/patients/:id` | Update patient | User/Admin/Doctor | `{mrn, dateOfBirth, gender, bloodGroup, diseases, allergies, medications, address, emergencyContactName, emergencyContactPhone}` |
| `DELETE` | `/patients/:id` | Delete patient | SuperAdmin only | `{}` |

## 📋 Medical Records Endpoints (`/medical-records`)

### All routes require authentication

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `GET` | `/medical-records/` | Get all medical records | User/Admin/Doctor | `{}` |
| `GET` | `/medical-records/:id` | Get specific medical record | User/Admin/Doctor | `{}` |
| `POST` | `/medical-records/` | Create medical record | Admin/Doctor/SuperAdmin | `{patientId, recordType, description, date, attachments}` |
| `PUT` | `/medical-records/:id` | Update medical record | Admin/Doctor/SuperAdmin | `{recordType, description, date, attachments}` |
| `DELETE` | `/medical-records/:id` | Delete medical record | SuperAdmin only | `{}` |
| `POST` | `/medical-records/:id/download` | Download medical record | User/Admin/Doctor | `{}` |
| `POST` | `/medical-records/:id/share` | Share medical record | User/Admin/Doctor | `{recipientEmail, permissions}` |

## 📊 Dashboard Endpoints (`/dashboard`)

### All routes require authentication

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `GET` | `/dashboard/user-dashboard` | Get user dashboard data | User only | `{}` |
| `GET` | `/dashboard/download-all-data` | Download all user data | User only | `{}` |

## 📁 File Upload Endpoints (`/files`)

### All routes require authentication

| Method | Endpoint | Description | Access Level | Request Body |
|--------|----------|-------------|--------------|--------------|
| `POST` | `/files/upload` | Upload medical report/image | User only | `FormData with 'file' field` |
| `GET` | `/files/my-files` | Get user's uploaded files | User only | `{}` |
| `GET` | `/files/download/:id` | Download file | User only | `{}` |
| `DELETE` | `/files/:id` | Delete file | User only | `{}` |

## 🏥 System Endpoints

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Health check | Public |
| `GET` | `/` | API info | Public |

## 🔧 Example Usage

### Register a New User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "contactNumber": "+1-555-0123",
    "dateOfBirth": "1990-01-01",
    "gender": "male"
  }'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "user123"
  }'
```

### Get Patient Data (with authentication)
```bash
curl -X GET http://localhost:5001/api/patients/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Patient Profile
```bash
curl -X POST http://localhost:5001/api/patients/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mrn": "MRN000002",
    "dateOfBirth": "1985-05-15",
    "gender": "female",
    "bloodGroup": "A+",
    "hasBloodType": true,
    "diseases": ["Diabetes"],
    "allergies": ["Sulfa drugs"],
    "medications": ["Metformin 500mg"],
    "address": "456 Oak St, City, State 54321",
    "emergencyContactName": "Jane Smith",
    "emergencyContactPhone": "+1-555-0124"
  }'
```

## 🔑 Authentication

Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Response Format

All endpoints return JSON responses:

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-09-01T21:32:50.001Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2025-09-01T21:32:50.001Z"
}
```

## 🎯 Frontend Usage

The frontend uses these endpoints through the AuthContext and other API calls:

```javascript
// Registration
const success = await register({
  username: formData.username,
  password: formData.password,
  firstName: formData.firstName,
  lastName: formData.lastName,
  role: formData.role,
  contactNumber: formData.contactNumber,
  dateOfBirth: formData.dateOfBirth,
  gender: formData.gender
});

// Login
const success = await login({
  username: formData.username,
  password: formData.password
});
```
