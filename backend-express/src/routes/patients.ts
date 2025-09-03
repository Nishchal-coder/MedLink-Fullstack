import { Router } from 'express';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientData,
  updatePatientData,
  emergencySearch
} from '../controllers/patientController';
import { authenticate, requireUser, requireAdmin, requireDoctor, requireSuperAdmin, checkMustChangePassword } from '../middleware/auth';
import { validatePatient } from '../middleware/validation';
import { auditRead, auditCreate, auditUpdate, auditDelete } from '../middleware/audit';

const router = Router();

// Emergency search route - NO authentication required
router.get('/emergency/search', emergencySearch);

// All other routes require authentication
router.use(authenticate);
router.use(checkMustChangePassword);

// Get all patients (admin, doctor, superadmin)
router.get('/', requireDoctor, auditRead, getPatients);

// Get current user's patient data (user role only)
router.get('/me', requireUser, auditRead, getPatientData);

// Update current user's patient data (user role only)
router.patch('/me', requireUser, validatePatient, auditUpdate, updatePatientData);

// Get specific patient
router.get('/:id', requireUser, auditRead, getPatient);

// Create patient (admin can create for anyone, user can create for themselves)
router.post('/', authenticate, validatePatient, auditCreate, createPatient);

// Update patient
router.put('/:id', requireUser, validatePatient, auditUpdate, updatePatient);

// Delete patient (superadmin only)
router.delete('/:id', requireSuperAdmin, auditDelete, deletePatient);

export default router;
