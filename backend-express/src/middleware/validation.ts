import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and spaces')
    .custom((value) => {
      // Remove spaces and check if it's still valid
      const cleanUsername = value.replace(/\s+/g, '');
      if (cleanUsername.length < 3) {
        throw new Error('Username must have at least 3 non-space characters');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'doctor', 'user'])
    .withMessage('Invalid role'),
  body('hospital')
    .optional()
    .isMongoId()
    .withMessage('Invalid hospital ID'),
  // Admin-specific fields
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('contactNumber')
    .optional()
    .matches(/^[0-9+\-()\s]+$/)
    .withMessage('Invalid phone number format'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  // Hospital information for admins
  body('hospitalName')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Hospital name must be less than 200 characters'),
  body('hospitalAddress')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Hospital address must be less than 500 characters'),
  body('hospitalContact')
    .optional()
    .matches(/^[0-9+\-()\s]+$/)
    .withMessage('Invalid hospital contact format'),
  body('adminPosition')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Admin position must be less than 100 characters'),
  body('department')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('employeeId')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Employee ID must be less than 50 characters'),
  body('emergencyContact')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Emergency contact must be less than 100 characters'),
  body('emergencyPhone')
    .optional()
    .matches(/^[0-9+\-()\s]+$/)
    .withMessage('Invalid emergency phone format'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateUser = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and spaces')
    .custom((value) => {
      // Remove spaces and check if it's still valid
      const cleanUsername = value.replace(/\s+/g, '');
      if (cleanUsername.length < 3) {
        throw new Error('Username must have at least 3 non-space characters');
      }
      return true;
    }),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['superadmin', 'admin', 'doctor', 'user', 'emergency_access'])
    .withMessage('Invalid role'),
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('contactNumber')
    .optional()
    .matches(/^[0-9+\-()\s]+$/)
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  body('specialization')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Specialization must be less than 255 characters'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Invalid status'),
  handleValidationErrors
];

export const validatePatient = [
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),
  body('contactNumber')
    .optional()
    .matches(/^[0-9+\-()\s]+$/)
    .withMessage('Invalid phone number format'),
  body('diseases')
    .optional()
    .isArray()
    .withMessage('Diseases must be an array'),
  body('medications')
    .optional()
    .isArray()
    .withMessage('Medications must be an array'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('diseases.*')
    .optional()
    .isString()
    .withMessage('Each disease must be a string'),
  body('medications.*')
    .optional()
    .isString()
    .withMessage('Each medication must be a string'),
  body('allergies.*')
    .optional()
    .isString()
    .withMessage('Each allergy must be a string'),
  handleValidationErrors
];

export const validateMedicalRecord = [
  body('recordType')
    .isIn(['blood_test', 'x_ray', 'mri', 'ct_scan', 'ultrasound', 'ecg', 'biopsy', 'surgery', 'consultation', 'vaccination', 'other'])
    .withMessage('Invalid record type'),
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  body('status')
    .optional()
    .isIn(['active', 'pending', 'completed', 'archived'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  handleValidationErrors
];

export const validatePrescription = [
  body('medicationName')
    .notEmpty()
    .withMessage('Medication name is required'),
  body('dosage')
    .notEmpty()
    .withMessage('Dosage is required'),
  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required'),
  body('instructions')
    .notEmpty()
    .withMessage('Instructions are required'),
  body('prescribedDate')
    .isISO8601()
    .withMessage('Invalid prescribed date format'),
  body('startDate')
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('endDate')
    .isISO8601()
    .withMessage('Invalid end date format'),
  handleValidationErrors
];

export const validateDoctor = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_\s]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and spaces'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  body('contactNumber')
    .optional()
    .matches(/^[0-9+\-()\s]+$/)
    .withMessage('Invalid phone number format'),
  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Address must be less than 500 characters'),
  body('specialization')
    .isLength({ min: 1, max: 255 })
    .withMessage('Specialization must be between 1 and 255 characters'),
  body('medicalLicense')
    .isLength({ min: 1, max: 100 })
    .withMessage('Medical license must be between 1 and 100 characters'),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
  body('education')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Education must be less than 1000 characters'),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array'),
  body('languages')
    .optional()
    .isArray()
    .withMessage('Languages must be an array'),
  handleValidationErrors
];
