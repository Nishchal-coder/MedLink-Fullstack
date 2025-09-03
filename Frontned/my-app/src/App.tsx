import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PatientProvider } from './contexts/PatientContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import UserPanel from './components/UserPanel';
import LoadingSpinner from './components/LoadingSpinner';
// import ErrorBoundary from './components/ErrorBoundary';

// Optimized lazy loading with better chunking
const Home = lazy(() => import('./components/Home'));
const Contact = lazy(() => import('./components/Contact'));
const EmergencyPortal = lazy(() => import('./components/EmergencyPortal'));
// const SuperadminPage = lazy(() => import('./components/SuperadminPage')); // Not used in current routes
const AuthPage = lazy(() => import('./components/AuthPage'));

const Logout = lazy(() => import('./components/Logout'));

// TODO: Uncomment when components are created
// User components
// const UserProfile = lazy(() => import('./components/UserProfile'));
// const AppointmentPage = lazy(() => import('./components/AppointmentPage'));
// const MedicalRecords = lazy(() => import('./components/MedicalRecords'));
// const PrescriptionPage = lazy(() => import('./components/PrescriptionPage'));
// const HealthMetrics = lazy(() => import('./components/HealthMetrics'));

// Doctor components
// const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
// const PatientManagement = lazy(() => import('./components/PatientManagement'));
// const DoctorAppointments = lazy(() => import('./components/DoctorAppointments'));
// const DoctorPrescriptions = lazy(() => import('./components/DoctorPrescriptions'));

// Admin components
// const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
// const UserManagement = lazy(() => import('./components/UserManagement'));
// const DoctorManagement = lazy(() => import('./components/DoctorManagement'));
// const HospitalManagement = lazy(() => import('./components/HospitalManagement'));
// const Analytics = lazy(() => import('./components/Analytics'));

// Performance optimized App component
function App() {
  return (
    // <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <PatientProvider>
            <Router>
              <AuthProvider>
                <div className="App">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Home />} />
                      {/* <Route path="/about" element={<About />} /> */}
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/emergency" element={<EmergencyPortal />} />
                      <Route path="/auth-user" element={<AuthPage userType="user" />} />
                      <Route path="/auth-admin" element={<AuthPage userType="admin" />} />
                      <Route path="/auth-doctor" element={<AuthPage userType="doctor" />} />
                      <Route path="/auth/logout" element={<Logout />} />
                      
                      {/* Protected User routes */}
                      <Route 
                        path="/user" 
                        element={
                          <RoleProtectedRoute allowedRoles={['user']}>
                            <UserPanel />
                          </RoleProtectedRoute>
                        } 
                      />
                      {/* TODO: Uncomment when UserProfile component is created
                      <Route 
                        path="/user/profile" 
                        element={
                          <RoleProtectedRoute allowedRoles={['user']}>
                            <UserProfile />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when AppointmentPage component is created
                      <Route 
                        path="/user/appointments" 
                        element={
                          <RoleProtectedRoute allowedRoles={['user']}>
                            <AppointmentPage />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when MedicalRecords component is created
                      <Route 
                        path="/user/medical-records" 
                        element={
                          <RoleProtectedRoute allowedRoles={['user']}>
                            <MedicalRecords />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when PrescriptionPage component is created
                      <Route 
                        path="/user/prescriptions" 
                        element={
                          <RoleProtectedRoute allowedRoles={['user']}>
                            <PrescriptionPage />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when HealthMetrics component is created
                      <Route 
                        path="/user/health-metrics" 
                        element={
                          <RoleProtectedRoute allowedRoles={['user']}>
                            <HealthMetrics />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}

                      {/* Protected Doctor routes */}
                      {/* TODO: Uncomment when DoctorDashboard component is created
                      <Route 
                        path="/doctor" 
                        element={
                          <RoleProtectedRoute allowedRoles={['doctor']}>
                            <DoctorDashboard />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when PatientManagement component is created
                      <Route 
                        path="/doctor/patients" 
                        element={
                          <RoleProtectedRoute allowedRoles={['doctor']}>
                            <PatientManagement />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when DoctorAppointments component is created
                      <Route 
                        path="/doctor/appointments" 
                        element={
                          <RoleProtectedRoute allowedRoles={['doctor']}>
                            <DoctorAppointments />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when DoctorPrescriptions component is created
                      <Route 
                        path="/doctor/prescriptions" 
                        element={
                          <RoleProtectedRoute allowedRoles={['doctor']}>
                            <DoctorPrescriptions />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}

                      {/* Protected Admin routes */}
                      {/* TODO: Uncomment when AdminDashboard component is created
                      <Route 
                        path="/admin" 
                        element={
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when UserManagement component is created
                      <Route 
                        path="/admin/users" 
                        element={
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <UserManagement />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when DoctorManagement component is created
                      <Route 
                        path="/admin/doctors" 
                        element={
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <DoctorManagement />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when HospitalManagement component is created
                      <Route 
                        path="/admin/hospitals" 
                        element={
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <HospitalManagement />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                      {/* TODO: Uncomment when Analytics component is created
                      <Route 
                        path="/admin/analytics" 
                        element={
                          <RoleProtectedRoute allowedRoles={['admin']}>
                            <Analytics />
                          </RoleProtectedRoute>
                        } 
                      />
                      */}
                    </Routes>
                  </Suspense>
                </div>
              </AuthProvider>
            </Router>
          </PatientProvider>
        </LanguageProvider>
      </ThemeProvider>
    // </ErrorBoundary>
  );
}

export default App;
