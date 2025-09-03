import { useState, useEffect, useRef } from 'react';
import {
  UserIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  EyeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  TrashIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfileForm from './UserProfileForm';
import MedicalDataForm from './MedicalDataForm';
import HealthProfile from './HealthProfile';

interface QuestionnaireData {
  _id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  email: string;
  nid: string;
  bloodType: string;
  height?: string;
  weight?: string;
  emergencyContact: string;
  emergencyPhone: string;
  relationship: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  previousSurgeries?: string;
  smoking: string;
  alcohol: string;
  exercise: string;
  diet: string;
  completedAt: Date;
}

interface PatientData {
  user?: {
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    email?: string;
    nationalId?: string;
    _id?: string;
  };
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  nid?: string;
  mrn?: string;
  blood_type?: string;
  address?: string;
  height?: string;
  weight?: string;
  gender?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  emergency_contact_relationship?: string;
  emergency_contacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }>;
  diseases?: string[];
  allergies?: any[];
  medications?: any[];
  medical_history_text?: string;
  recent_visits?: any[];
  user_code?: string;
}

const UserPanel: React.FC = () => {
  const { user } = useAuth() as { user: any };
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showMedicalDataForm, setShowMedicalDataForm] = useState(false);
  const [editingEmergencyContact, setEditingEmergencyContact] = useState(false);
  const [emergencyContactData, setEmergencyContactData] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileSortOrder, setFileSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visitSortOrder, setVisitSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Check if user has completed initial setup
  useEffect(() => {
    if (user && user.initialSetupCompleted === false) {
      navigate('/user/initial-setup');
    }
  }, [user, navigate]);

  // Function to fetch patient data
  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching patient data from backend...');
      
      const token = localStorage.getItem('medlink_token');
      const storedUser = localStorage.getItem('medlink_user');
      
      console.log('🔍 Stored token:', !!token);
      console.log('🔍 Stored user data:', storedUser);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('🔍 Parsed user data:', parsedUser);
          console.log('🔍 Stored user role:', parsedUser.role);
        } catch (e) {
          console.log('🔍 Error parsing stored user data:', e);
        }
      }
      
      if (!token) {
        console.error('No auth token found');
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      // First, get the current user's profile to understand their role
      let profileResponse;
      try {
        profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('❌ Network error fetching profile:', error);
        setError('Network error: Unable to connect to server. Please try again.');
        setLoading(false);
        return;
      }

      if (!profileResponse.ok) {
        console.error('❌ Profile response not ok:', profileResponse.status, profileResponse.statusText);
        if (profileResponse.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError(`Failed to fetch user profile: ${profileResponse.status}`);
        }
        setLoading(false);
        return;
      }

      const userProfileResponse = await profileResponse.json();
      console.log('👤 User profile response:', userProfileResponse);
      
      // Extract user data from the response
      const userProfile = userProfileResponse.user || userProfileResponse;
      console.log('👤 User profile data:', userProfile);
      console.log('👤 User role:', userProfile.role);
      console.log('👤 User role type:', typeof userProfile.role);

      // If user is not a regular patient, redirect or show appropriate message
      if (userProfile.role !== 'user' && userProfile.role !== undefined) {
        console.log('❌ User role check failed. Expected: "user", Got:', userProfile.role);
        setError(`This panel is for patients only. You are logged in as a ${userProfile.role || 'unknown'}.`);
        setLoading(false);
        return;
      }
      
      console.log('✅ User role check passed. User is a patient.');

      // Now fetch the patient data
      let response;
      try {
        response = await fetch('http://localhost:5000/api/patients/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('❌ Network error fetching patient data:', error);
        setError('Network error: Unable to connect to server. Please try again.');
        setLoading(false);
        return;
      }
      
      console.log('📡 Backend response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Patient data received:', data);
        
        if (data.patient) {
          const patient = data.patient;
          console.log('✅ Patient data found:', patient);
          
          // Transform the patient data to match the expected format
          const transformedPatient = {
            ...patient,
            blood_type: patient.bloodGroup || 'Not specified',
            emergency_contacts: patient.emergencyContactName ? [{
              name: patient.emergencyContactName,
              relationship: patient.emergencyContactRelation || 'Emergency Contact',
              phone: patient.emergencyContactPhone || 'Not specified',
              email: 'Not specified'
            }] : [],
            // Additional fields from enhanced dump data
            address: patient.address || patient.user?.address || 'Not specified',
            emergency_contact_name: patient.emergencyContactName,
            emergency_contact_phone: patient.emergencyContactPhone,
            emergency_contact_relation: patient.emergencyContactRelation,
            medical_history_text: patient.medical_history,
            // User info from nested user object
            user: patient.user || {},
            // Map user fields for the form
            first_name: patient.user?.firstName || '',
            last_name: patient.user?.lastName || '',
            phone: patient.user?.contactNumber || '',
            email: patient.user?.email || '',
            nid: patient.user?.nationalId || '',
            height: patient.height || '',
            weight: patient.weight || '',
            // Map emergency contact fields for the form
            emergency_contact_relationship: patient.emergencyContactRelation || '',
            // Map date format for the form
            date_of_birth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
            // Map user code
            user_code: patient.user_code || `MED-${patient.user?._id?.toString().slice(-6).padStart(6, '0') || Date.now().toString(36)}`
          };
          
          setPatientData(transformedPatient);
        } else {
          console.log('ℹ️ No patient data found for this user - should show profile form');
          setPatientData(null);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to fetch patient data:', response.status, errorText);
        setError(`Failed to fetch patient data: ${response.status}`);
      }
    } catch (err) {
      console.error('❌ Error fetching patient data:', err);
      setError('Failed to load patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient data from backend
  useEffect(() => {
    fetchPatientData();
  }, []);


  // Fetch uploaded files when component mounts
  useEffect(() => {
    if (patientData) {
      fetchUploadedFiles();
    }
  }, [patientData]);

  // Fetch prescriptions when component mounts
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Fetch questionnaire data when component mounts
  useEffect(() => {
    fetchQuestionnaireData();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoadingPrescriptions(true);
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/prescriptions/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Prescriptions loaded:', data);
        setPrescriptions(data.data || []);
      } else {
        console.error('❌ Failed to load prescriptions:', data);
      }
    } catch (error) {
      console.error('❌ Load prescriptions error:', error);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const fetchQuestionnaireData = async () => {
    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/questionnaire/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Questionnaire data loaded:', data);
        setQuestionnaireData(data.questionnaire || data);
      } else {
        console.log('ℹ️ No questionnaire data found or error:', data);
        // It's okay if no questionnaire exists
      }
    } catch (error) {
      console.error('❌ Load questionnaire error:', error);
      // Don't set error state for questionnaire as it's optional
    }
  };

  // Handle emergency contact editing
  const handleEditEmergencyContact = (contact: any) => {
    setEmergencyContactData({
      name: contact.name || '',
      phone: contact.phone || '',
      relationship: contact.relationship || ''
    });
    setEditingEmergencyContact(true);
  };

  // Handle saving emergency contact
  const handleSaveEmergencyContact = async () => {
    try {
      if (!emergencyContactData.name || !emergencyContactData.phone) {
        alert('Please fill in contact name and phone number');
        return;
      }

      const token = localStorage.getItem('medlink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Get current patient data
      const getResponse = await fetch('http://localhost:5000/api/patients/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!getResponse.ok) {
        throw new Error('Failed to get current patient data');
      }

      const currentPatient = await getResponse.json();
      
      // Update patient data with new emergency contact
      const updateData = {
        emergencyContactName: emergencyContactData.name,
        emergencyContactPhone: emergencyContactData.phone,
        emergencyContactRelation: emergencyContactData.relationship
      };

      const updateResponse = await fetch(`http://localhost:5000/api/patients/${currentPatient.patient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (updateResponse.ok) {
        // Fetch updated patient data from backend to ensure consistency
        const refreshResponse = await fetch('http://localhost:5000/api/patients/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (refreshResponse.ok) {
          const updatedData = await refreshResponse.json();
          const updatedPatient = updatedData.patient;
          
          // Transform the updated data
          const transformedPatient = {
            ...updatedPatient,
            blood_type: updatedPatient.bloodGroup || 'Not specified',
            emergency_contacts: updatedPatient.emergencyContactName ? [{
              name: updatedPatient.emergencyContactName,
              relationship: updatedPatient.emergencyContactRelation || 'Emergency Contact',
              phone: updatedPatient.emergencyContactPhone || 'Not specified',
              email: 'Not specified'
            }] : [],
            emergency_contact_name: updatedPatient.emergencyContactName,
            emergency_contact_phone: updatedPatient.emergencyContactPhone,
            emergency_contact_relation: updatedPatient.emergencyContactRelation,
            address: updatedPatient.address || 'Not specified',
            user: (updatedPatient as any).user || patientData?.user || {}
          };
          
          setPatientData(transformedPatient);
        }
        
        setEditingEmergencyContact(false);
        setEmergencyContactData({ name: '', phone: '', relationship: '' });
        
        console.log('✅ Emergency contact updated successfully');
      } else {
        throw new Error('Failed to update emergency contact');
      }
    } catch (error) {
      console.error('❌ Error saving emergency contact:', error);
      alert('Failed to save emergency contact. Please try again.');
    }
  };

  // File upload functions
  const fetchUploadedFiles = async () => {
    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/files/my-files', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid file type (JPEG, PNG, GIF, WebP, or PDF)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setUploadingFile(true);
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        // Refresh the file list
        await fetchUploadedFiles();
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('File deleted successfully');
        // Refresh the file list
        await fetchUploadedFiles();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDownloadFile = async (fileId: string, filename: string) => {
    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:5000/api/files/download/${fileId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const openImageModal = (fileId: string) => {
    // Find the file in uploadedFiles array to get the Cloudinary URL
    const file = uploadedFiles.find((f: any) => f.id === fileId);
    if (file && file.image) {
      setSelectedImage(file.image); // Use Cloudinary URL directly
      setShowImageModal(true);
    } else {
      console.error('Image URL not found for file:', fileId);
      alert('Image not available');
    }
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  // Sort uploaded files by date
  const sortedUploadedFiles = [...uploadedFiles].sort((a: any, b: any) => {
    const dateA = new Date(a.uploadedAt).getTime();
    const dateB = new Date(b.uploadedAt).getTime();
    return fileSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Sort recent visits by date
  const sortedRecentVisits = patientData?.recent_visits ? [...patientData.recent_visits].sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return visitSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  }) : [];

  // Handle profile form submission
  const handleProfileSave = async (profileData: any) => {
    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('🔍 Attempting to save profile data:', profileData);
      
      // First, update user data if provided
      if (profileData.first_name || profileData.last_name || profileData.phone) {
        try {
          const userUpdateData = {
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            contactNumber: profileData.phone || profileData.contact_number
          };

          console.log('🔍 Updating user data:', userUpdateData);
          
          const userResponse = await fetch('http://localhost:5000/api/auth/update-profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userUpdateData)
          });

          if (userResponse.ok) {
            console.log('✅ User data updated successfully');
          } else {
            console.warn('⚠️ Failed to update user data, continuing with patient data...');
          }
        } catch (userError) {
          console.warn('⚠️ Error updating user data:', userError);
        }
      }
      
      // Prepare patient data
      const patientData = {
        dateOfBirth: new Date(profileData.date_of_birth), // Convert string to Date
        gender: profileData.gender,
        bloodGroup: profileData.blood_group && profileData.blood_group !== 'Not specified' ? profileData.blood_group : 'A+',
        hasBloodType: true,
        diseases: [],
        allergies: [],
        address: profileData.address || 'N/A',
        emergencyContactName: profileData.emergency_contact_name || 'N/A',
        emergencyContactPhone: profileData.emergency_contact_phone || 'N/A',
        emergencyContactRelation: profileData.emergency_contact_relationship || 'Emergency Contact',
        medications: []
      };

      console.log('🔍 Prepared patient data:', patientData);

      let response;
      let savedData;

      // First, try to get the existing patient profile
      try {
        console.log('🔍 Checking for existing patient profile...');
        const getResponse = await fetch('http://localhost:5000/api/patients/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (getResponse.ok) {
          // Patient profile exists, update it
          const existingPatient = await getResponse.json();
          console.log('🔍 Found existing patient:', existingPatient);
          
          response = await fetch(`http://localhost:5000/api/patients/${existingPatient.patient._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patientData)
          });
        } else if (getResponse.status === 404) {
          // Patient profile doesn't exist, create new one
          console.log('🔍 No existing patient profile found, creating new one...');
          response = await fetch('http://localhost:5000/api/patients/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patientData)
          });
        } else {
          throw new Error(`Failed to check patient profile: ${getResponse.status}`);
        }
      } catch (error) {
        console.error('❌ Error checking patient profile:', error);
        throw error;
      }

      console.log('📡 Backend response status:', response.status);

      if (response.ok) {
        savedData = await response.json();
        console.log('✅ Profile saved successfully:', savedData);
        
        // Transform and update patient data with real-time updates
        const updatedPatient = savedData.patient || savedData;
        const transformedPatient = {
          ...updatedPatient,
          blood_type: updatedPatient.bloodGroup && updatedPatient.bloodGroup !== 'Not specified' ? updatedPatient.bloodGroup : 'A+',
          emergency_contacts: updatedPatient.emergencyContactName ? [{
            name: updatedPatient.emergencyContactName,
            relationship: updatedPatient.emergencyContactRelation || 'Emergency Contact',
            phone: updatedPatient.emergencyContactPhone || 'Not specified',
            email: 'Not specified'
          }] : [],
          emergency_contact_name: updatedPatient.emergencyContactName,
          emergency_contact_phone: updatedPatient.emergencyContactPhone,
          emergency_contact_relation: updatedPatient.emergencyContactRelation,
          address: updatedPatient.address || 'Not specified',
          user: (updatedPatient as any).user || (patientData as any)?.user || {},
          // Map user fields for the form
          first_name: (updatedPatient as any).user?.firstName || '',
          last_name: (updatedPatient as any).user?.lastName || '',
          phone: (updatedPatient as any).user?.contactNumber || '',
          email: (updatedPatient as any).user?.email || '',
          nid: (updatedPatient as any).user?.nationalId || '',
          height: updatedPatient.height || '',
          weight: updatedPatient.weight || '',
          // Map emergency contact fields for the form
          emergency_contact_relationship: updatedPatient.emergencyContactRelation || '',
                        // Map date format for the form
              date_of_birth: updatedPatient.dateOfBirth ? new Date(updatedPatient.dateOfBirth).toISOString().split('T')[0] : '',
              // Map user code
              user_code: updatedPatient.user_code || `MED-${(updatedPatient as any).user?._id?.toString().slice(-6).padStart(6, '0') || Date.now().toString(36)}`
        };
        
        setPatientData(transformedPatient);
        setShowProfileForm(false);
      } else {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        console.error('❌ Response status:', response.status);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your medical information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show profile form if no patient data or user wants to create profile
  if (!loading && (!patientData || showProfileForm)) {
    console.log('🔄 Showing UserProfileForm - patientData:', patientData, 'showProfileForm:', showProfileForm);
    return <UserProfileForm 
      onSave={handleProfileSave} 
      onCancel={() => setShowProfileForm(false)} 
      initialData={patientData || undefined}
    />;
  }

  // Ensure patientData is not null before rendering
  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Patient Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Patient data not found. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border-b border-blue-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UserIcon className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Health Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive view of your medical information
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowMedicalDataForm(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 text-sm rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <HeartIcon className="h-5 w-5 mr-2" />
                <span>Medical Data</span>
              </button>
              <button
                onClick={() => setShowProfileForm(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 text-sm rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 text-sm rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button
                onClick={() => navigate('/auth/logout')}
                className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 text-sm rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <LockClosedIcon className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Patient Info Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="bg-blue-100 dark:bg-blue-800 p-2 sm:p-3 rounded-full flex-shrink-0">
                <UserIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {patientData.first_name || patientData.user?.firstName} {patientData.last_name || patientData.user?.lastName}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
                  <span className="inline sm:hidden">ID: {patientData.mrn || 'N/A'}</span>
                  <span className="hidden sm:inline">Patient ID: {patientData.mrn || 'Not assigned'} | NID: {patientData.nid || patientData.user?.nationalId || 'Not specified'}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <IdentificationIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Blood Group:</strong> {patientData.blood_type || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Contact:</strong> {patientData.phone || patientData.user?.contactNumber || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Address:</strong> {patientData.address || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>DOB:</strong> {patientData.date_of_birth ? new Date(patientData.date_of_birth).toLocaleDateString() : 'Not specified'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Gender:</strong> {patientData.gender || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Health Profile Section */}
        {questionnaireData && (
          <HealthProfile 
            profileData={{
              lifestyle: {
                smoking: questionnaireData.smoking || 'never',
                alcohol: questionnaireData.alcohol || 'never',
                exercise: questionnaireData.exercise || 'light',
                diet: questionnaireData.diet || 'balanced'
              },
              medicalHistory: {
                allergies: questionnaireData.allergies || 'None reported',
                medications: questionnaireData.currentMedications || 'None reported',
                chronicConditions: questionnaireData.chronicConditions || 'None reported',
                previousSurgeries: questionnaireData.previousSurgeries || 'None reported'
              },
              physicalInfo: {
                height: questionnaireData.height || patientData.height || 'Not specified',
                weight: questionnaireData.weight || patientData.weight || 'Not specified',
                bloodType: patientData.blood_type || 'Not specified'
              },
              completedDate: new Date(questionnaireData.completedAt).toLocaleDateString()
            }}
          />
        )}

        {/* Fallback Questionnaire Data Section */}
        {questionnaireData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              Initial Health Profile
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full">
                Completed {questionnaireData.completedAt ? new Date(questionnaireData.completedAt).toLocaleDateString() : 'N/A'}
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Lifestyle Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Lifestyle</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Smoking:</strong> {questionnaireData.smoking || 'Not specified'}</div>
                  <div><strong>Alcohol:</strong> {questionnaireData.alcohol || 'Not specified'}</div>
                  <div><strong>Exercise:</strong> {questionnaireData.exercise || 'Not specified'}</div>
                  <div><strong>Diet:</strong> {questionnaireData.diet || 'Not specified'}</div>
                </div>
              </div>
              
              {/* Medical History from Questionnaire */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Medical History</h4>
                <div className="space-y-2 text-sm">
                  {questionnaireData?.allergies && (
                    <div><strong>Allergies:</strong> {questionnaireData.allergies}</div>
                  )}
                  {questionnaireData?.currentMedications && (
                    <div><strong>Medications:</strong> {questionnaireData.currentMedications}</div>
                  )}
                  {questionnaireData?.chronicConditions && (
                    <div><strong>Chronic Conditions:</strong> {questionnaireData.chronicConditions}</div>
                  )}
                  {questionnaireData?.previousSurgeries && (
                    <div><strong>Previous Surgeries:</strong> {questionnaireData.previousSurgeries}</div>
                  )}
                </div>
              </div>
              
              {/* Physical Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300">Physical Info</h4>
                <div className="space-y-2 text-sm">
                  {questionnaireData?.height && (
                    <div><strong>Height:</strong> {questionnaireData.height} cm</div>
                  )}
                  {questionnaireData?.weight && (
                    <div><strong>Weight:</strong> {questionnaireData.weight} kg</div>
                  )}
                  <div><strong>Blood Type:</strong> {questionnaireData?.bloodType || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact Section */}
        {patientData.emergency_contact_name && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  <strong>Name:</strong> {patientData.emergency_contact_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-300">
                  <strong>Phone:</strong> {patientData.emergency_contact_phone}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm text-green-700 dark:text-green-300">
                  <strong>Relationship:</strong> {patientData.emergency_contact_relationship || 'Emergency Contact'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <HeartIcon className="h-6 w-6 text-red-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Blood Type</p>
                <p className="font-semibold text-gray-900 dark:text-white">{patientData.blood_type || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conditions</p>
                <p className="font-semibold text-gray-900 dark:text-white">{patientData.diseases?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <BeakerIcon className="h-6 w-6 text-blue-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Medications</p>
                <p className="font-semibold text-gray-900 dark:text-white">{patientData.medications?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-2" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allergies</p>
                <p className="font-semibold text-gray-900 dark:text-white">{patientData.allergies?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Current Conditions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <HeartIcon className="h-6 w-6 mr-2 text-red-600" />
                Current Conditions
              </h2>
              <button
                onClick={() => setShowMedicalDataForm(true)}
                className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                title="Add/Manage Conditions"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            {patientData.diseases && patientData.diseases.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {patientData.diseases.map((disease: string, index: number) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-800 dark:text-red-200 font-medium text-sm sm:text-base">{disease}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base">No conditions recorded</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <BeakerIcon className="h-6 w-6 mr-2 text-blue-600" />
                Current Medications
              </h2>
              <button
                onClick={() => setShowMedicalDataForm(true)}
                className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                title="Add/Manage Medications"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            {patientData.medications && patientData.medications.length > 0 ? (
              <div className="space-y-3">
                {patientData.medications.map((medication: any, index: number) => (
                  <div key={index} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      {typeof medication === 'string' ? medication : medication.name}
                    </p>
                    <EyeIcon className="h-4 w-4 text-blue-600" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base">No medications recorded</p>
            )}
          </div>

          {/* Allergies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-yellow-600" />
                Allergies
              </h2>
              <button
                onClick={() => setShowMedicalDataForm(true)}
                className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors duration-200"
                title="Add/Manage Allergies"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            {patientData.allergies && patientData.allergies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {patientData.allergies.map((allergy: any, index: number) => (
                  <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium text-sm sm:text-base">
                      {typeof allergy === 'string' ? allergy : allergy.allergen}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm sm:text-base">No allergies recorded</p>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <PhoneIcon className="h-6 w-6 mr-2 text-green-600" />
              Emergency Contacts
            </h2>
            {editingEmergencyContact ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={emergencyContactData.name}
                      onChange={(e) => setEmergencyContactData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={emergencyContactData.phone}
                      onChange={(e) => setEmergencyContactData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Relationship
                    </label>
                    <select
                      value={emergencyContactData.relationship}
                      onChange={(e) => setEmergencyContactData(prev => ({ ...prev, relationship: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEmergencyContact}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save Contact
                  </button>
                  <button
                    onClick={() => {
                      setEditingEmergencyContact(false);
                      setEmergencyContactData({ name: '', phone: '', relationship: '' });
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {patientData.emergency_contacts && patientData.emergency_contacts.length > 0 ? (
                  <div className="space-y-3">
                    {patientData.emergency_contacts.map((contact: any, index: number) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">{contact.name}</p>
                          <p className="text-sm text-green-700 dark:text-green-300">{contact.relationship}</p>
                          <p className="text-sm text-green-700 dark:text-green-300">{contact.phone}</p>
                        </div>
                        <button
                          onClick={() => handleEditEmergencyContact(contact)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No emergency contacts recorded</p>
                )}
                <button
                  onClick={() => {
                    setEditingEmergencyContact(true);
                    setEmergencyContactData({ name: '', phone: '', relationship: '' });
                  }}
                  className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {patientData.emergency_contacts && patientData.emergency_contacts.length > 0 ? 'Add Another Contact' : 'Add Emergency Contact'}
                </button>
              </div>
            )}
          </div>

          {/* Medical History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-purple-600" />
                Medical History
              </h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
              >
                <PhotoIcon className="h-4 w-4 mr-2" />
                {uploadingFile ? 'Uploading...' : 'Upload Report'}
              </button>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Medical History Text */}
            {patientData.medical_history_text ? (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
                <p className="text-purple-800 dark:text-purple-200">{patientData.medical_history_text}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 mb-4">No medical history recorded</p>
            )}
            
            {/* Uploaded Files Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <DocumentIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Medical Reports & Images
                </h3>
                {uploadedFiles.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                    <select
                      value={fileSortOrder}
                      onChange={(e) => setFileSortOrder(e.target.value as 'newest' | 'oldest')}
                      className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="newest">Recent to Oldest</option>
                      <option value="oldest">Oldest to Recent</option>
                    </select>
                  </div>
                )}
              </div>
              
              {uploadedFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {sortedUploadedFiles.map((file) => (
                    <div key={file.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 w-full max-w-sm mx-auto md:mx-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="flex items-center min-w-0 flex-1">
                          {file.fileType === 'image' ? (
                            <PhotoIcon className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                          ) : (
                            <DocumentIcon className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                          )}
                          <span className="text-xs font-medium text-gray-900 dark:text-white truncate" title={file.filename}>
                            {file.filename}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 flex-shrink-0 p-1"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                      
                      {/* Image thumbnail preview */}
                      {file.fileType === 'image' && file.image && (
                        <div className="mb-2 relative group">
                          <div className="relative w-full h-28 sm:h-32 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                            <img
                              src={file.image}
                              alt={file.filename}
                              className="absolute inset-0 w-full h-full object-contain cursor-pointer transition-all duration-200 group-hover:scale-105"
                              onClick={() => openImageModal(file.id)}
                              onError={(e) => {
                                console.error('Failed to load image:', file.image);
                                const target = e.currentTarget;
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg">
                                      <svg class="h-6 w-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                      <span class="text-xs text-gray-500 text-center px-1">Image not available</span>
                                    </div>
                                  `;
                                }
                              }}
                              loading="lazy"
                              style={{
                                imageRendering: 'auto',
                                objectPosition: 'center'
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <EyeIcon className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {file.fileType === 'image' && (
                          <button
                            onClick={() => openImageModal(file.id)}
                            className="flex-1 bg-blue-600 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center min-w-0"
                          >
                            <EyeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">View</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadFile(file.id, file.filename)}
                          className="flex-1 bg-green-600 text-white px-2 py-1.5 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center min-w-0"
                        >
                          <svg className="h-3 w-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="truncate">Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No medical reports uploaded</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Upload medical reports, X-rays, lab results, and other medical documents for easy access.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center mx-auto"
                  >
                    <PhotoIcon className="h-4 w-4 mr-2" />
                    Upload First Report
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-purple-600" />
                My Prescriptions
              </h2>
            </div>
            
            {loadingPrescriptions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading prescriptions...</p>
              </div>
            ) : prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map((prescription: any) => (
                  <div key={prescription._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Prescribed by Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {prescription.doctorId?.specialization && `(${prescription.doctorId.specialization})`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(prescription.prescribedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' : 
                        prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Diagnosis:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{prescription.diagnosis}</p>
                    </div>
                    
                    {prescription.notes && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Notes:</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{prescription.notes}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Medicines:</h4>
                      <div className="space-y-2">
                        {prescription.medicines?.map((medicine: any, index: number) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white">{medicine.name}</h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{medicine.dosage}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <div>
                                <span className="font-medium">Frequency:</span> {medicine.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {medicine.duration}
                              </div>
                            </div>
                            {medicine.instructions && (
                              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Instructions:</span> {medicine.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No prescriptions found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your prescriptions from doctors will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-purple-600" />
                Recent Activity
              </h2>
              {patientData.recent_visits && patientData.recent_visits.length > 0 && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                  <select
                    value={visitSortOrder}
                    onChange={(e) => setVisitSortOrder(e.target.value as 'newest' | 'oldest')}
                    className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="newest">Recent to Oldest</option>
                    <option value="oldest">Oldest to Recent</option>
                  </select>
                </div>
              )}
            </div>
            {patientData.recent_visits && patientData.recent_visits.length > 0 ? (
              <div className="space-y-4">
                {sortedRecentVisits.map((visit: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{visit.reason}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(visit.date).toLocaleDateString()} - {visit.diagnosis}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent visits recorded</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute -top-12 right-0 sm:-top-14 sm:-right-2 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 sm:p-3 transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            
            {/* Image container with loading state */}
            <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
              <img
                src={selectedImage}
                alt="Medical report"
                className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
                style={{
                  imageRendering: 'auto' as const,
                  minWidth: '200px',
                  minHeight: '200px'
                }}
                onLoad={(e) => {
                  // Remove loading state when image loads
                  const loadingDiv = e.currentTarget.parentElement?.querySelector('.loading-placeholder');
                  if (loadingDiv) {
                    loadingDiv.remove();
                  }
                }}
                onError={(e) => {
                  console.error('Failed to load image in modal:', selectedImage);
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center w-96 h-64 bg-gray-100 rounded-lg">
                        <svg class="h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <span class="text-gray-600 text-lg font-medium mb-2">Image not available</span>
                        <span class="text-gray-500 text-sm text-center px-4">The medical report image could not be loaded. Please try refreshing or contact support.</span>
                      </div>
                    `;
                  }
                }}
              />
              
              {/* Loading placeholder */}
              <div className="loading-placeholder absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <span className="text-gray-600 text-sm">Loading image...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Data Form Modal */}
              {showMedicalDataForm && (
          <MedicalDataForm 
            onClose={() => setShowMedicalDataForm(false)} 
            onDataUpdated={fetchPatientData}
          />
        )}
    </div>
  );
};

export default UserPanel;
