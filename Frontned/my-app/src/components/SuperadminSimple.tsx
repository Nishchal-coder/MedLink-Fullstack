import React from 'react';

const SuperadminSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🏥 Superadmin Panel
        </h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to the Superadmin Dashboard</h2>
          <p className="text-gray-600 mb-4">
            This is the main dashboard for managing healthcare systems and hospital administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Dashboard</h3>
            <p className="text-blue-700 text-sm">View system overview and statistics</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Manage Hospitals</h3>
            <p className="text-green-700 text-sm">Add, edit, and manage hospital admins</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Settings</h3>
            <p className="text-purple-700 text-sm">Configure system preferences</p>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> This is a simplified version for testing. The full Superadmin Panel with navigation and detailed components will be available once we resolve any import issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperadminSimple;
