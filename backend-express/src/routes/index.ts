import { Router } from 'express';
import authRoutes from './auth';
import patientRoutes from './patients';
import medicalRecordRoutes from './medicalRecords';
import dashboardRoutes from './dashboard';
import hospitalRoutes from './hospitals';
import fileRoutes from './files';
import questionnaireRoutes from './questionnaire';
import userRoutes from './users';
import doctorRoutes from './doctors';
import prescriptionRoutes from './prescriptions';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/files', fileRoutes);
router.use('/questionnaire', questionnaireRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/prescriptions', prescriptionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'MedLink API'
  });
});

export default router;
