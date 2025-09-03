import { Request, Response } from 'express';
import { Doctor } from '../models/Doctor';
import { User } from '../models/User';
import { Patient } from '../models/Patient';
import { Questionnaire } from '../models/Questionnaire';
import { IAuthRequest } from '../types';
import { getUserHospital } from '../middleware/hospitalAuth';
import bcrypt from 'bcryptjs';

// Get all doctors for the admin's hospital
export const getDoctors = async (req: IAuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, specialization, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get the user's hospital
    const userHospital = getUserHospital(req);
    
    // Build query - only doctors from the admin's hospital
    const query: any = {};
    
    // If user has a specific hospital, filter by it
    if (userHospital) {
      query.hospital = userHospital;
    }
    
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Doctor.countDocuments(query);

    res.json({
      results: doctors,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Get specific doctor
export const getDoctor = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Ensure doctor belongs to the user's hospital
    const userHospital = getUserHospital(req);
    if (userHospital && doctor.hospital !== userHospital) {
      return res.status(403).json({ error: 'Access denied: You can only access doctors from your hospital' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// Create doctor
export const createDoctor = async (req: IAuthRequest, res: Response) => {
  try {
    const rawData = req.body;
    console.log('Raw doctor data received:', rawData);

    // Map frontend fields to backend schema fields
    const doctorData: any = {
      username: rawData.username,
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      email: rawData.email,
      password: rawData.password,
      dateOfBirth: rawData.dateOfBirth,
      gender: rawData.gender,
      contactNumber: rawData.contactNumber,
      address: rawData.address,
      specialization: rawData.specialization,
      medicalLicenseNumber: rawData.medicalLicense || rawData.medicalLicenseNumber,
      yearsOfExperience: rawData.yearsOfExperience ? parseInt(rawData.yearsOfExperience) : undefined,
      educationalBackground: rawData.education ? [rawData.education] : (rawData.educationalBackground || []),
      certifications: rawData.certifications || [],
      languages: rawData.languages || []
    };

    console.log('Mapped doctor data:', doctorData);

    // Check if username already exists
    const existingUsername = await Doctor.findOne({ username: doctorData.username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await Doctor.findOne({ email: doctorData.email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if medical license already exists
    if (doctorData.medicalLicenseNumber) {
      const existingLicense = await Doctor.findOne({ medicalLicenseNumber: doctorData.medicalLicenseNumber });
      if (existingLicense) {
        return res.status(400).json({ error: 'Medical license number already exists' });
      }
    }

    // Set hospital to user's hospital and mustChangePassword to true
    const userHospital = getUserHospital(req);
    if (!userHospital) {
      return res.status(403).json({ error: 'Hospital access required to create doctors' });
    }
    doctorData.hospital = userHospital;
    doctorData.mustChangePassword = true;

    console.log('Final doctor data before save:', doctorData);

    const doctor = new Doctor(doctorData);
    await doctor.save();

    // Return doctor without password
    const doctorResponse = doctor.toObject() as any;
    delete doctorResponse.password;

    res.status(201).json(doctorResponse);
  } catch (error: any) {
    console.error('Create doctor error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

// Update doctor
export const updateDoctor = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Ensure doctor belongs to the user's hospital
    const userHospital = getUserHospital(req);
    if (userHospital && doctor.hospital !== userHospital) {
      return res.status(403).json({ error: 'Access denied: You can only access doctors from your hospital' });
    }

    // Check if username is being changed and if it already exists
    if (updateData.username && updateData.username !== doctor.username) {
      const existingUsername = await Doctor.findOne({ username: updateData.username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== doctor.email) {
      const existingEmail = await Doctor.findOne({ email: updateData.email });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Hash password if it's being updated
    if (updateData.password) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Ensure hospital remains the user's hospital
    if (userHospital) {
      updateData.hospital = userHospital;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedDoctor);
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

// Delete doctor
export const deleteDoctor = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Ensure doctor belongs to the user's hospital
    const userHospital = getUserHospital(req);
    if (userHospital && doctor.hospital !== userHospital) {
      return res.status(403).json({ error: 'Access denied: You can only access doctors from your hospital' });
    }

    await Doctor.findByIdAndDelete(id);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

// Get doctors count for dashboard
export const getDoctorsCount = async (req: IAuthRequest, res: Response) => {
  try {
    const userHospital = getUserHospital(req);
    const query: any = { status: 'Active' };
    
    if (userHospital) {
      query.hospital = userHospital;
    }
    
    const count = await Doctor.countDocuments(query);
    res.json({ count });
  } catch (error) {
    console.error('Get doctors count error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors count' });
  }
};

// Search user by NID for doctor access
export const searchUserByNID = async (req: IAuthRequest, res: Response) => {
  try {
    const { nid } = req.params;
    
    if (!nid) {
      return res.status(400).json({ error: 'NID is required' });
    }

    console.log(`🔍 Searching for questionnaire with NID: ${nid}`);

    // Find questionnaire by NID
    const questionnaire = await Questionnaire.findOne({ nid: nid })
      .populate('user', 'firstName lastName username email dateOfBirth gender contactNumber address status role')
      .populate('patient', 'mrn bloodGroup hasBloodType height weight diseases allergies medications medicalHistory emergencyContactName emergencyContactPhone emergencyContactRelation testResults medicalImagesSummary lastUpdated');
    
    if (!questionnaire) {
      return res.status(404).json({ error: 'Patient not found with this NID' });
    }

    console.log(`✅ Found patient with NID: ${questionnaire.nid}`);

    // Get user data from populated field
    const userData = questionnaire.user as any;
    const patientDataFromDB = questionnaire.patient as any;

    // Prepare response data with questionnaire information
    const patientData = {
      id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      nationalId: questionnaire.nid,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      contactNumber: userData.contactNumber,
      address: userData.address,
      status: userData.status,
      role: userData.role,
      
      // Questionnaire medical data
      questionnaireData: {
        bloodType: questionnaire.bloodType,
        height: questionnaire.height,
        weight: questionnaire.weight,
        emergencyContact: questionnaire.emergencyContact,
        emergencyPhone: questionnaire.emergencyPhone,
        relationship: questionnaire.relationship,
        allergies: questionnaire.allergies,
        currentMedications: questionnaire.currentMedications,
        chronicConditions: questionnaire.chronicConditions,
        previousSurgeries: questionnaire.previousSurgeries,
        smoking: questionnaire.smoking,
        alcohol: questionnaire.alcohol,
        exercise: questionnaire.exercise,
        diet: questionnaire.diet,
        completedAt: questionnaire.completedAt
      },
      
      // Patient specific data (if exists)
      patientData: patientDataFromDB ? {
        mrn: patientDataFromDB.mrn,
        bloodGroup: patientDataFromDB.bloodGroup,
        hasBloodType: patientDataFromDB.hasBloodType,
        height: patientDataFromDB.height,
        weight: patientDataFromDB.weight,
        diseases: patientDataFromDB.diseases,
        allergies: patientDataFromDB.allergies,
        medications: patientDataFromDB.medications,
        medicalHistory: patientDataFromDB.medicalHistory,
        emergencyContactName: patientDataFromDB.emergencyContactName,
        emergencyContactPhone: patientDataFromDB.emergencyContactPhone,
        emergencyContactRelation: patientDataFromDB.emergencyContactRelation,
        testResults: patientDataFromDB.testResults,
        medicalImagesSummary: patientDataFromDB.medicalImagesSummary,
        lastUpdated: patientDataFromDB.lastUpdated
      } : null
    };

    res.json({
      success: true,
      message: 'Patient found successfully',
      data: patientData
    });

  } catch (error) {
    console.error('Search user by NID error:', error);
    res.status(500).json({ error: 'Failed to search patient by NID' });
  }
};
