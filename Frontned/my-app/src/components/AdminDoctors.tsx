import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl, API_CONFIG } from '../config/api';

interface Doctor {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  hospital: string;
  contactNumber: string;
  status: string;
  createdAt: string;
}

const AdminDoctors: React.FC = () => {
  const navigate = useNavigate();
  const { } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch doctors from backend
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Update filtered doctors when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
    } else {
             const filtered = doctors.filter(doctor => 
         doctor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
         doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
       );
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchQuery]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('medlink_token');
      
      if (!token) {
        console.error('❌ No auth token found - please login again');
        setDoctors([]);
        return;
      }

      console.log('🔍 Fetching doctors with token:', token.substring(0, 20) + '...');
      console.log('🔗 API URL:', getApiUrl(API_CONFIG.ENDPOINTS.DOCTORS.LIST));

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCTORS.LIST), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Doctors fetched:', data);
        console.log('📊 Number of doctors:', data.results ? data.results.length : data.length);
        setDoctors(data.results || data);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Failed to fetch doctors:', response.status, errorData);
        
        if (response.status === 401) {
          console.error('❌ Authentication failed - please login again');
          // Clear invalid token
          localStorage.removeItem('medlink_token');
          localStorage.removeItem('medlink_refresh_token');
        }
        
        setDoctors([]);
      }
    } catch (error) {
      console.error('❌ Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Add real-time refresh functionality
  // const _refreshDoctors = () => {
  //   fetchDoctors();
  // };

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDoctors();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    // Navigate to edit page or open edit modal
    navigate(`/admin/doctors/${doctor.id}/edit`);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('medlink_token');
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.DOCTORS.UPDATE(doctorId)), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          console.log('✅ Doctor deleted successfully');
          setDoctors(doctors.filter(d => d._id !== doctorId));
        } else {
          console.error('❌ Failed to delete doctor:', response.status);
          alert('Failed to delete doctor. Please try again.');
        }
      } catch (error) {
        console.error('❌ Error deleting doctor:', error);
        alert('Error deleting doctor. Please try again.');
      }
    }
  };

  const handleCreateDoctor = () => {
    setShowCreateModal(true);
  };

  const closeDoctorModal = () => {
    setShowDoctorModal(false);
    setSelectedDoctor(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Doctor Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage all doctors in the healthcare system</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search doctors by name, username, or specialization..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <button
          onClick={handleCreateDoctor}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Search Results Summary */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} 
          {searchQuery && ` for "${searchQuery}"`}
        </div>
      )}

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
                         <div key={doctor._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Header with Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                                         <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                       {doctor.firstName} {doctor.lastName}
                     </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{doctor.username}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  doctor.status === 'Active' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {doctor.status}
                </span>
              </div>

              {/* Doctor Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Specialization</label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{doctor.specialization}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Hospital</label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{doctor.hospital}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact</label>
                                     <p className="text-sm text-gray-900 dark:text-white font-medium">{doctor.contactNumber}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{doctor.email}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Joined</label>
                                     <p className="text-sm text-gray-900 dark:text-white font-medium">
                     {new Date(doctor.createdAt).toLocaleDateString()}
                   </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewDoctor(doctor)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center"
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </button>
                <button 
                  onClick={() => handleEditDoctor(doctor)}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </button>
                                 <button 
                   onClick={() => handleDeleteDoctor(doctor._id)}
                  className="px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 flex items-center justify-center"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No Results Message */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No doctors found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery 
              ? `No doctors match your search for "${searchQuery}"`
              : 'No doctors are currently registered in the system'
            }
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doctor Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{doctors.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {doctors.filter(d => d.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(doctors.map(d => d.specialization)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Specializations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {new Set(doctors.map(d => d.hospital)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hospitals</div>
          </div>
        </div>
      </div>

      {/* Doctor Detail Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Doctor Details
              </h3>
              <button
                onClick={closeDoctorModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                                 <p className="text-gray-900 dark:text-white">{selectedDoctor.firstName} {selectedDoctor.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                <p className="text-gray-900 dark:text-white">@{selectedDoctor.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Specialization</label>
                <p className="text-gray-900 dark:text-white">{selectedDoctor.specialization}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Hospital</label>
                <p className="text-gray-900 dark:text-white">{selectedDoctor.hospital}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</label>
                                 <p className="text-gray-900 dark:text-white">{selectedDoctor.contactNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white">{selectedDoctor.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedDoctor.status === 'Active' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {selectedDoctor.status}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => handleEditDoctor(selectedDoctor)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Edit Doctor
              </button>
              <button
                onClick={closeDoctorModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Doctor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Doctor
              </h3>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will be redirected to a comprehensive doctor registration form where you can enter all the necessary details.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  closeCreateModal();
                  navigate('/admin/doctors/create');
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Continue to Form
              </button>
              <button
                onClick={closeCreateModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
