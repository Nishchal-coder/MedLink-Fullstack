import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem('medlink_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_user');
    
    // Clear any other session data
    sessionStorage.clear();
    
    console.log('User logged out successfully');
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Logged Out Successfully
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              You have been securely logged out of MedLink. Thank you for using our healthcare platform.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
            >
              Sign In Again
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center font-medium"
            >
              Go to Homepage
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For your security, please close your browser if you're on a shared computer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
