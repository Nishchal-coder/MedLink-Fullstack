import { Router } from 'express';
import {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  downloadMedicalRecord,
  shareMedicalRecord
} from '../controllers/medicalRecordController';
import { authenticate, requireUser, requireAdmin, requireSuperAdmin, checkMustChangePassword } from '../middleware/auth';
import { validateMedicalRecord } from '../middleware/validation';
import { auditRead, auditCreate, auditUpdate, auditDelete, auditDownload, auditShare } from '../middleware/audit';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(checkMustChangePassword);

// Get all medical records
router.get('/', requireUser, auditRead, getMedicalRecords);

// Get specific medical record
router.get('/:id', requireUser, auditRead, getMedicalRecord);

// Create medical record (admin, doctor, superadmin only)
router.post('/', requireAdmin, validateMedicalRecord, auditCreate, createMedicalRecord);

// Update medical record (admin, doctor, superadmin only)
router.put('/:id', requireAdmin, auditUpdate, updateMedicalRecord);

// Delete medical record (superadmin only)
router.delete('/:id', requireSuperAdmin, auditDelete, deleteMedicalRecord);

// Download medical record
router.post('/:id/download', requireUser, auditDownload, downloadMedicalRecord);

// Share medical record
router.post('/:id/share', requireUser, auditShare, shareMedicalRecord);

export default router;
