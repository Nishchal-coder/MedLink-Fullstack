import React from 'react';

const SuperadminTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Superadmin Panel Test
        </h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-4">
            This is a test component to verify that the Superadmin Panel is working.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Dashboard</h3>
              <p className="text-blue-700 text-sm">Overview and statistics</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Hospitals</h3>
              <p className="text-green-700 text-sm">Manage hospital admins</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Settings</h3>
              <p className="text-purple-700 text-sm">System configuration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminTest;
