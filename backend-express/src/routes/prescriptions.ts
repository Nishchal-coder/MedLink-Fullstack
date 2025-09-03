import { Router } from 'express';
import {
  createPrescription,
  getPatientPrescriptions,
  getUserPrescriptions,
  getDoctorPrescriptions,
  updatePrescriptionStatus,
  getPrescription
} from '../controllers/prescriptionController';
import { authenticate, requireDoctor, requireUser } from '../middleware/auth';
import { auditCreate, auditRead, auditUpdate } from '../middleware/audit';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Doctor routes
router.post('/', requireDoctor, auditCreate, createPrescription);
router.get('/doctor', requireDoctor, auditRead, getDoctorPrescriptions);
router.put('/:id/status', requireDoctor, auditUpdate, updatePrescriptionStatus);

// Patient routes
router.get('/user', requireUser, auditRead, getUserPrescriptions);
router.get('/patient/:nid', requireDoctor, auditRead, getPatientPrescriptions);

// General routes
router.get('/:id', auditRead, getPrescription);

export default router;
