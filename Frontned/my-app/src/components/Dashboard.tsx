import React, { useState, useEffect } from 'react';
import { 
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,

  EyeIcon,
  PlusIcon,
  ChartBarIcon,
  DocumentTextIcon,
  HeartIcon,

} from '@heroicons/react/24/outline';
import { usePatients } from '../contexts/PatientContext';
import { useAuth } from '../contexts/AuthContext';
import type { Patient } from '../types/Patient';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  pendingAppointments: number;
  completedAppointments: number;
  criticalAlerts: number;
  recentUpdates: number;
}

interface RecentActivity {
  id: string;
  type: 'patient_added' | 'appointment_scheduled' | 'test_result' | 'medication_update' | 'emergency_alert';
  description: string;
  timestamp: string;
  patientName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { patients, loading, error } = usePatients();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    criticalAlerts: 0,
    recentUpdates: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month'>('week');

  useEffect(() => {
    if (patients && patients.length > 0) {
      // Calculate dashboard statistics from patient data
      const activePatients = patients.filter((patient: Patient) => patient.status === 'Active').length;
      const criticalAlerts = patients.filter((patient: Patient) => 
        patient.medicalHistory?.toLowerCase().includes('critical') || 
        patient.allergies?.toLowerCase().includes('severe')
      ).length;

      setStats({
        totalPatients: patients.length,
        activePatients,
        pendingAppointments: 0, // TODO: Replace with real appointment data
        completedAppointments: 0, // TODO: Replace with real appointment data
        criticalAlerts,
        recentUpdates: patients.filter((patient: Patient) => 
          patient.lastUpdated && 
          new Date(patient.lastUpdated) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      });

      // Generate sample recent activities based on patient data
      const activities: RecentActivity[] = patients.slice(0, 5).map((patient: Patient, index: number) => ({
        id: `activity_${index}`,
        type: ['patient_added', 'test_result', 'medication_update'][Math.floor(Math.random() * 3)] as any,
        description: `Patient ${patient.name} ${['was added to the system', 'has new test results', 'medication was updated'][Math.floor(Math.random() * 3)]}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        patientName: patient.name,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any
      }));

      setRecentActivities(activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  }, [patients]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'patient_added':
        return <UserIcon className="h-5 w-5 text-blue-600" />;
      case 'appointment_scheduled':
        return <CalendarIcon className="h-5 w-5 text-green-600" />;
      case 'test_result':
        return <DocumentTextIcon className="h-5 w-5 text-purple-600" />;
      case 'medication_update':
        return <HeartIcon className="h-5 w-5 text-red-600" />;
      case 'emergency_alert':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'Inactive':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'Pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.firstName || user?.username}! Here's an overview of your healthcare system.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {/* Total Patients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

          {/* Active Patients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activePatients}</p>
              </div>
            </div>
      </div>

          {/* Pending Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingAppointments}</p>
              </div>
                </div>
              </div>

          {/* Completed Appointments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedAppointments}</p>
              </div>
            </div>
      </div>

          {/* Critical Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.criticalAlerts}</p>
                  </div>
                  </div>
                </div>

          {/* Recent Updates */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <ArrowUpIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Updates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentUpdates}</p>
              </div>
              </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                  View All
                </button>
              </div>
              
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recent activities</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Activities will appear here as they occur.
                  </p>
                </div>
              ) : (
        <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()} • {activity.patientName}
                    </p>
                  </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                </div>
              </div>
            ))}
          </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Patient Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add New Patient
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Schedule Appointment
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  View Reports
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  Emergency Portal
                </button>
              </div>
            </div>

            {/* Patient Status Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Status Overview</h3>
              <div className="space-y-3">
                {patients && patients.slice(0, 5).map((patient: Patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(patient.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{patient.mrn}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(!patients || patients.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No patients found</p>
                  </div>
                )}
        </div>
      </div>

            {/* System Health */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Services</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Online
            </span>
        </div>
                  <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    75% Used
                      </span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
