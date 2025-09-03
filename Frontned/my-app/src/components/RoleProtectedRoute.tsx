import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/user' 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth-user" replace />;
  }

  // Check if user has required role
  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4 text-left">
              <p className="text-sm text-gray-700">
                <strong>Current User:</strong> {user?.username}<br/>
                <strong>Your Role:</strong> {user?.role}<br/>
                <strong>Required Roles:</strong> {allowedRoles.join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = fallbackPath}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
              >
                Go to {fallbackPath === '/user' ? 'User Portal' : 'Dashboard'}
              </button>
              <button
                onClick={() => window.location.href = '/auth-user'}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Login with Different Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content if user has required role
  return <>{children}</>;
};

export default RoleProtectedRoute;
