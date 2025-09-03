import { Router } from 'express';
import {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsCount,
  searchUserByNID
} from '../controllers/doctorController';
import { authenticate, requireAdmin, requireDoctor, checkMustChangePassword } from '../middleware/auth';
import { requireDoctorHospitalAccess } from '../middleware/hospitalAuth';
import { validateDoctor } from '../middleware/validation';
import { auditRead, auditCreate, auditUpdate, auditDelete } from '../middleware/audit';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(checkMustChangePassword);

// All doctor routes require hospital access
router.use(requireDoctorHospitalAccess);

// Get all doctors (admin only)
router.get('/', requireAdmin, auditRead, getDoctors);

// Get doctors count for dashboard
router.get('/count', requireAdmin, auditRead, getDoctorsCount);

// Search user by NID (doctor access)
router.get('/search/nid/:nid', requireDoctor, auditRead, searchUserByNID);

// Get specific doctor
router.get('/:id', requireAdmin, auditRead, getDoctor);

// Create doctor (admin only)
router.post('/', requireAdmin, validateDoctor, auditCreate, createDoctor);

// Update doctor
router.put('/:id', requireAdmin, validateDoctor, auditUpdate, updateDoctor);

// Delete doctor (admin only)
router.delete('/:id', requireAdmin, auditDelete, deleteDoctor);

export default router;
