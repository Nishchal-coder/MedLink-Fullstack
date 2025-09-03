import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, API_CONFIG } from '../config/api';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HeartIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
  status: string;
  role: string;
  questionnaireData?: {
    bloodType: string;
    height: string;
    weight: string;
    emergencyContact: string;
    emergencyPhone: string;
    relationship: string;
    allergies: string;
    currentMedications: string;
    chronicConditions: string;
    previousSurgeries: string;
    smoking: string;
    alcohol: string;
    exercise: string;
    diet: string;
    completedAt: string;
  };
  patientData?: {
    mrn: string;
    bloodGroup: string;
    hasBloodType: boolean;
    height: string;
    weight: string;
    diseases: string[];
    allergies: string[];
    medications: string[];
    medicalHistory: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    testResults: any[];
    medicalImagesSummary: any[];
    lastUpdated: string;
  };
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const DoctorPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [searchNID, setSearchNID] = useState('');
  const [searchResult, setSearchResult] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const clearSearch = useCallback(() => {
    setSearchNID('');
    setSearchResult(null);
    setSearchError('');
  }, []);

  // Debug user data - only log once when component mounts
  useEffect(() => {
    if (user) {
      console.log('🔍 DoctorPortal - Current user data:', user);
      console.log('🔍 DoctorPortal - User role:', user?.role);
      console.log('🔍 DoctorPortal - User name:', user?.firstName || user?.username);
    }
  }, []); // Empty dependency array to run only once

  const handleSearchByNID = useCallback(async () => {
    const trimmedNID = searchNID.trim();
    if (!trimmedNID) {
      setSearchError('Please enter a NID to search');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        setSearchError('No authentication token found. Please log in again.');
        setIsSearching(false);
        // Redirect to login
        window.location.href = '/login';
        return;
      }

      console.log(`🔍 Searching for NID: ${trimmedNID}`);

      const response = await fetch(getApiUrl(`/doctors/search/nid/${trimmedNID}`), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Search successful:', data);
        setSearchResult(data.data);
      } else {
        console.error('❌ Search failed:', data);
        
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          setSearchError('Authentication failed. Please log in again.');
          localStorage.removeItem('medlink_token');
          window.location.href = '/login';
          return;
        }
        
        setSearchError(data.error || 'Failed to search for user');
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      setSearchError('Network error occurred');
    } finally {
      setIsSearching(false);
    }
  }, [searchNID]);

  const updatePatient = useCallback(async (patientId: string, updateData: any) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(`🔧 Updating patient ${patientId}:`, updateData);

      const response = await fetch(getApiUrl(`/patients/${patientId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Patient updated successfully:', data);
        // Update the search result with new data
        setSearchResult(data.patient);
        return data.patient;
      } else {
        console.error('❌ Failed to update patient:', data);
        throw new Error(data.error || 'Failed to update patient');
      }
    } catch (error) {
      console.error('❌ Update patient error:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const loadPrescriptions = async () => {
    setIsLoadingPrescriptions(true);
    try {
      const token = localStorage.getItem('medlink_token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.GET_DOCTOR), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Prescriptions loaded:', data);
        console.log('📊 Number of prescriptions:', data.data?.length || 0);
        setPrescriptions(data.data || []);
      } else {
        console.error('❌ Failed to load prescriptions:', data);
        if (response.status === 403) {
          console.error('🔍 Hospital access issue - doctor may not have hospital assigned');
        }
      }
    } catch (error) {
      console.error('❌ Load prescriptions error:', error);
    } finally {
      setIsLoadingPrescriptions(false);
    }
  };



  // Load prescriptions when component mounts
  useEffect(() => {
    if (activeTab === 'prescriptions') {
      loadPrescriptions();
    }
  }, [activeTab]);

  const SearchPatient = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Patient by NID</h2>
        <p className="text-gray-600 mb-6">
          Enter the National ID (NID) of any patient to view their medical information.
        </p>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">💡 Test NIDs:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span className="text-blue-700">• 1234567890 (Blackiee Hero)</span>
            <span className="text-blue-700">• 78945612385 (CipherByte apple)</span>
            <span className="text-blue-700">• NIDd3650c001 (Jane Doe)</span>
            <span className="text-blue-700">• NID7e3b8f021 (Manoj Sapkota)</span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              National ID (NID)
            </label>
            <div className="relative">
              <IdentificationIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                key="search-nid-input"
                value={searchNID}
                onChange={(e) => setSearchNID(e.target.value)}
                placeholder="Enter NID (e.g., 1234567890)"
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByNID()}
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearchByNID}
              disabled={isSearching}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </button>
            {(searchNID || searchResult || searchError) && (
              <button
                onClick={clearSearch}
                className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 flex items-center"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {searchError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-700">{searchError}</span>
            </div>
          </div>
        )}
      </div>

      {searchResult && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{searchResult.firstName} {searchResult.lastName}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <IdentificationIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">National ID</p>
                    <p className="font-medium">{searchResult.nationalId}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{searchResult.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium">{searchResult.contactNumber || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{searchResult.address || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {searchResult.dateOfBirth ? new Date(searchResult.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium capitalize">{searchResult.gender}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Medical Information</h4>
                
                {searchResult.questionnaireData ? (
                  <>
                    <div className="flex items-center">
                      <HeartIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Blood Type</p>
                        <p className="font-medium">{searchResult.questionnaireData.bloodType}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Height & Weight</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.height && searchResult.questionnaireData.weight 
                          ? `${searchResult.questionnaireData.height}cm / ${searchResult.questionnaireData.weight}kg`
                          : 'Not recorded'
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Allergies</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.allergies || 'None recorded'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Current Medications</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.currentMedications || 'None recorded'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Chronic Conditions</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.chronicConditions || 'None recorded'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Previous Surgeries</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.previousSurgeries || 'None recorded'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Emergency Contact</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.emergencyContact
                          ? `${searchResult.questionnaireData.emergencyContact} (${searchResult.questionnaireData.relationship}) - ${searchResult.questionnaireData.emergencyPhone}`
                          : 'Not provided'
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Lifestyle Information</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Smoking:</span> 
                          <span className="font-medium capitalize ml-1">{searchResult.questionnaireData.smoking}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Alcohol:</span> 
                          <span className="font-medium capitalize ml-1">{searchResult.questionnaireData.alcohol}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Exercise:</span> 
                          <span className="font-medium capitalize ml-1">{searchResult.questionnaireData.exercise}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Diet:</span> 
                          <span className="font-medium capitalize ml-1">{searchResult.questionnaireData.diet}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Questionnaire Completed</p>
                      <p className="font-medium">
                        {searchResult.questionnaireData.completedAt ? new Date(searchResult.questionnaireData.completedAt).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No questionnaire data found for this patient</p>
                  </div>
                )}
              </div>
            </div>

                         {/* Action Buttons */}
             <div className="mt-6 flex gap-4">
               <button
                 onClick={() => {
                   setSelectedPatient(searchResult);
                   setShowPrescriptionModal(true);
                 }}
                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
               >
                 <PlusIcon className="h-4 w-4 mr-2" />
                 Add Prescription
               </button>
               
               <button
                 onClick={() => {
                   setEditingPatient(searchResult);
                   setShowEditModal(true);
                 }}
                 className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center"
               >
                 <PencilIcon className="h-4 w-4 mr-2" />
                 Edit Patient
               </button>
               
               <button
                 onClick={() => setActiveTab('prescriptions')}
                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
               >
                 <DocumentTextIcon className="h-4 w-4 mr-2" />
                 View Prescriptions
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );

  const Prescriptions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Prescription Management</h2>
        <button
          onClick={() => setShowPrescriptionModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Prescription
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NID</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor & Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicines</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingPrescriptions ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading prescriptions...</p>
                  </td>
                </tr>
              ) : prescriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions found</p>
                    <p className="text-sm text-gray-400 mt-2">Create your first prescription to get started</p>
                  </td>
                </tr>
              ) : (
                prescriptions.map((prescription: any) => (
                  <tr key={prescription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prescription.patientId?.firstName} {prescription.patientId?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prescription.patientNID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">
                          Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                        </div>
                        {prescription.doctorId?.specialization && (
                          <div className="text-xs text-gray-500">({prescription.doctorId.specialization})</div>
                        )}
                        {prescription.hospital && (
                          <div className="text-xs text-blue-600 font-medium">{prescription.hospital}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(prescription.prescribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {prescription.diagnosis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prescription.medicines?.length || 0} medicine(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' : 
                        prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => {
                          // TODO: Implement view prescription details
                          alert(`Prescription ID: ${prescription._id}\nDoctor: Dr. ${prescription.doctorId?.firstName} ${prescription.doctorId?.lastName}\nHospital: ${prescription.hospital || 'Not specified'}\nDiagnosis: ${prescription.diagnosis}\nMedicines: ${prescription.medicines?.length || 0}`);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PrescriptionModal = () => {
    const [formData, setFormData] = useState({
      diagnosis: '',
      notes: '',
      medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMedicineChange = (index: number, field: string, value: string) => {
      const newMedicines = [...formData.medicines];
      newMedicines[index] = { ...newMedicines[index], [field]: value };
      setFormData({ ...formData, medicines: newMedicines });
    };

    const addMedicine = () => {
      setFormData({
        ...formData,
        medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
      });
    };

    const removeMedicine = (index: number) => {
      if (formData.medicines.length > 1) {
        const newMedicines = formData.medicines.filter((_, i) => i !== index);
        setFormData({ ...formData, medicines: newMedicines });
      }
    };

    const handleSubmit = async () => {
      if (!selectedPatient || !formData.diagnosis.trim() || formData.medicines.some(m => !m.name.trim())) {
        alert('Please fill in all required fields');
        return;
      }

      setIsSubmitting(true);
      try {
        const token = localStorage.getItem('medlink_token');
        if (!token) {
          alert('No authentication token found. Please log in again.');
          // Redirect to login
          window.location.href = '/login';
          return;
        }

        const prescriptionData = {
          patientNID: selectedPatient.nationalId,
          diagnosis: formData.diagnosis,
          notes: formData.notes,
          medicines: formData.medicines.filter((m: { name: string; dosage: string; frequency: string; duration: string; instructions: string }) => m.name.trim())
        };

        console.log('🔍 Creating prescription with data:', prescriptionData);
        console.log('🔍 Using token:', token.substring(0, 20) + '...');

        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PRESCRIPTIONS.CREATE), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(prescriptionData)
        });

        console.log('📥 Response status:', response.status);
        console.log('📥 Response headers:', response.headers);

        const data = await response.json();
        console.log('📥 Response data:', data);

        if (response.ok) {
          console.log('✅ Prescription created:', data);
          alert('Prescription created successfully!');
          setShowPrescriptionModal(false);
          setFormData({ diagnosis: '', notes: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] });
          // Reload prescriptions
          loadPrescriptions();
        } else {
          console.error('❌ Failed to create prescription:', data);
          
          // Handle authentication errors
          if (response.status === 401 || response.status === 403) {
            alert('Authentication failed. Please log in again.');
            localStorage.removeItem('medlink_token');
            window.location.href = '/login';
            return;
          }
          
          alert(data.error || 'Failed to create prescription');
        }
      } catch (error) {
        console.error('❌ Create prescription error:', error);
        
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          alert('Network error: Unable to connect to the server. Please check your connection and try again.');
        } else {
          alert('Network error occurred');
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedPatient ? `New Prescription for ${selectedPatient.firstName} ${selectedPatient.lastName}` : 'New Prescription'}
              </h3>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient</label>
                <input
                  type="text"
                  value={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName} (${selectedPatient.nationalId})` : ''}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis *</label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter diagnosis..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Medicines *</h4>
                <div className="space-y-3">
                  {formData.medicines.map((medicine, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Medicine {index + 1}</span>
                        {formData.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Medicine Name *</label>
                          <input
                            type="text"
                            value={medicine.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="e.g., Amoxicillin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dosage *</label>
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="e.g., 500mg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Frequency *</label>
                          <input
                            type="text"
                            value={medicine.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="e.g., 3 times daily"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duration *</label>
                          <input
                            type="text"
                            value={medicine.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Instructions</label>
                        <input
                          type="text"
                          value={medicine.instructions}
                          onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="e.g., Take with food"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Another Medicine
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Prescription'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditPatientModal = () => {
    const [editFormData, setEditFormData] = useState({
      bloodGroup: editingPatient?.patientData?.bloodGroup || '',
      height: editingPatient?.patientData?.height || '',
      weight: editingPatient?.patientData?.weight || '',
      diseases: editingPatient?.patientData?.diseases || [],
      allergies: editingPatient?.patientData?.allergies || [],
      medications: editingPatient?.patientData?.medications || [],
      medicalHistory: editingPatient?.patientData?.medicalHistory || '',
      emergencyContactName: editingPatient?.patientData?.emergencyContactName || '',
      emergencyContactPhone: editingPatient?.patientData?.emergencyContactPhone || '',
      emergencyContactRelation: editingPatient?.patientData?.emergencyContactRelation || '',
      address: editingPatient?.address || ''
    });

    const handleEditSubmit = async () => {
      if (!editingPatient?.id) {
        alert('No patient selected for editing');
        return;
      }

      try {
        await updatePatient(editingPatient.id, editFormData);
        alert('Patient updated successfully!');
        setShowEditModal(false);
        setEditingPatient(null);
      } catch (error) {
        alert(`Failed to update patient: ${error}`);
      }
    };

    const addArrayItem = (field: string) => {
      const newItem = prompt(`Enter new ${field}:`);
      if (newItem && newItem.trim()) {
        setEditFormData(prev => ({
          ...prev,
          [field]: [...prev[field as keyof typeof prev], newItem.trim()]
        }));
      }
    };

    const removeArrayItem = (field: string, index: number) => {
      setEditFormData(prev => {
        const currentValue = prev[field as keyof typeof prev];
        if (Array.isArray(currentValue)) {
          return {
            ...prev,
            [field]: currentValue.filter((_: string, i: number) => i !== index)
          };
        }
        return prev;
      });
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
          <div className="mt-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Edit Patient: {editingPatient?.firstName} {editingPatient?.lastName}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  value={editFormData.bloodGroup}
                  onChange={(e) => setEditFormData({...editFormData, bloodGroup: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="text"
                  value={editFormData.height}
                  onChange={(e) => setEditFormData({...editFormData, height: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 170"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="text"
                  value={editFormData.weight}
                  onChange={(e) => setEditFormData({...editFormData, weight: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., 70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                <input
                  type="text"
                  value={editFormData.emergencyContactName}
                  onChange={(e) => setEditFormData({...editFormData, emergencyContactName: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={editFormData.emergencyContactPhone}
                  onChange={(e) => setEditFormData({...editFormData, emergencyContactPhone: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Emergency contact phone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact Relation</label>
                <input
                  type="text"
                  value={editFormData.emergencyContactRelation}
                  onChange={(e) => setEditFormData({...editFormData, emergencyContactRelation: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Spouse, Parent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <textarea
                  value={editFormData.medicalHistory}
                  onChange={(e) => setEditFormData({...editFormData, medicalHistory: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Enter medical history"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Diseases</label>
                <div className="mt-1">
                  {editFormData.diseases.map((disease, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={disease}
                        onChange={(e) => {
                          const newDiseases = [...editFormData.diseases];
                          newDiseases[index] = e.target.value;
                          setEditFormData({...editFormData, diseases: newDiseases});
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                      <button
                        onClick={() => removeArrayItem('diseases', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('diseases')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Disease
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                <div className="mt-1">
                  {editFormData.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => {
                          const newAllergies = [...editFormData.allergies];
                          newAllergies[index] = e.target.value;
                          setEditFormData({...editFormData, allergies: newAllergies});
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                      <button
                        onClick={() => removeArrayItem('allergies', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('allergies')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Allergy
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Current Medications</label>
                <div className="mt-1">
                  {editFormData.medications.map((medication, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={medication}
                        onChange={(e) => {
                          const newMedications = [...editFormData.medications];
                          newMedications[index] = e.target.value;
                          setEditFormData({...editFormData, medications: newMedications});
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      />
                      <button
                        onClick={() => removeArrayItem('medications', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('medications')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Medication
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Portal</h1>
              <p className="text-gray-600">
                Welcome back, {user ? (
                  <>
                    Dr. {user.firstName || user.lastName || user.username || 'Doctor'}
                    {user.hospital && ` - ${user.hospital}`}
                    {user.specialization && ` (${user.specialization})`}
                  </>
                ) : (
                  'Doctor'
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last login: {new Date().toLocaleDateString()}
              </span>
              {user && (
                <div className="text-sm text-gray-500">
                  Role: <span className="font-medium capitalize">{user.role}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'search', name: 'Search Patient', icon: MagnifyingGlassIcon },
              { id: 'prescriptions', name: 'Prescriptions', icon: DocumentTextIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && <SearchPatient />}
        {activeTab === 'prescriptions' && <Prescriptions />}
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && <PrescriptionModal />}
      
      {/* Edit Patient Modal */}
      {showEditModal && <EditPatientModal />}
    </div>
  );
};

export default DoctorPortal;
