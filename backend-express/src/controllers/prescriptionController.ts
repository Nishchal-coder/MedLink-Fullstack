import { Request, Response } from 'express';
import { Prescription } from '../models/Prescription';
import { Doctor } from '../models/Doctor';
import { User } from '../models/User';
import { Questionnaire } from '../models/Questionnaire';
import { IAuthRequest } from '../types';
import { getUserHospital } from '../middleware/hospitalAuth';
import { Hospital } from '../models/Hospital';

// Create prescription (doctor only)
export const createPrescription = async (req: IAuthRequest, res: Response) => {
  try {
    const { patientNID, diagnosis, notes, medicines } = req.body;

    console.log(`🔍 Creating prescription for patient NID: ${patientNID}`);
    console.log(`🔍 Request body:`, req.body);

    if (!patientNID || !diagnosis || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: 'Patient NID, diagnosis, and medicines are required' });
    }

    // First, try to find the patient by NID in User collection
    console.log(`🔍 Searching for patient with NID: ${patientNID} in User collection`);
    let patient = await User.findOne({ nationalId: patientNID });
    
    if (!patient) {
      console.log(`❌ Patient not found in User collection with NID: ${patientNID}`);
      console.log(`🔍 Trying to find patient in Questionnaire collection...`);
      
      // Try to find in Questionnaire collection as fallback
      const questionnaire = await Questionnaire.findOne({ nid: patientNID }).populate('user');
      
      if (questionnaire && questionnaire.user) {
        console.log(`✅ Found patient in Questionnaire collection`);
        patient = questionnaire.user as any;
      } else {
        console.log(`❌ Patient not found in Questionnaire collection either`);
        console.log(`🔍 Checking if user exists with different NID format...`);
        
        // Try alternative search methods
        const allUsers = await User.find({}).select('nationalId firstName lastName');
        console.log(`🔍 All users in database:`, allUsers.map(u => ({ nationalId: u.nationalId, name: `${u.firstName} ${u.lastName}` })));
        
        return res.status(404).json({ error: 'Patient not found with this NID' });
      }
    }

    console.log(`✅ Found patient: ${patient?.firstName} ${patient?.lastName} (ID: ${patient?._id})`);

    // Get doctor info from the authenticated user
    const doctorId = req.user?._id;
    if (!doctorId) {
      return res.status(401).json({ error: 'Doctor authentication required' });
    }

    // Get hospital from the authenticated user
    const userHospital = getUserHospital(req);
    
    // For doctors, allow creating prescriptions even without hospital assignment
    // Use a default hospital or the doctor's assigned hospital
    let prescriptionHospital = userHospital;
    if (!prescriptionHospital && req.user?.role === 'doctor') {
      // If doctor doesn't have hospital assigned, use a default hospital
      // Try to find a default hospital in the database
      const defaultHospital = await Hospital.findOne({ name: 'MedLink General Hospital' });
      if (defaultHospital) {
        prescriptionHospital = defaultHospital._id.toString();
        console.log(`🏥 Using default hospital: ${defaultHospital.name}`);
      } else {
        // If no default hospital exists, create one
        const newHospital = new Hospital({
          name: 'MedLink General Hospital',
          location: 'Default Location',
          contactPhone: 'Default Phone'
        });
        await newHospital.save();
        prescriptionHospital = newHospital._id.toString();
        console.log(`🏥 Created default hospital: ${newHospital.name}`);
      }
    }
    
    if (!prescriptionHospital) {
      return res.status(403).json({ error: 'Hospital access required' });
    }

    // Ensure patient is not null before creating prescription
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found with this NID' });
    }

    // Create prescription
    const prescription = new Prescription({
      patientId: patient._id,
      doctorId: doctorId,
      patientNID: patientNID,
      hospital: prescriptionHospital,
      diagnosis,
      notes,
      medicines,
      status: 'active'
    });

    await prescription.save();

    // Populate doctor and patient info for response
    await prescription.populate('doctorId', 'firstName lastName specialization');
    await prescription.populate('patientId', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: prescription
    });

  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
};

// Get prescriptions for a patient (by NID)
export const getPatientPrescriptions = async (req: IAuthRequest, res: Response) => {
  try {
    const { nid } = req.params;

    if (!nid) {
      return res.status(400).json({ error: 'Patient NID is required' });
    }

    const prescriptions = await Prescription.find({ patientNID: nid })
      .populate('doctorId', 'firstName lastName specialization')
      .populate('patientId', 'firstName lastName')
      .sort({ prescribedAt: -1 });

    res.json({
      success: true,
      data: prescriptions
    });

  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

// Get prescriptions for logged-in user
export const getUserPrescriptions = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const prescriptions = await Prescription.find({ patientId: userId })
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ prescribedAt: -1 });

    res.json({
      success: true,
      data: prescriptions
    });

  } catch (error) {
    console.error('Get user prescriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

// Get prescriptions created by doctor (now shows all prescriptions from same hospital)
export const getDoctorPrescriptions = async (req: IAuthRequest, res: Response) => {
  try {
    const doctorId = req.user?._id;
    if (!doctorId) {
      return res.status(401).json({ error: 'Doctor authentication required' });
    }

    // Get hospital from the authenticated user
    const userHospital = getUserHospital(req);
    
    let prescriptions;
    if (userHospital) {
      // If doctor has hospital assigned, get prescriptions from that hospital
      prescriptions = await Prescription.find({ hospital: userHospital })
        .populate('patientId', 'firstName lastName nationalId')
        .populate('doctorId', 'firstName lastName specialization')
        .sort({ prescribedAt: -1 });
    } else {
      // If doctor doesn't have hospital assigned, get prescriptions created by this doctor
      // or from the default hospital
      prescriptions = await Prescription.find({
        $or: [
          { doctorId: doctorId },
          { hospital: 'MedLink General Hospital' }
        ]
      })
        .populate('patientId', 'firstName lastName nationalId')
        .populate('doctorId', 'firstName lastName specialization')
        .sort({ prescribedAt: -1 });
    }

    res.json({
      success: true,
      data: prescriptions,
      message: userHospital ? 'Showing all prescriptions from your hospital' : 'Showing your prescriptions and default hospital prescriptions'
    });

  } catch (error) {
    console.error('Get doctor prescriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
};

// Update prescription status
export const updatePrescriptionStatus = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('doctorId', 'firstName lastName specialization')
     .populate('patientId', 'firstName lastName');

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json({
      success: true,
      message: 'Prescription status updated successfully',
      data: prescription
    });

  } catch (error) {
    console.error('Update prescription status error:', error);
    res.status(500).json({ error: 'Failed to update prescription status' });
  }
};

// Get specific prescription
export const getPrescription = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate('doctorId', 'firstName lastName specialization')
      .populate('patientId', 'firstName lastName nationalId');

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json({
      success: true,
      data: prescription
    });

  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ error: 'Failed to fetch prescription' });
  }
};
