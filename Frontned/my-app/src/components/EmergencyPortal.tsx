import React, { useState } from 'react';
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
  UserIcon,
  PhoneIcon,
  HeartIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import ApiService from '../services/api';

interface Patient {
  id: string;
  name: string;
  nationalId: string;
  mrn: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  diseases: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  address: string;
  hospital: {
    name: string;
    location: string;
  } | null;
  lastUpdated: string;
  status: string;
}

const EmergencyPortal: React.FC = () => {
  const [searchType, setSearchType] = useState<'nid' | 'mrn'>('nid');
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setSearchError('Please enter a valid search value');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setPatient(null);
    setShowPatientInfo(false);

    try {
      const response = await ApiService.emergencySearch(searchType, searchValue.trim());
      
      if (response.patient) {
        setPatient(response.patient);
        setShowPatientInfo(true);
        setSearchError(null);
      } else {
        setSearchError(`No patient found with ${searchType.toUpperCase()}: ${searchValue}`);
        setPatient(null);
      }
    } catch (error: any) {
      console.error('Emergency search error:', error);
      setSearchError(error.message || 'Failed to search for patient');
      setPatient(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchValue('');
    setSearchError(null);
    setPatient(null);
    setShowPatientInfo(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-red-800 dark:text-red-200 mb-2">
            Emergency Portal
          </h1>
          <p className="text-lg text-red-600 dark:text-red-300">
            Quick access to critical patient information in emergency situations
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Search Patient
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Type Selection */}
              <div className="flex space-x-4 justify-center">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="nid"
                    checked={searchType === 'nid'}
                    onChange={(e) => setSearchType(e.target.value as 'nid' | 'mrn')}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">National ID</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="searchType"
                    value="mrn"
                    checked={searchType === 'mrn'}
                    onChange={(e) => setSearchType(e.target.value as 'nid' | 'mrn')}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Medical Record Number</span>
                </label>
              </div>

              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={`Enter ${searchType.toUpperCase()}...`}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={searchLoading || !searchValue.trim()}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 flex items-center justify-center"
              >
                {searchLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <ShieldExclamationIcon className="h-5 w-5 mr-2" />
                    Emergency Search
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {searchError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-center">{searchError}</p>
              </div>
            )}

            {/* Reset Button */}
            {patient && (
              <div className="mt-4 text-center">
                <button
                  onClick={resetSearch}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm underline"
                >
                  Search Another Patient
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Patient Information Display */}
        {showPatientInfo && patient && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="max-w-4xl mx-auto">
              {/* Patient Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {patient.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {patient.age} years old • {patient.gender} • {patient.bloodType}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {formatDate(patient.lastUpdated)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Critical Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                      Critical Information
                    </h3>
                    
                    {/* Allergies */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Allergies</h4>
                      {patient.allergies && patient.allergies.length > 0 ? (
                        <div className="space-y-1">
                          {patient.allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center">
                              <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-red-700 dark:text-red-300">{allergy}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-green-600 dark:text-green-400">No known allergies</p>
                      )}
                    </div>

                    {/* Current Medications */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Current Medications</h4>
                      {patient.medications && patient.medications.length > 0 ? (
                        <div className="space-y-1">
                          {patient.medications.map((medication, index) => (
                            <div key={index} className="flex items-center">
                              <DocumentTextIcon className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="text-blue-700 dark:text-blue-300">{medication}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No current medications</p>
                      )}
                    </div>

                    {/* Diseases */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                      <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Known Conditions</h4>
                      {patient.diseases && patient.diseases.length > 0 ? (
                        <div className="space-y-1">
                          {patient.diseases.map((disease, index) => (
                            <div key={index} className="flex items-center">
                              <HeartIcon className="h-4 w-4 text-orange-500 mr-2" />
                              <span className="text-orange-700 dark:text-orange-300">{disease}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No known conditions</p>
                      )}
                    </div>
                  </div>

                  {/* Medical History */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <HeartIcon className="h-5 w-5 text-purple-500 mr-2" />
                      Medical History
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                        <div className="space-y-2">
                          {patient.medicalHistory.map((condition, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                              <span className="text-gray-700 dark:text-gray-300">{condition}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No significant medical history</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <PhoneIcon className="h-5 w-5 text-green-500 mr-2" />
                      Emergency Contact
                    </h3>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                          <p className="font-medium text-gray-900 dark:text-white">{patient.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                          <a 
                            href={`tel:${patient.emergencyContact.phone}`}
                            className="font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                          >
                            {patient.emergencyContact.phone}
                          </a>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Relationship</p>
                          <p className="font-medium text-gray-900 dark:text-white">{patient.emergencyContact.relationship}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                      Patient Details
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">National ID</p>
                          <p className="font-medium text-gray-900 dark:text-white">{patient.nationalId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">MRN</p>
                          <p className="font-medium text-gray-900 dark:text-white">{patient.mrn}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date of Birth</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Blood Type</p>
                          <p className="font-medium text-gray-900 dark:text-white">{patient.bloodType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {patient.address && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <MapPinIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        Address
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300">{patient.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Hospital Information */}
                  {patient.hospital && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-teal-500 mr-2" />
                        Primary Hospital
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Hospital Name</p>
                            <p className="font-medium text-gray-900 dark:text-white">{patient.hospital.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                            <p className="font-medium text-gray-900 dark:text-white">{patient.hospital.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!showPatientInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <InformationCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Access Instructions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Enter the patient's National ID or Medical Record Number to access critical medical information for emergency treatment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">National ID Search</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter the patient's government-issued National ID number</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">MRN Search</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enter the patient's Medical Record Number from their hospital</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            For immediate emergency assistance, please contact your local emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPortal;
