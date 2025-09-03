import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
  _id?: string;
  id?: string; // Alias for _id
  username: string;
  password?: string; // Only for registration
  role: 'superadmin' | 'admin' | 'doctor' | 'user' | 'emergency_access';
  hospital?: string; // Hospital ID reference
  mustChangePassword?: boolean;
  emergencyAccessExpiresAt?: Date;
  nationalId?: string;
  contactNumber?: string;
  isPhoneVerified?: boolean;
  phoneVerificationCode?: string;
  verificationCodeExpiresAt?: Date;
  specialization?: string;
  profilePicture?: string;
  bio?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  status?: 'Active' | 'Inactive';
  firstName?: string;
  lastName?: string;
  email?: string; // For registration
  lastLogin?: Date;
  initialSetupCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  register: (userData: { 
    username: string; 
    password: string; 
    firstName?: string; 
    lastName?: string; 
    role?: string; 
    email?: string; 
    contactNumber?: string; 
    dateOfBirth?: string; 
    gender?: string;
    address?: string;
    // Admin-specific fields
    hospitalName?: string;
    hospitalAddress?: string;
    hospitalContact?: string;
    adminPosition?: string;
    department?: string;
    employeeId?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  const login = async (credentials: { username: string; password: string }) => {
    console.log('🔐 Login attempt for username:', credentials.username);
    setIsLoading(true);
    
    try {
      console.log('📡 Making API call to:', `${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful, received data:', data);
        
        // Transform backend user data to frontend format
        const userData: User = {
          id: data.user._id || data.user.id,
          username: data.user.username,
          role: data.user.role,
          lastLogin: new Date(),
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          status: data.user.status,
          hospital: data.user.hospital,
          specialization: data.user.specialization,
          mustChangePassword: data.user.mustChangePassword,
          isPhoneVerified: data.user.isPhoneVerified,
          contactNumber: data.user.contactNumber,
          nationalId: data.user.nationalId,
          dateOfBirth: data.user.dateOfBirth,
          gender: data.user.gender,
          address: data.user.address,
          profilePicture: data.user.profilePicture,
          bio: data.user.bio,
          emergencyAccessExpiresAt: data.user.emergencyAccessExpiresAt,
          initialSetupCompleted: data.user.initialSetupCompleted,
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt
        };
        
        console.log('🔄 Transformed user data:', userData);
        
        // Store user data and token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('medlink_user', JSON.stringify(userData));
          localStorage.setItem('medlink_token', data.accessToken);
          
          // Store refresh token if available
          if (data.refreshToken) {
            localStorage.setItem('medlink_refresh_token', data.refreshToken);
            console.log('💾 Stored refresh token');
          }
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ User state updated, isAuthenticated should be true');
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { 
    username: string; 
    password: string; 
    firstName?: string; 
    lastName?: string; 
    role?: string; 
    email?: string; 
    contactNumber?: string; 
    dateOfBirth?: string; 
    gender?: string;
    address?: string;
    // Admin-specific fields
    hospitalName?: string;
    hospitalAddress?: string;
    hospitalContact?: string;
    adminPosition?: string;
    department?: string;
    employeeId?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  }) => {
    console.log('🔐 Registration attempt for username:', userData.username);
    setIsLoading(true);
    
    try {
      console.log('📡 Making API call to:', `${API_BASE_URL}/auth/register`);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'user',
          email: userData.email,
          contactNumber: userData.contactNumber,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          address: userData.address,
          // Admin-specific fields
          hospitalName: userData.hospitalName,
          hospitalAddress: userData.hospitalAddress,
          hospitalContact: userData.hospitalContact,
          adminPosition: userData.adminPosition,
          department: userData.department,
          employeeId: userData.employeeId,
          emergencyContact: userData.emergencyContact,
          emergencyPhone: userData.emergencyPhone
        })
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Registration successful, received data:', data);
        
        // Transform backend user data to frontend format
        const newUserData: User = {
          id: data.user.id.toString(),
          username: data.user.username,
          role: data.user.role,
          lastLogin: new Date(),
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          status: data.user.status,
          hospital: data.user.hospital,
          specialization: data.user.specialization,
          mustChangePassword: data.user.mustChangePassword
        };
        
        console.log('🔄 Transformed user data:', newUserData);
        
        // Store user data and token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('medlink_user', JSON.stringify(newUserData));
          localStorage.setItem('medlink_token', data.accessToken);
          
          // Store refresh token if available
          if (data.refreshToken) {
            localStorage.setItem('medlink_refresh_token', data.refreshToken);
            console.log('💾 Stored refresh token');
          }
        }
        
        setUser(newUserData);
        setIsAuthenticated(true);
        console.log('✅ User state updated, isAuthenticated should be true');
        
        // If user role is 'user', create a patient profile
        if (newUserData.role === 'user') {
          try {
            console.log('🏥 Creating patient profile for new user...');
            const patientResponse = await fetch(`${API_BASE_URL}/patients/`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${data.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mrn: `MRN${Date.now()}`,
                dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
                gender: userData.gender || 'other',
                bloodGroup: undefined, // Let backend handle default
                hasBloodType: false,
                diseases: [],
                allergies: [],
                medications: [],
                address: '',
                emergencyContactName: '',
                emergencyContactPhone: userData.contactNumber || '',
                emergencyContactRelation: ''
              })
            });
            
            if (patientResponse.ok) {
              console.log('✅ Patient profile created successfully');
            } else {
              console.log('⚠️ Patient profile creation failed, but user registration succeeded');
            }
          } catch (patientError) {
            console.log('⚠️ Error creating patient profile:', patientError);
          }
        }
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Registration failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('🔄 Logout function called');
    
    try {
      // Call backend logout endpoint (optional - don't let this fail the logout)
      const token = typeof window !== 'undefined' ? localStorage.getItem('medlink_token') : null;
      console.log('🔑 Token found:', !!token);
      
      if (token) {
        try {
          console.log('📡 Calling backend logout...');
          const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          console.log('✅ Backend logout response:', response.status);
        } catch (backendError) {
          // Don't let backend errors prevent logout
          console.log('⚠️ Backend logout call failed, but continuing with frontend logout:', backendError);
        }
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      console.log('🧹 Clearing local storage...');
      // Always clear user data and token regardless of backend response
      if (typeof window !== 'undefined') {
        localStorage.removeItem('medlink_user');
        localStorage.removeItem('medlink_token');
        localStorage.removeItem('medlink_refresh_token');
      }
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('🔄 Redirecting to home page...');
      // Force redirect to home page
      if (typeof window !== 'undefined') {
        console.log('🔄 Setting window.location.href to /');
        window.location.href = '/';
      }
    }
  };

  // Check for existing token on app start
  useEffect(() => {
    const checkExistingAuth = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('medlink_token') : null;
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('medlink_refresh_token') : null;
        const userData = typeof window !== 'undefined' ? localStorage.getItem('medlink_user') : null;
      
        if (token && userData) {
          try {
            // Check if token is still valid
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp && payload.exp > currentTime) {
              // Token is still valid, restore user session
              console.log('✅ Restoring existing session from localStorage');
              setUser(JSON.parse(userData));
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            } else if (refreshToken) {
              // Token expired, try to refresh it
              console.log('🔄 Token expired, attempting to refresh...');
              try {
                const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ refreshToken })
                });

                if (response.ok) {
                  const data = await response.json();
                  const newToken = data.accessToken;
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('medlink_token', newToken);
                  }
                  console.log('✅ Token refreshed successfully, restoring session');
                  setUser(JSON.parse(userData));
                  setIsAuthenticated(true);
                  setIsLoading(false);
                  return;
                } else {
                  console.log('❌ Token refresh failed, clearing auth data');
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('medlink_token');
                    localStorage.removeItem('medlink_refresh_token');
                    localStorage.removeItem('medlink_user');
                  }
                }
              } catch (error) {
                console.log('❌ Error refreshing token:', error);
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('medlink_token');
                  localStorage.removeItem('medlink_refresh_token');
                  localStorage.removeItem('medlink_user');
                }
              }
            } else {
              // No refresh token, clear expired token
              console.log('❌ Token expired and no refresh token, clearing auth data');
              if (typeof window !== 'undefined') {
                localStorage.removeItem('medlink_token');
                localStorage.removeItem('medlink_user');
              }
            }
          } catch (error) {
            console.log('❌ Error checking token validity:', error);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('medlink_token');
              localStorage.removeItem('medlink_refresh_token');
              localStorage.removeItem('medlink_user');
            }
          }
        }
        
        // No valid auth data found
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      } catch (error) {
        console.warn('Error checking existing auth:', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkExistingAuth();
  }, []);

  // Add global logout function for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).forceLogout = () => {
        console.log('🚨 Force logout called from console');
        localStorage.removeItem('medlink_user');
        localStorage.removeItem('medlink_token');
        setUser(null);
        window.location.href = '/';
      };
      
      (window as any).checkAuthStatus = () => {
        console.log('🔍 Current auth status:');
        console.log('User:', user);
        console.log('Local storage user:', localStorage.getItem('medlink_user'));
        console.log('Local storage token:', localStorage.getItem('medlink_token'));
        console.log('isAuthenticated:', isAuthenticated);
        console.log('isAdmin:', user?.role === 'admin' || user?.role === 'superadmin');
      };

      (window as any).createTestAdmin = () => {
        console.log('🔧 Creating test admin user...');
        const adminUser = {
          id: 'admin-1',
          username: 'admin',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          status: 'Active'
        };
        
        localStorage.setItem('medlink_user', JSON.stringify(adminUser));
        localStorage.setItem('medlink_token', 'test-admin-token');
        console.log('✅ Test admin created. Reload the page to see changes.');
      };

      (window as any).createTestSuperAdmin = () => {
        console.log('🔧 Creating test super admin user...');
        const superAdminUser = {
          id: 'superadmin-1',
          username: 'superadmin',
          role: 'superadmin',
          firstName: 'Super',
          lastName: 'Admin',
          status: 'Active'
        };
        
        localStorage.setItem('medlink_user', JSON.stringify(superAdminUser));
        localStorage.setItem('medlink_token', 'test-superadmin-token');
        console.log('✅ Test super admin created. Reload the page to see changes.');
      };
    }
  }, [user, isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
