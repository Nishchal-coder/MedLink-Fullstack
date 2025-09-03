import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  completeInitialSetup
} from '../controllers/authController';
import { authenticate, checkMustChangePassword } from '../middleware/auth';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(authenticate);
router.post('/logout', logout);
router.get('/profile', checkMustChangePassword, getProfile);
router.put('/update-profile', checkMustChangePassword, updateProfile);
router.post('/change-password', checkMustChangePassword, changePassword);
router.post('/complete-initial-setup', completeInitialSetup);

export default router;
