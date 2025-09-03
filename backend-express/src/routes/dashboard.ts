import { Router } from 'express';
import { getUserDashboard, downloadAllData } from '../controllers/dashboardController';
import { authenticate, requireUser, checkMustChangePassword } from '../middleware/auth';
import { auditRead, auditDownload } from '../middleware/audit';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(checkMustChangePassword);

// Get user dashboard data
router.get('/user-dashboard', requireUser, auditRead, getUserDashboard);

// Download all user data
router.get('/download-all-data', requireUser, auditDownload, downloadAllData);

export default router;
