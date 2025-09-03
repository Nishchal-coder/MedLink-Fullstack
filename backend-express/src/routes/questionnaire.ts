import { Router } from 'express';
import {
  createQuestionnaire,
  getQuestionnaire,
  getMyQuestionnaire,
  updateQuestionnaire,
  getAllQuestionnaires
} from '../controllers/questionnaireController';
import { authenticate } from '../middleware/auth';
import { requireUser, requireAdmin } from '../middleware/roleAuth';
import { validateQuestionnaireData, validateQuestionnaireUpdate } from '../middleware/questionnaireValidation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create questionnaire (user only)
router.post('/', requireUser, validateQuestionnaireData, createQuestionnaire);

// Get current user's questionnaire (user only)
router.get('/me', requireUser, getMyQuestionnaire);

// Get all questionnaires (admin, doctor, superadmin)
router.get('/', requireAdmin, getAllQuestionnaires);

// Get specific questionnaire by ID
router.get('/:id', getQuestionnaire);

// Update questionnaire
router.put('/:id', requireUser, validateQuestionnaireUpdate, updateQuestionnaire);

export default router;
