import { Request, Response } from 'express';
import { Questionnaire, Patient } from '../models';
import { IAuthRequest } from '../types';

export const createQuestionnaire = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const questionnaireData = req.body;

    // Find the patient record for this user
    const patient = await Patient.findOne({ user: user._id });
    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    // Create questionnaire data (only health-related fields)
    const questionnaire = new Questionnaire({
      user: user._id,
      patient: patient._id,
      nid: questionnaireData.nid,
      bloodType: questionnaireData.bloodType,
      height: questionnaireData.height,
      weight: questionnaireData.weight,
      emergencyContact: questionnaireData.emergencyContact,
      emergencyPhone: questionnaireData.emergencyPhone,
      relationship: questionnaireData.relationship,
      allergies: questionnaireData.allergies,
      currentMedications: questionnaireData.currentMedications,
      chronicConditions: questionnaireData.chronicConditions,
      previousSurgeries: questionnaireData.previousSurgeries,
      smoking: questionnaireData.smoking,
      alcohol: questionnaireData.alcohol,
      exercise: questionnaireData.exercise,
      diet: questionnaireData.diet,
      completedAt: new Date()
    });

    await questionnaire.save();

    // Also update the patient profile with questionnaire data
    const patientUpdateData: any = {
      dateOfBirth: new Date(questionnaireData.dateOfBirth),
      gender: questionnaireData.gender,
      bloodGroup: questionnaireData.bloodType !== 'Not specified' ? questionnaireData.bloodType : undefined,
      hasBloodType: questionnaireData.bloodType !== 'Not specified',
      height: questionnaireData.height || undefined,
      weight: questionnaireData.weight || undefined,
      emergencyContactName: questionnaireData.emergencyContact,
      emergencyContactPhone: questionnaireData.emergencyPhone,
      emergencyContactRelation: questionnaireData.relationship,
      allergies: questionnaireData.allergies ? [questionnaireData.allergies] : [],
      medications: questionnaireData.currentMedications ? [questionnaireData.currentMedications] : [],
      medicalHistory: questionnaireData.chronicConditions || questionnaireData.previousSurgeries ? 
        `Chronic Conditions: ${questionnaireData.chronicConditions || 'None'}\nPrevious Surgeries: ${questionnaireData.previousSurgeries || 'None'}` : undefined,
      lastUpdated: new Date(),
      updatedBy: user._id
    };

    // Remove undefined values
    Object.keys(patientUpdateData).forEach(key => {
      if (patientUpdateData[key] === undefined) {
        delete patientUpdateData[key];
      }
    });

    await Patient.findByIdAndUpdate(patient._id, patientUpdateData);

    res.status(201).json({
      message: 'Questionnaire completed successfully',
      questionnaire
    });
  } catch (error) {
    console.error('Create questionnaire error:', error);
    res.status(500).json({ error: 'Failed to save questionnaire' });
  }
};

export const getQuestionnaire = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const questionnaire = await Questionnaire.findById(id)
      .populate('user', 'username firstName lastName')
      .populate('patient', 'mrn');

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Check permissions
    if (user.role === 'user' && questionnaire.user.toString() !== user._id?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ questionnaire });
  } catch (error) {
    console.error('Get questionnaire error:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire' });
  }
};

export const getMyQuestionnaire = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (user.role !== 'user') {
      return res.status(403).json({ error: 'This endpoint is only available for patients' });
    }

    // Get the latest questionnaire for this user
    const questionnaire = await Questionnaire.findOne({ user: user._id })
      .sort({ completedAt: -1 })
      .populate('user', 'username firstName lastName email contactNumber dateOfBirth gender')
      .populate('patient', 'mrn');

    if (!questionnaire) {
      return res.status(404).json({ 
        error: 'No questionnaire found. Please complete the initial questionnaire.' 
      });
    }

    // Return combined data with user info (read-only) and questionnaire data
    const combinedData = {
      user: {
        firstName: (questionnaire.user as any).firstName,
        lastName: (questionnaire.user as any).lastName,
        email: (questionnaire.user as any).email,
        contactNumber: (questionnaire.user as any).contactNumber,
        dateOfBirth: (questionnaire.user as any).dateOfBirth,
        gender: (questionnaire.user as any).gender,
        username: (questionnaire.user as any).username
      },
      questionnaire: {
        nid: questionnaire.nid,
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
        completedAt: questionnaire.completedAt,
        version: questionnaire.version
      }
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Get my questionnaire error:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaire' });
  }
};

export const updateQuestionnaire = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const updateData = req.body;

    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    // Check permissions
    if (user.role === 'user' && questionnaire.user.toString() !== user._id?.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update questionnaire data
    const updatedQuestionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      {
        ...updateData,
        completedAt: new Date(),
        version: questionnaire.version + 1
      },
      { new: true, runValidators: true }
    ).populate('user', 'username firstName lastName')
     .populate('patient', 'mrn');

    res.json({
      message: 'Questionnaire updated successfully',
      questionnaire: updatedQuestionnaire
    });
  } catch (error) {
    console.error('Update questionnaire error:', error);
    res.status(500).json({ error: 'Failed to update questionnaire' });
  }
};

export const getAllQuestionnaires = async (req: IAuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let questionnaires;

    if (user.role === 'superadmin') {
      questionnaires = await Questionnaire.find()
        .populate('user', 'username firstName lastName')
        .populate('patient', 'mrn')
        .sort({ completedAt: -1 });
    } else if (user.role === 'admin' || user.role === 'doctor') {
      // Get questionnaires for patients in the same hospital
      const patients = await Patient.find({ hospital: user.hospital });
      const patientIds = patients.map(p => p._id);
      
      questionnaires = await Questionnaire.find({ patient: { $in: patientIds } })
        .populate('user', 'username firstName lastName')
        .populate('patient', 'mrn')
        .sort({ completedAt: -1 });
    } else {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    res.json({ questionnaires });
  } catch (error) {
    console.error('Get all questionnaires error:', error);
    res.status(500).json({ error: 'Failed to fetch questionnaires' });
  }
};
