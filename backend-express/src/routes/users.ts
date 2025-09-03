import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
} from '../controllers/userController';
import { authenticate, requireAdmin, requireSuperAdmin, checkMustChangePassword } from '../middleware/auth';
import { validateUser } from '../middleware/validation';
import { auditRead, auditCreate, auditUpdate, auditDelete } from '../middleware/audit';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(checkMustChangePassword);

// Get all users (admin, superadmin only)
router.get('/', requireAdmin, auditRead, getUsers);

// Get users by role (admin, superadmin only)
router.get('/by-role/:role', requireAdmin, auditRead, getUsersByRole);

// Get specific user
router.get('/:id', requireAdmin, auditRead, getUser);

// Create user (admin, superadmin only)
router.post('/', requireAdmin, validateUser, auditCreate, createUser);

// Update user
router.put('/:id', requireAdmin, validateUser, auditUpdate, updateUser);

// Delete user (superadmin only)
router.delete('/:id', requireSuperAdmin, auditDelete, deleteUser);

export default router;
