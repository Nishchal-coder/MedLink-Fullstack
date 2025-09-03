import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  XMarkIcon,
  HeartIcon, 
  BeakerIcon, 
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface MedicalDataFormProps {
  onClose: () => void;
  onDataUpdated?: () => void;
}

const MedicalDataForm: React.FC<MedicalDataFormProps> = ({ onClose, onDataUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    diseases: [] as string[],
    medications: [] as string[],
    allergies: [] as string[]
  });

  // Fetch current patient data and initialize form
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('medlink_token');
        if (!token) {
          console.error('No authentication token found during data fetch');
          return;
        }

        const response = await fetch('http://localhost:5000/api/patients/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const patient = data.patient;
          setFormData({
            diseases: Array.isArray(patient?.diseases) ? patient.diseases : [],
            medications: Array.isArray(patient?.medications) ? patient.medications : [],
            allergies: Array.isArray(patient?.allergies) ? patient.allergies : []
          });
        } else {
          console.error('Failed to fetch patient data:', response.status);
          if (response.status === 401 || response.status === 403) {
            console.error('Authentication failed during data fetch');
            localStorage.removeItem('medlink_token');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          console.error('Network error during data fetch');
        }
      }
    };
    fetchPatientData();
  }, []);

  const handleAddItem = (field: 'diseases' | 'medications' | 'allergies') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveItem = (field: 'diseases' | 'medications' | 'allergies', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (field: 'diseases' | 'medications' | 'allergies', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Filter out empty items
      const cleanData = {
        diseases: formData.diseases.filter((item: string) => item.trim() !== ''),
        medications: formData.medications.filter((item: string) => item.trim() !== ''),
        allergies: formData.allergies.filter((item: string) => item.trim() !== '')
      };

      const token = localStorage.getItem('medlink_token');
      if (!token) {
        setMessage('No authentication token found. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const response = await fetch('http://localhost:5000/api/patients/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanData)
      });

      if (response.ok) {
        setMessage('Medical data updated successfully!');
        // Call the callback to refresh parent component data
        if (onDataUpdated) {
          onDataUpdated();
        }
        setTimeout(() => {
          onClose();
          // Force page refresh to show updated data
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          setMessage('Authentication failed. Please log in again.');
          // Clear invalid token
          localStorage.removeItem('medlink_token');
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setMessage(`Failed to update medical data: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error updating medical data:', error);
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setMessage('Network error: Unable to connect to the server. Please check your connection and try again.');
      } else {
        setMessage('Error updating medical data');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'diseases':
        return <HeartIcon className="w-5 h-5 text-red-600" />;
      case 'medications':
        return <BeakerIcon className="w-5 h-5 text-blue-600" />;
      case 'allergies':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getFieldTitle = (field: string) => {
    switch (field) {
      case 'diseases':
        return 'Current Conditions';
      case 'medications':
        return 'Current Medications';
      case 'allergies':
        return 'Allergies';
      default:
        return field;
    }
  };

  const getFieldColor = (field: string) => {
    switch (field) {
      case 'diseases':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medications':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'allergies':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Medical Data
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Conditions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {getFieldIcon('diseases')}
                  <span className="ml-2">{getFieldTitle('diseases')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddItem('diseases')}
                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Condition
                </button>
              </div>
              <div className="space-y-2">
                {formData.diseases.map((disease: string, index: number) => (
                  <div key={index} className={`flex items-center space-x-2 p-3 rounded-lg border ${getFieldColor('diseases')}`}>
                    <input
                      type="text"
                      value={disease}
                      onChange={(e) => handleItemChange('diseases', index, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
                      placeholder="Enter condition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('diseases', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {getFieldIcon('medications')}
                  <span className="ml-2">{getFieldTitle('medications')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddItem('medications')}
                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Medication
                </button>
              </div>
              <div className="space-y-2">
                {formData.medications.map((medication: string, index: number) => (
                  <div key={index} className={`flex items-center space-x-2 p-3 rounded-lg border ${getFieldColor('medications')}`}>
                    <input
                      type="text"
                      value={medication}
                      onChange={(e) => handleItemChange('medications', index, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
                      placeholder="Enter medication"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('medications', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {getFieldIcon('allergies')}
                  <span className="ml-2">{getFieldTitle('allergies')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddItem('allergies')}
                  className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Allergy
                </button>
              </div>
              <div className="space-y-2">
                {formData.allergies.map((allergy: string, index: number) => (
                  <div key={index} className={`flex items-center space-x-2 p-3 rounded-lg border ${getFieldColor('allergies')}`}>
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) => handleItemChange('allergies', index, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white"
                      placeholder="Enter allergy"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('allergies', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicalDataForm;
