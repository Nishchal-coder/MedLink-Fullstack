import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Patient } from '../types/Patient';

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  getPatientById: (id: string) => Patient | undefined;
  getPatientByNID: (nid: string) => Patient | undefined;
  getPatientByMRN: (mrn: string) => Patient | undefined;
  getPatientsByUserId: (userId: string) => Patient[];
  addPatient: (patient: Omit<Patient, '_id'>) => Promise<boolean>;
  updatePatient: (patient: Patient) => Promise<boolean>;
  deletePatient: (id: string) => Promise<boolean>;
}

interface PatientProviderProps {
  children: ReactNode;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: PatientProviderProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('medlink_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchPatients = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current user to determine their role
      const userResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user profile');
      }

      const userData = await userResponse.json();
      const user = userData.user || userData;

      // If user is a regular patient, fetch their own data
      if (user.role === 'user') {
        const response = await fetch(`${API_BASE_URL}/patients/me`, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Transform single patient data to array format
          const patientData = data.patient || data;
          const transformedPatient: Patient = {
            _id: patientData._id,
            user: patientData.user?._id || user.id,
            hospital: patientData.hospital?._id || 'default',
            mrn: patientData.mrn,
            name: `${patientData.user?.firstName || ''} ${patientData.user?.lastName || ''}`.trim(),
            nationalId: patientData.user?.nationalId || 'N/A',
            dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : undefined,
            gender: patientData.gender,
            bloodGroup: patientData.bloodGroup,
            hasBloodType: patientData.hasBloodType,
            email: patientData.user?.email || 'N/A',
            phone: patientData.user?.contactNumber || 'N/A',
            address: patientData.address || 'N/A',
            emergencyContact: patientData.emergencyContactPhone || 'N/A',
            emergencyContactName: patientData.emergencyContactName,
            emergencyContactPhone: patientData.emergencyContactPhone,
            emergencyContactRelation: patientData.emergencyContactRelation,
            medicalHistory: patientData.medicalHistory || patientData.diseases?.join(', ') || 'No significant history',
            allergies: Array.isArray(patientData.allergies) ? patientData.allergies : patientData.allergies ? [patientData.allergies] : [],
            medications: Array.isArray(patientData.medications) ? patientData.medications : patientData.medications ? [patientData.medications] : [],
            diseases: Array.isArray(patientData.diseases) ? patientData.diseases : patientData.diseases ? [patientData.diseases] : [],
            age: calculateAge(patientData.dateOfBirth),
            testResults: patientData.testResults || [],
            medicalImagesSummary: patientData.medicalImagesSummary || [],
            lastUpdated: new Date(),
            updatedBy: patientData.updatedBy,
            createdAt: patientData.createdAt ? new Date(patientData.createdAt) : new Date(),
            updatedAt: patientData.updatedAt ? new Date(patientData.updatedAt) : new Date(),
            status: 'Active',
            userId: patientData.user?._id || user.id,
            dob: patientData.dateOfBirth,
            bloodType: patientData.bloodGroup
          };
          
          setPatients([transformedPatient]);
                 } else {
           // If patient profile doesn't exist, create one automatically
           console.log('🏥 Patient profile not found, creating one...');
           
           const createPatientData = {
             dateOfBirth: new Date().toISOString().split('T')[0],
             gender: 'other',
             bloodGroup: 'A+', // Valid blood group
             hasBloodType: true,
             diseases: [],
             allergies: [],
             address: 'N/A',
             emergencyContactName: 'N/A',
             emergencyContactPhone: 'N/A',
             medications: []
           };
           
           try {
             const createResponse = await fetch(`${API_BASE_URL}/patients/`, {
               method: 'POST',
               headers: getAuthHeaders(),
               body: JSON.stringify(createPatientData),
             });
             
             if (createResponse.ok) {
               const createdData = await createResponse.json();
               console.log('✅ Patient profile created successfully:', createdData);
               
               // Transform the created patient data
               const createdPatient: Patient = {
                 _id: createdData.patient?._id,
                 user: user.id,
                 hospital: createdData.patient?.hospital || 'default',
                 mrn: createdData.patient?.mrn || 'N/A',
                 name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                 nationalId: user.nationalId || 'N/A',
                 dateOfBirth: createdData.patient?.dateOfBirth ? new Date(createdData.patient.dateOfBirth) : new Date(createPatientData.dateOfBirth),
                 gender: createdData.patient?.gender || createPatientData.gender,
                 bloodGroup: createdData.patient?.bloodGroup || createPatientData.bloodGroup,
                 hasBloodType: createdData.patient?.hasBloodType || createPatientData.hasBloodType,
                 email: user.email || 'N/A',
                 phone: user.contactNumber || 'N/A',
                 address: createdData.patient?.address || 'N/A',
                 emergencyContact: createdData.patient?.emergencyContactPhone || 'N/A',
                 emergencyContactName: createdData.patient?.emergencyContactName,
                 emergencyContactPhone: createdData.patient?.emergencyContactPhone,
                 emergencyContactRelation: createdData.patient?.emergencyContactRelation,
                 medicalHistory: createdData.patient?.medicalHistory || 'No significant history',
                 allergies: Array.isArray(createdData.patient?.allergies) ? createdData.patient.allergies : createdData.patient?.allergies ? [createdData.patient.allergies] : [],
                 medications: Array.isArray(createdData.patient?.medications) ? createdData.patient.medications : createdData.patient?.medications ? [createdData.patient.medications] : [],
                 diseases: Array.isArray(createdData.patient?.diseases) ? createdData.patient.diseases : createdData.patient?.diseases ? [createdData.patient.diseases] : [],
                 age: calculateAge(createdData.patient?.dateOfBirth || createPatientData.dateOfBirth),
                 testResults: createdData.patient?.testResults || [],
                 medicalImagesSummary: createdData.patient?.medicalImagesSummary || [],
                 lastUpdated: new Date(),
                 updatedBy: createdData.patient?.updatedBy,
                 createdAt: createdData.patient?.createdAt ? new Date(createdData.patient.createdAt) : new Date(),
                 updatedAt: createdData.patient?.updatedAt ? new Date(createdData.patient.updatedAt) : new Date(),
                 status: 'Active',
                 userId: user.id,
                 dob: createdData.patient?.dateOfBirth || createPatientData.dateOfBirth,
                 bloodType: createdData.patient?.bloodGroup || createPatientData.bloodGroup
               };
               
               setPatients([createdPatient]);
             } else {
               console.error('❌ Failed to create patient profile:', createResponse.status);
               setPatients([]);
             }
           } catch (error) {
             console.error('❌ Error creating patient profile:', error);
             setPatients([]);
           }
         }
      } else {
        // If user is admin/doctor, fetch all patients
        const response = await fetch(`${API_BASE_URL}/patients/`, {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Transform backend patient data to frontend format
          const rawPatients = data.patients || data;
          const transformedPatients: Patient[] = rawPatients.map((patientData: any) => ({
            _id: patientData._id,
            user: patientData.user?._id || patientData.user,
            hospital: patientData.hospital?._id || patientData.hospital,
            mrn: patientData.mrn,
            name: `${patientData.user?.firstName || ''} ${patientData.user?.lastName || ''}`.trim(),
            nationalId: patientData.user?.nationalId || 'N/A',
            dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : undefined,
            gender: patientData.gender,
            bloodGroup: patientData.bloodGroup,
            hasBloodType: patientData.hasBloodType,
            email: patientData.user?.email || 'N/A',
            phone: patientData.user?.contactNumber || 'N/A',
            address: patientData.address || 'N/A',
            emergencyContact: patientData.emergencyContactPhone || 'N/A',
            emergencyContactName: patientData.emergencyContactName,
            emergencyContactPhone: patientData.emergencyContactPhone,
            emergencyContactRelation: patientData.emergencyContactRelation,
            medicalHistory: patientData.medicalHistory || 'No significant history',
            allergies: Array.isArray(patientData.allergies) ? patientData.allergies : patientData.allergies ? [patientData.allergies] : [],
            medications: Array.isArray(patientData.medications) ? patientData.medications : patientData.medications ? [patientData.medications] : [],
            diseases: Array.isArray(patientData.diseases) ? patientData.diseases : patientData.diseases ? [patientData.diseases] : [],
            age: calculateAge(patientData.dateOfBirth),
            testResults: patientData.testResults || [],
            medicalImagesSummary: patientData.medicalImagesSummary || [],
            lastUpdated: new Date(),
            updatedBy: patientData.updatedBy,
            createdAt: patientData.createdAt ? new Date(patientData.createdAt) : new Date(),
            updatedAt: patientData.updatedAt ? new Date(patientData.updatedAt) : new Date(),
            status: 'Active',
            userId: patientData.user?._id || patientData.user,
            dob: patientData.dateOfBirth,
            bloodType: patientData.bloodGroup
          }));
          
          setPatients(transformedPatients);
                 } else {
           // For now, use mock data if API fails
           console.warn('Patient API failed, using mock data');
           const mockPatients: Patient[] = [
             {
               _id: '1',
               user: '1',
               hospital: 'default',
               name: 'John Doe',
               mrn: 'MRN000001',
               nationalId: 'ID123456',
               dateOfBirth: new Date('1990-01-01'),
               dob: '1990-01-01',
               phone: '+1-555-0123',
               bloodGroup: 'O+',
               bloodType: 'O+',
               hasBloodType: true,
               userId: '1',
               age: 35,
               gender: 'Male',
               status: 'Active',
               lastUpdated: new Date(),
               medicalHistory: 'No significant history',
               allergies: [],
               medications: [],
               diseases: [],
               testResults: [],
               medicalImagesSummary: [],
               createdAt: new Date(),
               updatedAt: new Date(),
               emergencyContact: '+1-555-0123'
             }
           ];
           setPatients(mockPatients);
         }
       }
     } catch (error) {
      console.error('Error fetching patients:', error);
      // Use mock data as fallback
      const mockPatients: Patient[] = [
        {
          _id: '1',
          user: '1',
          hospital: 'default',
          name: 'John Doe',
          mrn: 'MRN000001',
          nationalId: 'ID123456',
          dateOfBirth: new Date('1990-01-01'),
          dob: '1990-01-01',
          phone: '+1-555-0123',
          bloodGroup: 'O+',
          bloodType: 'O+',
          hasBloodType: true,
          userId: '1',
          age: 35,
          gender: 'Male',
          status: 'Active',
          lastUpdated: new Date(),
          medicalHistory: 'No significant history',
          allergies: [],
          medications: [],
          diseases: [],
          testResults: [],
          medicalImagesSummary: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          emergencyContact: '+1-555-0123'
        }
      ];
      setPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  const getPatientById = (id: string): Patient | undefined => {
    return patients.find(patient => patient._id === id);
  };

  const getPatientByNID = (nid: string): Patient | undefined => {
    return patients.find(patient => patient.nationalId === nid);
  };

  const getPatientByMRN = (mrn: string): Patient | undefined => {
    return patients.find(patient => patient.mrn === mrn);
  };

  const getPatientsByUserId = (userId: string): Patient[] => {
    return patients.filter(patient => patient.userId === userId);
  };

  const addPatient = async (patientData: Omit<Patient, '_id'>): Promise<boolean> => {
    try {
      // Transform frontend patient data to backend format
      const backendPatientData = {
        user: {
          username: patientData.name?.toLowerCase().replace(/\s+/g, '.'),
          email: patientData.email || `${patientData.name?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          first_name: patientData.name?.split(' ')[0] || '',
          last_name: patientData.name?.split(' ').slice(1).join(' ') || '',
          national_id: patientData.nationalId,
          contact_number: patientData.phone,
          date_of_birth: patientData.dob,
          gender: patientData.gender,
          address: patientData.address,
          status: patientData.status
        },
        mrn: patientData.mrn,
        blood_group: patientData.bloodType,
        has_blood_type: patientData.hasBloodType,
        medical_history: patientData.medicalHistory,
        allergies: Array.isArray(patientData.allergies) ? patientData.allergies : (patientData.allergies ? [patientData.allergies] : []),
        medications: Array.isArray(patientData.medications) ? patientData.medications : (patientData.medications ? [patientData.medications] : []),
        emergency_contact_name: patientData.emergencyContact,
        emergency_contact_phone: patientData.emergencyContact
      };

      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPatientData),
      });

      if (response.ok) {
        await fetchPatients(); // Refresh the list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add patient');
        return false;
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      setError('Failed to add patient');
      return false;
    }
  };

  const updatePatient = async (patientData: Patient): Promise<boolean> => {
    try {
      // Transform frontend patient data to backend format
      const backendPatientData = {
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
        bloodGroup: patientData.bloodGroup,
        hasBloodType: patientData.hasBloodType,
        diseases: Array.isArray(patientData.diseases) ? patientData.diseases : (patientData.diseases ? [patientData.diseases] : []),
        allergies: Array.isArray(patientData.allergies) ? patientData.allergies : (patientData.allergies ? [patientData.allergies] : []),
        medications: Array.isArray(patientData.medications) ? patientData.medications : (patientData.medications ? [patientData.medications] : []),
        medicalHistory: patientData.medicalHistory,
        address: patientData.address,
        emergencyContactName: patientData.emergencyContactName,
        emergencyContactPhone: patientData.emergencyContactPhone,
        emergencyContactRelation: patientData.emergencyContactRelation
      };

      const response = await fetch(`${API_BASE_URL}/patients/${patientData._id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(backendPatientData),
      });

      if (response.ok) {
        await fetchPatients(); // Refresh the list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update patient');
        return false;
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      setError('Failed to update patient');
      return false;
    }
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchPatients(); // Refresh the list
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete patient');
        return false;
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Failed to delete patient');
      return false;
    }
  };

  // Load patients on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const value: PatientContextType = {
    patients,
    loading,
    error,
    fetchPatients,
    getPatientById,
    getPatientByNID,
    getPatientByMRN,
    getPatientsByUserId,
    addPatient,
    updatePatient,
    deletePatient
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};
