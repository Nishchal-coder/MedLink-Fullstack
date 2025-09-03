# Questionnaire System Refactoring

## Overview

This document describes the refactoring of the questionnaire system to properly separate user data from health-related questionnaire data.

## Changes Made

### 1. User Schema Updates (`src/models/User.ts`)

**Fields now required for signup:**
- `firstName` (required)
- `lastName` (required) 
- `dateOfBirth` (required)
- `gender` (required)
- `email` (required, unique)
- `username` (required, unique)
- `password` (required)
- `contactNumber` (optional)

**Purpose:** Store all personal identification information in the user profile.

### 2. Questionnaire Schema Updates (`src/models/Questionnaire.ts`)

**Removed fields (now stored in User):**
- `firstName`
- `lastName` 
- `dateOfBirth`
- `gender`
- `phone`
- `email`

**Retained fields (health-related only):**
- `nid` (National ID)
- `bloodType`
- `height`
- `weight`
- `emergencyContact`
- `emergencyPhone`
- `relationship`
- `allergies`
- `currentMedications`
- `chronicConditions`
- `previousSurgeries`
- `smoking`
- `alcohol`
- `exercise`
- `diet`

**Purpose:** Store only health-related information that may change over time.

### 3. API Changes

#### Create Questionnaire (`POST /api/questionnaire`)
- **Before:** Required all personal info + health info
- **After:** Only accepts health-related fields
- **User ID:** Automatically attached from authenticated user
- **Validation:** Rejects personal information fields

#### Get My Questionnaire (`GET /api/questionnaire/me`)
- **Before:** Returned questionnaire data only
- **After:** Returns combined data:
  ```json
  {
    "user": {
      "firstName": "John",
      "lastName": "Doe", 
      "email": "john@example.com",
      "contactNumber": "1234567890",
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "username": "johndoe"
    },
    "questionnaire": {
      "nid": "123456789",
      "bloodType": "A+",
      "height": "175cm",
      "weight": "70kg",
      "emergencyContact": "Jane Doe",
      "emergencyPhone": "0987654321",
      "relationship": "spouse",
      "allergies": "Peanuts",
      "currentMedications": "Aspirin",
      "chronicConditions": "Diabetes",
      "previousSurgeries": "Appendectomy",
      "smoking": "never",
      "alcohol": "occasional",
      "exercise": "moderate",
      "diet": "balanced",
      "completedAt": "2025-09-02T16:00:00.000Z",
      "version": 1
    }
  }
  ```

### 4. Validation Middleware (`src/middleware/questionnaireValidation.ts`)

**Features:**
- Validates only health-related fields
- Rejects personal information fields with clear error messages
- Ensures data integrity and proper field types
- Separate validation for create vs update operations

**Forbidden Fields:**
- `firstName`, `lastName`, `dateOfBirth`, `gender`, `phone`, `email`

### 5. Migration Script (`src/scripts/migrateQuestionnaires.ts`)

**Purpose:** Backfill `user_id` in existing questionnaires by matching email addresses.

**Usage:**
```bash
npm run db:migrate-questionnaires
```

**Process:**
1. Find questionnaires without valid user references
2. Match by email address between questionnaires and users
3. Update questionnaire with correct user ID
4. Provide detailed migration report

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  password: String (required, hashed),
  firstName: String (required),
  lastName: String (required),
  dateOfBirth: Date (required),
  gender: String (required, enum: ['male', 'female', 'other']),
  email: String (required, unique),
  contactNumber: String (optional),
  role: String (default: 'user'),
  // ... other fields
}
```

### Questionnaires Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  patient: ObjectId (ref: 'Patient', required),
  nid: String (required),
  bloodType: String,
  height: String,
  weight: String,
  emergencyContact: String (required),
  emergencyPhone: String (required),
  relationship: String (required),
  allergies: String,
  currentMedications: String,
  chronicConditions: String,
  previousSurgeries: String,
  smoking: String (required, enum: ['never', 'former', 'current']),
  alcohol: String (required, enum: ['never', 'occasional', 'moderate', 'heavy']),
  exercise: String (required, enum: ['sedentary', 'light', 'moderate', 'active', 'very-active']),
  diet: String (required, enum: ['balanced', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'other']),
  completedAt: Date,
  version: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Benefits

1. **Data Integrity:** Personal info stored once in user profile
2. **Data Consistency:** No duplicate personal information
3. **Security:** Clear separation of concerns
4. **Maintainability:** Easier to update user info vs health info
5. **Scalability:** Health data can be versioned independently
6. **Compliance:** Better data governance and privacy controls

## Migration Steps

1. **Run the migration script:**
   ```bash
   npm run db:migrate-questionnaires
   ```

2. **Update frontend forms** to:
   - Remove personal info fields from questionnaire
   - Display user info as read-only
   - Only allow editing of health-related fields

3. **Test the new API endpoints** to ensure they work correctly

## API Examples

### Create Questionnaire (New Format)
```bash
POST /api/questionnaire
Authorization: Bearer <token>
Content-Type: application/json

{
  "nid": "123456789",
  "bloodType": "A+",
  "height": "175cm",
  "weight": "70kg",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "0987654321",
  "relationship": "spouse",
  "allergies": "Peanuts",
  "currentMedications": "Aspirin",
  "chronicConditions": "Diabetes",
  "previousSurgeries": "Appendectomy",
  "smoking": "never",
  "alcohol": "occasional",
  "exercise": "moderate",
  "diet": "balanced"
}
```

### Get My Questionnaire Response
```bash
GET /api/questionnaire/me
Authorization: Bearer <token>

Response:
{
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "contactNumber": "1234567890",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "username": "johndoe"
  },
  "questionnaire": {
    "nid": "123456789",
    "bloodType": "A+",
    "height": "175cm",
    "weight": "70kg",
    "emergencyContact": "Jane Doe",
    "emergencyPhone": "0987654321",
    "relationship": "spouse",
    "allergies": "Peanuts",
    "currentMedications": "Aspirin",
    "chronicConditions": "Diabetes",
    "previousSurgeries": "Appendectomy",
    "smoking": "never",
    "alcohol": "occasional",
    "exercise": "moderate",
    "diet": "balanced",
    "completedAt": "2025-09-02T16:00:00.000Z",
    "version": 1
  }
}
```

## Error Handling

### Validation Errors
```json
{
  "error": "Personal information fields (firstName, lastName, dateOfBirth, gender, phone, email) are not allowed in questionnaires. These should be stored in the user profile.",
  "forbiddenFields": ["firstName", "email"]
}
```

### Missing User Error
```json
{
  "error": "No questionnaire found. Please complete the initial questionnaire."
}
```

## Next Steps

1. Update frontend components to work with new API structure
2. Test migration with existing data
3. Update documentation and API docs
4. Consider adding data validation on the frontend
5. Implement proper error handling for missing user data
