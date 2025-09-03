import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CameraIcon,
  PlusIcon,
  PencilIcon,

  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { usePatients } from '../contexts/PatientContext';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../types/Patient';

interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  description: string;
  doctor: string;
  status: 'completed' | 'pending' | 'cancelled';
  results?: string;
  notes?: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued';
  instructions?: string;
}

const PersonalMedicalData: React.FC = () => {
  const { user } = useAuth();
  const { getPatientsByUserId, loading, error } = usePatients();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'prescriptions' | 'images'>('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userPatients = getPatientsByUserId(user.id);
        if (userPatients.length > 0) {
        setPatient(userPatients[0]); // Get the first patient for this user
      }
    }
  }, [user, getPatientsByUserId]);

  // TODO: Replace with real API calls when backend endpoints are available
  useEffect(() => {
    if (patient) {
      // Simulate loading medical records and prescriptions
      // In real implementation, these would come from the backend
      setMedicalRecords([]);
      setPrescriptions([]);
    }
  }, [patient]);

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = () => {
    // TODO: Implement save functionality with backend API
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // const _openImageModal = (imageUrl: string) => {
  //   setSelectedImage(imageUrl);
  //   setIsImageModalOpen(true);
  // };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'text-red-600 bg-red-100 dark:bg-red-900/30',
      'A-': 'text-red-600 bg-red-50 dark:bg-red-900/20',
      'B+': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      'B-': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      'AB+': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      'AB-': 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      'O+': 'text-green-600 bg-green-100 dark:bg-green-900/30',
      'O-': 'text-green-600 bg-green-50 dark:bg-green-900/20'
    };
    return colors[bloodType] || 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your medical data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Data</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Patient Data Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please contact your healthcare provider to set up your patient profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
             {patient.photo ? (
               <img
                 src={patient.photo}
                 alt={`${patient.name}'s photo`}
                    className="w-20 h-20 rounded-full object-cover"
               />
             ) : (
                  <UserIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                )}
           </div>
           <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{patient.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">Patient ID: {patient.mrn}</p>
                <p className="text-gray-600 dark:text-gray-400">National ID: {patient.nationalId}</p>
           </div>
              </div>
                                           <div className="flex space-x-3">
              {!isEditMode ? (
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                <button
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                </>
        )}
            </div>
      </div>

          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Date of Birth</h3>
              </div>
              <p className="text-blue-900 dark:text-blue-100">{patient.dob}</p>
              </div>

            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <UserIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="font-semibold text-green-800 dark:text-green-200">Gender</h3>
              </div>
              <p className="text-green-900 dark:text-green-100 capitalize">{patient.gender}</p>
              </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <PhoneIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">Phone</h3>
            </div>
              <p className="text-purple-900 dark:text-purple-100">{patient.phone}</p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <EnvelopeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">Email</h3>
            </div>
              <p className="text-indigo-900 dark:text-indigo-100">{patient.email || 'Not provided'}</p>
            </div>
            </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPinIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Address</h3>
          </div>
              <p className="text-yellow-900 dark:text-yellow-100">{patient.address || 'Not provided'}</p>
      </div>

            {patient.bloodType && (
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <HeartIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <h3 className="font-semibold text-red-800 dark:text-red-200">Blood Type</h3>
         </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBloodTypeColor(patient.bloodType)}`}>
                  {patient.bloodType}
                </span>
               </div>
         )}
          </div>
       </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: EyeIcon },
              { id: 'records', label: 'Medical Records', icon: DocumentTextIcon },
              { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardDocumentListIcon },
              { id: 'images', label: 'Medical Images', icon: CameraIcon }
            ].map((tab) => (
           <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
           </button>
            ))}
          </nav>
      </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Health Overview</h2>
              
              {/* Medical History */}
              {patient.medicalHistory && (
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Medical History</h3>
                  <p className="text-gray-700 dark:text-gray-300">{patient.medicalHistory}</p>
        </div>
      )}

              {/* Allergies */}
              {patient.allergies && (
                <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Allergies</h3>
                  <p className="text-orange-900 dark:text-orange-100">{patient.allergies}</p>
        </div>
      )}

              {/* Current Medications */}
              {patient.medications && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Current Medications</h3>
                  <p className="text-blue-900 dark:text-blue-100">{patient.medications}</p>
        </div>
              )}

              {/* Emergency Contact */}
              {patient.emergencyContact && (
                <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">Emergency Contact</h3>
                  <p className="text-red-900 dark:text-red-100 text-lg">
                    <strong>Phone:</strong> {patient.emergencyContact}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">Patient Status</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {patient.status}
                </span>
                </div>
              </div>
          )}

          {activeTab === 'records' && (
                <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Medical Records</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Record
                </button>
                </div>
              
              {medicalRecords.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No medical records</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Medical records will be displayed here when available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{record.type}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
              </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{record.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Doctor: {record.doctor}</span>
                        <span>Date: {record.date}</span>
              </div>
              </div>
                  ))}
          </div>
        )}
      </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Prescriptions</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Prescription
          </button>
        </div>

              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No prescriptions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Prescriptions will be displayed here when available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{prescription.medication}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                          </span>
                        </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Prescribed by: {prescription.prescribedBy}</span>
                        <span>{prescription.startDate} - {prescription.endDate}</span>
                  </div>
                </div>
              ))}
          </div>
              )}
          </div>
        )}

          {activeTab === 'images' && (
                <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Medical Images</h2>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </button>
              </div>
              
              <div className="text-center py-12">
                <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No medical images</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Medical images and reports will be displayed here when available.
                </p>
              </div>
          </div>
        )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full">
              <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
              <XMarkIcon className="h-8 w-8" />
              </button>
              <img
                src={selectedImage}
                alt="Medical image"
              className="max-w-full max-h-full object-contain"
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalMedicalData;
