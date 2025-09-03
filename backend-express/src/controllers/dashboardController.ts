import { Response } from 'express';
import { MedicalRecord, Prescription, Patient, AuditLog } from '../models';
import { IAuthRequest, IDashboardData } from '../types';

export const getUserDashboard = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let records: any[] = [], prescriptions: any[] = [];

    if (user.role === 'user') {
      // Get patient data for regular users
      const patient = await Patient.findOne({ user: user._id });
      if (patient) {
        records = await MedicalRecord.find({ patient: patient._id });
        prescriptions = await Prescription.find({ patient: patient._id });
      } else {
        records = [];
        prescriptions = [];
      }
    } else {
      // For other roles, get hospital data
      if (user.hospital) {
        records = await MedicalRecord.find({ hospital: user.hospital });
        prescriptions = await Prescription.find({ hospital: user.hospital });
      } else {
        records = [];
        prescriptions = [];
      }
    }

    const dashboardData: IDashboardData = {
      totalRecords: records.length,
      activeRecords: records.filter(r => r.status === 'active').length,
      pendingRecords: records.filter(r => r.status === 'pending').length,
      totalPrescriptions: prescriptions.length,
      activePrescriptions: prescriptions.filter(p => p.status === 'active').length,
      recentRecords: records
        .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())
        .slice(0, 5),
      recentPrescriptions: prescriptions
        .sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime())
        .slice(0, 5)
    };

    res.json({ dashboardData });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const downloadAllData = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;

    // Log the download action
    await AuditLog.create({
      user: user._id,
      action: 'download',
      objectType: 'user_data',
      objectId: user._id!,
      ipAddress: req.ip || req.connection.remoteAddress,
      metadata: { dataType: 'complete_user_data' }
    });

    // Get user data
    let patient, records: any[] = [], prescriptions: any[] = [];

    if (user.role === 'user') {
      patient = await Patient.findOne({ user: user._id })
        .populate('user', 'username firstName lastName contactNumber')
        .populate('hospital', 'name location');
      
      if (patient) {
        records = await MedicalRecord.find({ patient: patient._id })
          .populate('doctor', 'username firstName lastName specialization');
        prescriptions = await Prescription.find({ patient: patient._id })
          .populate('doctor', 'username firstName lastName specialization');
      } else {
        records = [];
        prescriptions = [];
      }
    } else {
      records = [];
      prescriptions = [];
    }

    const allData = {
      profile: {
        id: user._id,
        username: user.username,
        role: user.role,
        hospital: user.hospital,
        firstName: user.firstName,
        lastName: user.lastName,
        contactNumber: user.contactNumber,
        specialization: user.specialization,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      patient: patient || null,
      medicalRecords: records,
      prescriptions: prescriptions
    };

    res.json(allData);
  } catch (error) {
    console.error('Download all data error:', error);
    res.status(500).json({ error: 'Failed to download user data' });
  }
};
