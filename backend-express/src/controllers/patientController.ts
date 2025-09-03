import { Request, Response } from 'express';
import { Patient, User, Hospital, Questionnaire } from '../models';
import { IAuthRequest } from '../types';

export const getPatients = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let patients;

    if (user.role === 'superadmin') {
      patients = await Patient.find()
        .populate('user', 'username firstName lastName contactNumber')
        .populate('hospital', 'name location')
        .populate('updatedBy', 'username firstName lastName')
        .sort({ createdAt: -1 });
    } else if (user.role === 'admin' || user.role === 'doctor') {
      patients = await Patient.find({ hospital: user.hospital })
        .populate('user', 'username firstName lastName contactNumber')
        .populate('hospital', 'name location')
        .populate('updatedBy', 'username firstName lastName')
        .sort({ createdAt: -1 });
    } else if (user.role === 'user') {
      patients = await Patient.find({ user: user._id })
        .populate('user', 'username firstName lastName contactNumber')
        .populate('hospital', 'name location')
        .populate('updatedBy', 'username firstName lastName')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    res.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const getPatient = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const patient = await Patient.findById(id)
      .populate('user', 'username firstName lastName contactNumber')
      .populate('hospital', 'name location')
      .populate('updatedBy', 'username firstName lastName');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check permissions
    if (user.role === 'user' && (patient.user as any)._id.toString() !== user._id?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if ((user.role === 'admin' || user.role === 'doctor') && (patient.hospital as any)._id.toString() !== user.hospital?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ patient });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

export const createPatient = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const patientData = req.body;

    // Check if user already has a patient profile
    if (user.role === 'user') {
      const existingPatient = await Patient.findOne({ user: user._id });
      if (existingPatient) {
        return res.status(400).json({ error: 'Patient profile already exists' });
      }
      patientData.user = user._id;
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      // Admin can create patient profiles for any user
      if (!patientData.user) {
        return res.status(400).json({ error: 'User ID is required for patient creation' });
      }
    } else {
      return res.status(403).json({ error: 'Insufficient permissions to create patient profile' });
    }

    // Set hospital based on user's hospital or create/find default hospital
    if (user.hospital) {
      patientData.hospital = user.hospital;
    } else {
      // If user doesn't have a hospital assigned, find or create a default hospital
      try {
        let defaultHospital = await Hospital.findOne({ name: 'MedLink General Hospital' });
        
        if (!defaultHospital) {
          // Create the default hospital if it doesn't exist
          defaultHospital = new Hospital({
            name: 'MedLink General Hospital',
            location: 'Main City, State',
            contactPhone: '+1-555-0123'
          });
          await defaultHospital.save();
          console.log('✅ Created default hospital:', defaultHospital._id);
        }
        
        patientData.hospital = defaultHospital._id;
        
        // Also update the user's hospital field
        await User.findByIdAndUpdate(user._id, { hospital: defaultHospital._id });
        console.log('✅ Updated user hospital assignment');
        
      } catch (hospitalError) {
        console.error('Error setting hospital for patient:', hospitalError);
        return res.status(500).json({ error: 'Failed to assign hospital to patient' });
      }
    }

    // Set updated by
    patientData.updatedBy = user._id;

    const patient = new Patient(patientData);
    await patient.save();

    await patient.populate([
      { path: 'user', select: 'username firstName lastName contactNumber' },
      { path: 'hospital', select: 'name location' },
      { path: 'updatedBy', select: 'username firstName lastName' }
    ]);

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

export const updatePatient = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const updateData = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check permissions
    if (user.role === 'user' && patient.user.toString() !== user._id?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if ((user.role === 'admin' || user.role === 'doctor') && patient.hospital.toString() !== user.hospital?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Set updated by
    updateData.updatedBy = user._id;

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'username firstName lastName contactNumber' },
      { path: 'hospital', select: 'name location' },
      { path: 'updatedBy', select: 'username firstName lastName' }
    ]);

    res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

export const deletePatient = async (req: IAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check permissions - only superadmin can delete patients
    if (user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Only superadmin can delete patients' });
    }

    await Patient.findByIdAndDelete(id);

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};

export const getPatientData = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    console.log('🔍 getPatientData called with user:', {
      id: user._id,
      username: user.username,
      role: user.role
    });

    // Allow any authenticated user to access their own patient data
    // (not just 'user' role, as patients might have different roles)

    console.log('🔍 Searching for patient with user ID:', user._id);
    let patient = await Patient.findOne({ user: user._id })
      .populate('user', 'username firstName lastName contactNumber')
      .populate('hospital', 'name location')
      .populate('updatedBy', 'username firstName lastName');

    if (!patient) {
      console.log('❌ Patient not found for user ID:', user._id);
      console.log('🔄 Creating new patient profile for user...');
      
      try {
        // Set hospital based on user's hospital or create/find default hospital
        let hospitalId = user.hospital;
        if (!hospitalId) {
          // If user doesn't have a hospital assigned, find or create a default hospital
          let defaultHospital = await Hospital.findOne({ name: 'MedLink General Hospital' });
          
          if (!defaultHospital) {
            // Create the default hospital if it doesn't exist
            defaultHospital = new Hospital({
              name: 'MedLink General Hospital',
              location: 'Main City, State',
              contactPhone: '+1-555-0123'
            });
            await defaultHospital.save();
            console.log('✅ Created default hospital:', defaultHospital._id);
          }
          
          hospitalId = defaultHospital._id.toString();
          
          // Also update the user's hospital field
          await User.findByIdAndUpdate(user._id, { hospital: hospitalId });
          console.log('✅ Updated user hospital assignment');
        }

        // Create a new patient profile
        const patientData = {
          user: user._id,
          hospital: hospitalId,
          mrn: `MRN-${user._id.toString().slice(-6).padStart(6, '0')}`,
          updatedBy: user._id,
          // Set default values
          dateOfBirth: user.dateOfBirth || null,
          gender: user.gender || 'other',
          bloodGroup: 'A+',
          hasBloodType: false,
          diseases: [],
          allergies: [],
          medications: [],
          medicalHistory: '',
          address: user.address || '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          emergencyContactRelation: ''
        };

        patient = new Patient(patientData);
        await patient.save();

        await patient.populate([
          { path: 'user', select: 'username firstName lastName contactNumber' },
          { path: 'hospital', select: 'name location' },
          { path: 'updatedBy', select: 'username firstName lastName' }
        ]);

        console.log('✅ Created new patient profile:', {
          id: patient._id,
          mrn: patient.mrn,
          user: patient.user
        });
      } catch (createError) {
        console.error('❌ Error creating patient profile:', createError);
        return res.status(500).json({ 
          error: 'Failed to create patient profile. Please try again.' 
        });
      }
    }

    console.log('✅ Patient found/created:', {
      id: patient._id,
      mrn: patient.mrn,
      user: patient.user
    });

    res.json({ patient });
  } catch (error) {
    console.error('Get patient data error:', error);
    res.status(500).json({ error: 'Failed to retrieve patient data' });
  }
};

// Update current user's patient data
export const updatePatientData = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const updateData = req.body;

    console.log('🔍 updatePatientData called with user:', {
      id: user._id,
      username: user.username,
      role: user.role
    });

    // Allow any authenticated user to update their own patient data
    // (not just 'user' role, as patients might have different roles)

    console.log('🔍 Searching for patient with user ID:', user._id);
    const patient = await Patient.findOne({ user: user._id });

    if (!patient) {
      console.log('❌ Patient not found for user ID:', user._id);
      return res.status(404).json({ 
        error: 'Patient profile not found. Please contact your healthcare provider.' 
      });
    }

    // Update the patient data
    const updatedPatient = await Patient.findByIdAndUpdate(
      patient._id,
      {
        ...updateData,
        updatedBy: user._id,
        lastUpdated: new Date()
      },
      { new: true }
    ).populate('user', 'username firstName lastName contactNumber')
     .populate('hospital', 'name location')
     .populate('updatedBy', 'username firstName lastName');

    console.log('✅ Patient updated successfully:', {
      id: updatedPatient?._id,
      mrn: updatedPatient?.mrn
    });

    res.json({ 
      success: true,
      message: 'Patient data updated successfully',
      patient: updatedPatient 
    });
  } catch (error) {
    console.error('Update patient data error:', error);
    res.status(500).json({ error: 'Failed to update patient data' });
  }
};

// Emergency search endpoint - no authentication required
export const emergencySearch = async (req: Request, res: Response) => {
  try {
    const { searchType, searchValue } = req.query;

    if (!searchType || !searchValue) {
      return res.status(400).json({ 
        error: 'Search type and search value are required' 
      });
    }

    const searchTypeStr = searchType as string;
    const searchValueStr = searchValue as string;

    if (!['nid', 'mrn'].includes(searchTypeStr)) {


      
      return res.status(400).json({ 
        error: 'Search type must be either "nid" or "mrn"' 
      });
    }

    let patient;

    if (searchTypeStr === 'nid') {
      // First, check if there's questionnaire data for this NID (most comprehensive)
      const questionnaire = await Questionnaire.findOne({ nid: searchValueStr });
      
      if (questionnaire) {
        // Get user data for the questionnaire
        const user = await User.findById(questionnaire.user);
        if (!user) {
          return res.status(404).json({ 
            error: `User not found for questionnaire with NID: ${searchValueStr}` 
          });
        }

        // Create comprehensive emergency data from questionnaire
        const emergencyData = {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          nationalId: questionnaire.nid,
          mrn: questionnaire.patient ? 'Available' : 'N/A',
          dateOfBirth: user.dateOfBirth,
          age: user.dateOfBirth ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
          gender: user.gender,
          bloodType: questionnaire.bloodType || 'Unknown',
          allergies: questionnaire.allergies ? [questionnaire.allergies] : [],
          medications: questionnaire.currentMedications ? [questionnaire.currentMedications] : [],
          emergencyContact: {
            name: questionnaire.emergencyContact || 'Not specified',
            phone: questionnaire.emergencyPhone || user.contactNumber || 'Not specified',
            relationship: questionnaire.relationship || 'Not specified'
          },
          medicalHistory: questionnaire.chronicConditions ? [questionnaire.chronicConditions] : [],
          diseases: questionnaire.previousSurgeries ? [questionnaire.previousSurgeries] : [],
          address: user.address || 'Not specified',
          hospital: null,
          lastUpdated: questionnaire.completedAt,
          status: user.status,
          // Additional questionnaire data
          height: questionnaire.height,
          weight: questionnaire.weight,
          lifestyle: {
            smoking: questionnaire.smoking,
            alcohol: questionnaire.alcohol,
            exercise: questionnaire.exercise,
            diet: questionnaire.diet
          }
        };

        console.log(`🚨 Emergency access: ${searchTypeStr.toUpperCase()} ${searchValueStr} accessed at ${new Date().toISOString()}`);
        return res.json({ 
          patient: emergencyData,
          message: 'Emergency access granted (Questionnaire data)'
        });
      }

      // If no questionnaire, search by National ID through User model
      const user = await User.findOne({ nationalId: searchValueStr });
      if (!user) {
        return res.status(404).json({ 
          error: `No patient found with National ID: ${searchValueStr}` 
        });
      }

      // Try to find patient record first
      patient = await Patient.findOne({ user: user._id })
        .populate('user', 'firstName lastName contactNumber nationalId')
        .populate('hospital', 'name location')
        .populate('updatedBy', 'firstName lastName');

      // If no patient record exists, create emergency data from user data
      if (!patient) {
        const emergencyData = {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          nationalId: user.nationalId,
          mrn: 'N/A', // No MRN since no patient record
          dateOfBirth: user.dateOfBirth,
          age: user.dateOfBirth ? Math.floor((Date.now() - new Date(user.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
          gender: user.gender,
          bloodType: 'Unknown',
          allergies: [],
          medications: [],
          emergencyContact: {
            name: 'Not specified',
            phone: user.contactNumber || 'Not specified',
            relationship: 'Not specified'
          },
          medicalHistory: [],
          diseases: [],
          address: user.address || 'Not specified',
          hospital: null,
          lastUpdated: user.updatedAt,
          status: user.status
        };

        console.log(`🚨 Emergency access: ${searchTypeStr.toUpperCase()} ${searchValueStr} accessed at ${new Date().toISOString()}`);
        return res.json({ 
          patient: emergencyData,
          message: 'Emergency access granted (User data only)'
        });
      }
    } else {
      // Search by MRN directly
      patient = await Patient.findOne({ mrn: searchValueStr })
        .populate('user', 'firstName lastName contactNumber nationalId')
        .populate('hospital', 'name location')
        .populate('updatedBy', 'firstName lastName');
    }

    if (!patient) {
      return res.status(404).json({ 
        error: `No patient found with ${searchTypeStr.toUpperCase()}: ${searchValueStr}` 
      });
    }

    // Format the response for emergency use
    const emergencyData = {
      id: patient._id,
      name: `${(patient.user as any).firstName} ${(patient.user as any).lastName}`,
      nationalId: (patient.user as any).nationalId,
      mrn: patient.mrn,
      dateOfBirth: patient.dateOfBirth,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodGroup,
      allergies: patient.allergies || [],
      medications: patient.medications || [],
      emergencyContact: {
        name: patient.emergencyContactName,
        phone: patient.emergencyContactPhone,
        relationship: patient.emergencyContactRelation
      },
      medicalHistory: patient.medicalHistory ? [patient.medicalHistory] : [],
      diseases: patient.diseases || [],
      address: patient.address,
      hospital: patient.hospital ? {
        name: (patient.hospital as any).name,
        location: (patient.hospital as any).location
      } : null,
      lastUpdated: patient.lastUpdated,
      status: 'Active'
    };

    // Log emergency access for audit purposes
    console.log(`🚨 Emergency access: ${searchTypeStr.toUpperCase()} ${searchValueStr} accessed at ${new Date().toISOString()}`);

    res.json({ 
      patient: emergencyData,
      message: 'Emergency access granted'
    });
  } catch (error) {
    console.error('Emergency search error:', error);
    res.status(500).json({ error: 'Failed to perform emergency search' });
  }
};
