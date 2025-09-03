import React, { useState } from 'react';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface SuperadminDashboardProps {
  children: React.ReactNode;
  currentPage?: 'dashboard' | 'hospitals' | 'settings';
  onNavigate?: (page: 'dashboard' | 'hospitals' | 'settings') => void;
}

const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({ children, currentPage = 'dashboard', onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: 'dashboard', icon: HomeIcon, current: currentPage === 'dashboard' },
    { name: 'Manage Hospitals', href: 'hospitals', icon: BuildingOfficeIcon, current: currentPage === 'hospitals' },
    { name: 'Settings', href: 'settings', icon: Cog6ToothIcon, current: currentPage === 'settings' },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  const handleLogout = () => {
    console.log('🔘 Logout button clicked in SuperadminDashboard');
    try {
      console.log('🔄 Calling logout function...');
      logout();
      console.log('✅ Logout function called successfully');
    } catch (error) {
      console.error('❌ Error in handleLogout:', error);
      // Fallback logout
      console.log('🔄 Fallback logout...');
      localStorage.removeItem('medlink_user');
      localStorage.removeItem('medlink_token');
      window.location.href = '/';
    }
  };

  const handleNavigation = (page: 'dashboard' | 'hospitals' | 'settings') => {
    onNavigate?.(page);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <span className="ml-3 text-xl font-bold text-gray-900">SuperAdmin</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4 px-4 flex-1">
          <div className="mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
              Navigation
            </h3>
          </div>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.href as 'dashboard' | 'hospitals' | 'settings')}
                  className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-left">{item.name}</span>
                </button>
              </li>
            ))}
            <li className="pt-3 border-t border-gray-200 mt-3">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-left">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top navbar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {currentPage === 'dashboard' && 'Dashboard'}
                {currentPage === 'hospitals' && 'Manage Hospitals'}
                {currentPage === 'settings' && 'Settings'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.username || 'Super Admin'}</p>
                    <p className="text-xs text-gray-500">superadmin@example.com</p>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username || 'Super Admin'}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'Super Administrator'}</p>
                    </div>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account Settings
                    </a>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 lg:pl-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
