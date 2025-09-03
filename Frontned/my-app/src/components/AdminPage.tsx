import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const AdminPage: React.FC = () => {
  const { } = useTranslation();
  const { isAuthenticated, isAdmin, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 AdminPage Debug Info:');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isAdmin:', isAdmin);
    console.log('user:', user);
    console.log('isLoading:', isLoading);
    console.log('user?.role:', user?.role);
  }, [isAuthenticated, isAdmin, user, isLoading]);

  // Temporary function to create admin user for testing
  const createTestAdmin = () => {
    const adminUser = {
      id: 'admin-1',
      username: 'admin',
      role: 'admin' as const,
      firstName: 'Admin',
      lastName: 'User',
      status: 'Active'
    };
    
    localStorage.setItem('medlink_user', JSON.stringify(adminUser));
    localStorage.setItem('medlink_token', 'test-admin-token');
    
    // Force page reload to update auth state
    window.location.reload();
  };

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (isLoading) {
      return; // Wait for auth to load
    }
    
    if (!isAuthenticated) {
      console.log('🚫 Not authenticated, redirecting to /auth');
      navigate('/auth');
    } else if (!isAdmin) {
      console.log('🚫 Not admin, redirecting to /user');
      console.log('User role:', user?.role);
      navigate('/user');
    }
  }, [isAuthenticated, isAdmin, navigate, isLoading, user?.role]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // Show access denied message instead of redirecting immediately
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access the admin portal.</p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-4">
              You need admin privileges to access this portal.
            </p>
            <div className="bg-gray-100 p-4 rounded mb-4 text-left">
              <p className="text-sm text-gray-700">
                <strong>Current User:</strong> {user?.username}<br/>
                <strong>Role:</strong> {user?.role}<br/>
                <strong>Required:</strong> admin or superadmin
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/user')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
              >
                Go to User Portal
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
              >
                Login as Admin
              </button>
              <button
                onClick={createTestAdmin}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Test Admin (Dev Only)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AdminLayout />;
};

export default AdminPage;
