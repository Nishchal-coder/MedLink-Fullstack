import React from 'react';

const SuperadminDebug: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ color: '#1f2937', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Superadmin Debug Test
      </h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
        <p style={{ color: '#4b5563', marginBottom: '16px' }}>
          This is a debug component to test if the basic rendering is working.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#dbeafe', padding: '16px', borderRadius: '8px', border: '1px solid #93c5fd' }}>
            <h3 style={{ color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>Dashboard</h3>
            <p style={{ color: '#1d4ed8', fontSize: '14px' }}>Overview and statistics</p>
          </div>
          
          <div style={{ backgroundColor: '#dcfce7', padding: '16px', borderRadius: '8px', border: '1px solid #86efac' }}>
            <h3 style={{ color: '#166534', fontWeight: '600', marginBottom: '8px' }}>Hospitals</h3>
            <p style={{ color: '#15803d', fontSize: '14px' }}>Manage hospital admins</p>
          </div>
          
          <div style={{ backgroundColor: '#f3e8ff', padding: '16px', borderRadius: '8px', border: '1px solid #c4b5fd' }}>
            <h3 style={{ color: '#7c3aed', fontWeight: '600', marginBottom: '8px' }}>Settings</h3>
            <p style={{ color: '#7c2d12', fontSize: '14px' }}>System configuration</p>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
          <p style={{ color: '#92400e', fontSize: '14px' }}>
            <strong>Status:</strong> If you can see this, the basic component rendering is working.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDebug;
