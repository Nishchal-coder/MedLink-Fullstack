import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateQuestionnaireData = [
  // Only allow health-related fields
  body('nid')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('NID is required and must be between 1-20 characters'),
  
  body('bloodType')
    .optional()
    .isString()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not specified'])
    .withMessage('Invalid blood type'),
  
  body('height')
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage('Height must be less than 10 characters'),
  
  body('weight')
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage('Weight must be less than 10 characters'),
  
  body('emergencyContact')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Emergency contact name is required and must be between 1-100 characters'),
  
  body('emergencyPhone')
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('Emergency phone is required and must be between 1-20 characters'),
  
  body('relationship')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Relationship is required and must be between 1-50 characters'),
  
  body('allergies')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Allergies must be less than 1000 characters'),
  
  body('currentMedications')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Current medications must be less than 1000 characters'),
  
  body('chronicConditions')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Chronic conditions must be less than 1000 characters'),
  
  body('previousSurgeries')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Previous surgeries must be less than 1000 characters'),
  
  body('smoking')
    .isString()
    .isIn(['never', 'former', 'current'])
    .withMessage('Smoking status must be never, former, or current'),
  
  body('alcohol')
    .isString()
    .isIn(['never', 'occasional', 'moderate', 'heavy'])
    .withMessage('Alcohol consumption must be never, occasional, moderate, or heavy'),
  
  body('exercise')
    .isString()
    .isIn(['sedentary', 'light', 'moderate', 'active', 'very-active'])
    .withMessage('Exercise level must be sedentary, light, moderate, active, or very-active'),
  
  body('diet')
    .isString()
    .isIn(['balanced', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'other'])
    .withMessage('Diet type must be balanced, vegetarian, vegan, keto, paleo, mediterranean, or other'),
  
  // Reject any personal information fields
  (req: Request, res: Response, next: NextFunction) => {
    const forbiddenFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'email'];
    const hasForbiddenFields = forbiddenFields.some(field => req.body[field] !== undefined);
    
    if (hasForbiddenFields) {
      return res.status(400).json({
        error: 'Personal information fields (firstName, lastName, dateOfBirth, gender, phone, email) are not allowed in questionnaires. These should be stored in the user profile.',
        forbiddenFields: forbiddenFields.filter(field => req.body[field] !== undefined)
      });
    }
    
    next();
  },
  
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

export const validateQuestionnaireUpdate = [
  // Same validation as create, but make some fields optional for updates
  body('nid')
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('NID must be between 1-20 characters'),
  
  body('bloodType')
    .optional()
    .isString()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Not specified'])
    .withMessage('Invalid blood type'),
  
  body('height')
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage('Height must be less than 10 characters'),
  
  body('weight')
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage('Weight must be less than 10 characters'),
  
  body('emergencyContact')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Emergency contact name must be between 1-100 characters'),
  
  body('emergencyPhone')
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage('Emergency phone must be between 1-20 characters'),
  
  body('relationship')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Relationship must be between 1-50 characters'),
  
  body('allergies')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Allergies must be less than 1000 characters'),
  
  body('currentMedications')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Current medications must be less than 1000 characters'),
  
  body('chronicConditions')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Chronic conditions must be less than 1000 characters'),
  
  body('previousSurgeries')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Previous surgeries must be less than 1000 characters'),
  
  body('smoking')
    .optional()
    .isString()
    .isIn(['never', 'former', 'current'])
    .withMessage('Smoking status must be never, former, or current'),
  
  body('alcohol')
    .optional()
    .isString()
    .isIn(['never', 'occasional', 'moderate', 'heavy'])
    .withMessage('Alcohol consumption must be never, occasional, moderate, or heavy'),
  
  body('exercise')
    .optional()
    .isString()
    .isIn(['sedentary', 'light', 'moderate', 'active', 'very-active'])
    .withMessage('Exercise level must be sedentary, light, moderate, active, or very-active'),
  
  body('diet')
    .optional()
    .isString()
    .isIn(['balanced', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'other'])
    .withMessage('Diet type must be balanced, vegetarian, vegan, keto, paleo, mediterranean, or other'),
  
  // Reject any personal information fields
  (req: Request, res: Response, next: NextFunction) => {
    const forbiddenFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'email'];
    const hasForbiddenFields = forbiddenFields.some(field => req.body[field] !== undefined);
    
    if (hasForbiddenFields) {
      return res.status(400).json({
        error: 'Personal information fields (firstName, lastName, dateOfBirth, gender, phone, email) are not allowed in questionnaires. These should be stored in the user profile.',
        forbiddenFields: forbiddenFields.filter(field => req.body[field] !== undefined)
      });
    }
    
    next();
  },
  
  // Check for validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];
