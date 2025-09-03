import React from 'react';
import { XMarkIcon, UserIcon, PhoneIcon, CalendarIcon, IdentificationIcon, CameraIcon } from '@heroicons/react/24/outline';
import type { Patient } from '../types/Patient';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, isOpen, onClose, onEdit }) => {
  if (!isOpen || !patient) return null;

  const handleEdit = () => {
    onEdit(patient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">Patient ID: {patient.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Patient Photo and Status */}
          <div className="flex items-start space-x-6 mb-8">
            {/* Photo Section */}
            <div className="flex-shrink-0">
              {patient.photo ? (
                <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  <img 
                    src={patient.photo} 
                    alt={`${patient.name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                  <CameraIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Patient Photo</p>
            </div>

            {/* Status and Basic Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
                  {patient.status}
                </span>
                {patient.hasBloodType && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium rounded-full">
                    Blood Type: {patient.bloodType}
                  </span>
                )}
              </div>
              
              {/* Last Updated Info */}
              {patient.lastUpdated && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Last updated: {new Date(patient.lastUpdated).toLocaleString()}</p>
                  {patient.updatedBy && (
                    <p>Updated by: {patient.updatedBy}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Patient Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <IdentificationIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">National ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.nationalId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <IdentificationIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">MRN</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.mrn}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-white">{new Date(patient.dob).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{patient.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.address || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emergency Contact</p>
                    <p className="font-medium text-gray-900 dark:text-white">{patient.emergencyContact || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Medical Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Medical History</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg min-h-[60px]">
                  {patient.medicalHistory || 'No medical history recorded'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Allergies</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg min-h-[60px]">
                  {patient.allergies || 'No known allergies'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Medications</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg min-h-[60px]">
                  {patient.medications || 'No current medications'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
