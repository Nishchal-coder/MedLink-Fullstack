import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import AdminDoctors from './AdminDoctors';
import AdminCreateDoctor from './AdminCreateDoctor';
import AdminSearchResults from './AdminSearchResults';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page from current route
  const getActivePage = () => {
    if (location.pathname.includes('/doctors/create')) return 'doctors';
    if (location.pathname.includes('/doctors')) return 'doctors';
    if (location.pathname.includes('/search')) return 'search';
    return 'doctors';
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Do you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/');
    }
  };

  const handlePageChange = (page: string) => {
    switch (page) {
      case 'doctors':
        navigate('/admin/doctors');
        break;
      case 'search':
        navigate('/admin/search');
        break;
      default:
        navigate('/admin/doctors');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePage={getActivePage()} onPageChange={handlePageChange} />
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <AdminHeader onLogout={handleLogout} />
        
        {/* Page Content */}
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<AdminDoctors />} />
            <Route path="/doctors" element={<AdminDoctors />} />
            <Route path="/doctors/create" element={<AdminCreateDoctor />} />
            <Route path="/search" element={<AdminSearchResults />} />
            <Route path="*" element={<AdminDoctors />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
