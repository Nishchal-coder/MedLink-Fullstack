import { Router } from 'express';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth';
import { auditRead, auditCreate, auditUpdate, auditDelete } from '../middleware/audit';
import { Hospital } from '../models';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all hospitals
router.get('/', auditRead, async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ createdAt: -1 });
    res.json({ hospitals });
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Get specific hospital
router.get('/:id', auditRead, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }
    res.json({ hospital });
  } catch (error) {
    console.error('Get hospital error:', error);
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
});

// Create hospital (admin/superadmin only)
router.post('/', requireAdmin, auditCreate, async (req, res) => {
  try {
    const { name, location, contactPhone } = req.body;

    const hospital = new Hospital({
      name,
      location,
      contactPhone
    });

    await hospital.save();

    res.status(201).json({
      message: 'Hospital created successfully',
      hospital
    });
  } catch (error) {
    console.error('Create hospital error:', error);
    res.status(500).json({ error: 'Failed to create hospital' });
  }
});

// Update hospital (admin/superadmin only)
router.put('/:id', requireAdmin, auditUpdate, async (req, res) => {
  try {
    const { name, location, contactPhone } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { name, location, contactPhone },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({
      message: 'Hospital updated successfully',
      hospital
    });
  } catch (error) {
    console.error('Update hospital error:', error);
    res.status(500).json({ error: 'Failed to update hospital' });
  }
});

// Delete hospital (superadmin only)
router.delete('/:id', requireSuperAdmin, auditDelete, async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({
      message: 'Hospital deleted successfully'
    });
  } catch (error) {
    console.error('Delete hospital error:', error);
    res.status(500).json({ error: 'Failed to delete hospital' });
  }
});

export default router;
