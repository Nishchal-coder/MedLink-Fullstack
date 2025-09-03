import { Request, Response } from 'express';
import { MedicalRecord, Patient, User, Hospital, AuditLog } from '../models';
import { IAuthRequest } from '../types';

export const getMedicalRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { page = 1, limit = 20, status, priority, recordType } = req.query;
    let query: any = {};

    // Build query based on user role
    if (user.role === 'superadmin') {
      // Superadmin can see all records
    } else if (user.role === 'admin' || user.role === 'doctor') {
      query.hospital = user.hospital;
    } else if (user.role === 'user') {
      // Get patient for this user
      const patient = await Patient.findOne({ user: user._id });
      if (!patient) {
        return res.json({ medicalRecords: [], total: 0, page: 1, totalPages: 0 });
      }
      query.patient = patient._id;
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (recordType) query.recordType = recordType;

    const skip = (Number(page) - 1) * Number(limit);
    
    const [medicalRecords, total] = await Promise.all([
      MedicalRecord.find(query)
        .populate('patient', 'mrn user')
        .populate('patient.user', 'username firstName lastName')
        .populate('hospital', 'name location')
        .populate('doctor', 'username firstName lastName specialization')
        .populate('attachments')
        .sort({ recordDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      MedicalRecord.countDocuments(query)
    ]);

    res.json({
      medicalRecords,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ error: 'Failed to fetch medical records' });
  }
};

export const getMedicalRecord = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const medicalRecord = await MedicalRecord.findById(id)
      .populate('patient', 'mrn user')
      .populate('patient.user', 'username firstName lastName')
      .populate('hospital', 'name location')
      .populate('doctor', 'username firstName lastName specialization')
      .populate('attachments');

    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Check permissions
    if (user.role === 'user') {
      const patient = await Patient.findOne({ user: user._id });
      if (!patient || (medicalRecord.patient as any)._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (user.role === 'admin' || user.role === 'doctor') {
      if ((medicalRecord.hospital as any)._id.toString() !== user.hospital?.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ medicalRecord });
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({ error: 'Failed to fetch medical record' });
  }
};

export const createMedicalRecord = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const recordData = req.body;

    // Validate patient exists and user has access
    const patient = await Patient.findById(recordData.patient);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check permissions
    if (user.role === 'user') {
      return res.status(403).json({ error: 'Users cannot create medical records' });
    }

    if (user.role === 'admin' || user.role === 'doctor') {
      if (patient.hospital.toString() !== user.hospital?.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Set hospital and doctor
    recordData.hospital = patient.hospital;
    recordData.doctor = user._id;

    const medicalRecord = new MedicalRecord(recordData);
    await medicalRecord.save();

    await medicalRecord.populate([
      { path: 'patient', select: 'mrn user' },
      { path: 'patient.user', select: 'username firstName lastName' },
      { path: 'hospital', select: 'name location' },
      { path: 'doctor', select: 'username firstName lastName specialization' },
      { path: 'attachments' }
    ]);

    res.status(201).json({
      message: 'Medical record created successfully',
      medicalRecord
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ error: 'Failed to create medical record' });
  }
};

export const updateMedicalRecord = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const updateData = req.body;

    const medicalRecord = await MedicalRecord.findById(id);
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Check permissions
    if (user.role === 'user') {
      return res.status(403).json({ error: 'Users cannot update medical records' });
    }

    if (user.role === 'admin' || user.role === 'doctor') {
      if (medicalRecord.hospital.toString() !== user.hospital?.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'mrn user' },
      { path: 'patient.user', select: 'username firstName lastName' },
      { path: 'hospital', select: 'name location' },
      { path: 'doctor', select: 'username firstName lastName specialization' },
      { path: 'attachments' }
    ]);

    res.json({
      message: 'Medical record updated successfully',
      medicalRecord: updatedRecord
    });
  } catch (error) {
    console.error('Update medical record error:', error);
    res.status(500).json({ error: 'Failed to update medical record' });
  }
};

export const deleteMedicalRecord = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const medicalRecord = await MedicalRecord.findById(id);
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Check permissions - only superadmin can delete records
    if (user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can delete medical records' });
    }

    await MedicalRecord.findByIdAndDelete(id);

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Delete medical record error:', error);
    res.status(500).json({ error: 'Failed to delete medical record' });
  }
};

export const downloadMedicalRecord = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const medicalRecord = await MedicalRecord.findById(id)
      .populate('patient', 'mrn user')
      .populate('patient.user', 'username firstName lastName')
      .populate('hospital', 'name location')
      .populate('doctor', 'username firstName lastName specialization')
      .populate('attachments');

    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Check permissions
    if (user.role === 'user') {
      const patient = await Patient.findOne({ user: user._id });
      if (!patient || (medicalRecord.patient as any)._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (user.role === 'admin' || user.role === 'doctor') {
      if ((medicalRecord.hospital as any)._id.toString() !== user.hospital?.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Log the download action
    await AuditLog.create({
      user: user._id,
      action: 'download',
      objectType: 'medical_record',
      objectId: id,
      ipAddress: req.ip || req.connection.remoteAddress,
      metadata: {
        recordType: medicalRecord.recordType,
        patientId: (medicalRecord.patient as any)._id
      }
    });

    res.json({
      message: 'Medical record data for download',
      medicalRecord
    });
  } catch (error) {
    console.error('Download medical record error:', error);
    res.status(500).json({ error: 'Failed to download medical record' });
  }
};

export const shareMedicalRecord = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const medicalRecord = await MedicalRecord.findById(id);
    if (!medicalRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Check permissions
    if (user.role === 'user') {
      const patient = await Patient.findOne({ user: user._id });
      if (!patient || medicalRecord.patient.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (user.role === 'admin' || user.role === 'doctor') {
      if (medicalRecord.hospital.toString() !== user.hospital?.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Log the share action
    await AuditLog.create({
      user: user._id,
      action: 'share',
      objectType: 'medical_record',
      objectId: id,
      ipAddress: req.ip || req.connection.remoteAddress,
      metadata: {
        recordType: medicalRecord.recordType,
        patientId: medicalRecord.patient
      }
    });

    res.json({ message: 'Record sharing logged' });
  } catch (error) {
    console.error('Share medical record error:', error);
    res.status(500).json({ error: 'Failed to share medical record' });
  }
};
