import React, { useState } from 'react';
import { UserIcon, MagnifyingGlassIcon, CameraIcon } from '@heroicons/react/24/outline';
import { usePatients } from '../contexts/PatientContext';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../types/Patient';

const UserPatientView: React.FC = () => {
  const { getPatientsByUserId } = usePatients();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Get only the current user's patients
  const userPatients = user ? getPatientsByUserId(user.username) : [];
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(userPatients);

  // Update filtered patients when user patients change or search query changes
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(userPatients);
    } else {
      const filtered = userPatients.filter(patient => 
        patient.nationalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [userPatients, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const closeModal = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="p-6">
      {/* Main Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
        <p className="text-gray-600">View and search patient information in the system</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, NID, or MRN..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} 
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Patients Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Header with Status Tags */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Patient Photo or Avatar */}
                  {patient.photo ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                      <img 
                        src={patient.photo} 
                        alt={`${patient.name}'s photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
                  </div>
                </div>
                
                {/* Status Tags */}
                <div className="flex flex-col items-end space-y-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {patient.status}
                  </span>
                  {patient.hasBloodType && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {patient.bloodType}
                    </span>
                  )}
                </div>
              </div>

              {/* Patient Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">National ID</label>
                    <p className="text-sm text-gray-900 font-medium">{patient.nationalId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">MRN</label>
                    <p className="text-sm text-gray-900 font-medium">{patient.mrn}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</label>
                    <p className="text-sm text-gray-900 font-medium">{new Date(patient.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</label>
                    <p className="text-sm text-gray-900 font-medium capitalize">{patient.gender}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                  <p className="text-sm text-gray-900 font-medium">{patient.phone}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button 
                  onClick={() => handleViewDetails(patient)}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Results Message */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No patients match your search for "${searchQuery}"`
              : 'No patients are currently registered in the system'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userPatients.length}</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userPatients.filter(p => p.status === 'Active').length}</div>
            <div className="text-sm text-gray-600">Active Patients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{userPatients.filter(p => p.gender === 'male').length}</div>
            <div className="text-sm text-gray-600">Male Patients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{userPatients.filter(p => p.gender === 'female').length}</div>
            <div className="text-sm text-gray-600">Female Patients</div>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-500">Patient ID: {selectedPatient.id}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Patient Photo and Status */}
              <div className="flex items-start space-x-6 mb-8">
                {/* Photo Section */}
                <div className="flex-shrink-0">
                  {selectedPatient.photo ? (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img 
                        src={selectedPatient.photo} 
                        alt={`${selectedPatient.name}'s photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                      <CameraIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-2">Patient Photo</p>
                </div>

                {/* Status and Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      {selectedPatient.status}
                    </span>
                    {selectedPatient.hasBloodType && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        Blood Type: {selectedPatient.bloodType}
                      </span>
                    )}
                  </div>
                  
                  {/* Last Updated Info */}
                  {selectedPatient.lastUpdated && (
                    <div className="text-sm text-gray-500">
                      <p>Last updated: {new Date(selectedPatient.lastUpdated).toLocaleString()}</p>
                      {selectedPatient.updatedBy && (
                        <p>Updated by: {selectedPatient.updatedBy}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">National ID</p>
                      <p className="font-medium text-gray-900">{selectedPatient.nationalId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">MRN</p>
                      <p className="font-medium text-gray-900">{selectedPatient.mrn}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{new Date(selectedPatient.dob).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium text-gray-900 capitalize">{selectedPatient.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Contact Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{selectedPatient.email || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium text-gray-900">{selectedPatient.address || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="font-medium text-gray-900">{selectedPatient.emergencyContact || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Medical Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Medical History</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                      {selectedPatient.medicalHistory || 'No medical history recorded'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Allergies</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                      {selectedPatient.allergies || 'No known allergies'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Medications</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                      {selectedPatient.medications || 'No current medications'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPatientView;
