import type { Patient, MedicalRecord, Prescription, MedicalImage, MedicalTest } from '../types/Patient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('medlink_token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// API Service class
export class ApiService {
  // Authentication endpoints
  static async login(credentials: { username: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  }

  static async register(userData: {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    contactNumber?: string;
    dateOfBirth?: string;
    gender?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  }

  static async logout() {
    const token = getAuthToken();
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async getProfile() {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async updateProfile(profileData: Partial<Patient>) {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  }

  // Patient endpoints
  static async getMyPatientData(): Promise<Patient> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/patients/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/patients/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    return handleResponse(response);
  }

  static async updatePatient(patientId: string, patientData: Partial<Patient>): Promise<Patient> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientData)
    });
    return handleResponse(response);
  }

  // Medical Records endpoints
  static async getMedicalRecords(): Promise<MedicalRecord[]> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/medical-records/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async getMedicalRecord(recordId: string): Promise<MedicalRecord> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/medical-records/${recordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async createMedicalRecord(recordData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/medical-records/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recordData)
    });
    return handleResponse(response);
  }

  // Prescriptions endpoints
  static async getPrescriptions(): Promise<Prescription[]> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/prescriptions/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async createPrescription(prescriptionData: Partial<Prescription>): Promise<Prescription> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/prescriptions/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prescriptionData)
    });
    return handleResponse(response);
  }

  // File upload endpoints
  static async uploadFile(file: File, fileType: string): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  }

  static async getMyFiles(): Promise<any[]> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/files/my-files`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  // Dashboard endpoints
  static async getUserDashboard(): Promise<any> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/dashboard/user-dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }

  static async downloadAllData(): Promise<Blob> {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/dashboard/download-all-data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.blob();
  }

  // Health check
  static async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  }

  // Emergency search endpoint - NO authentication required
  static async emergencySearch(searchType: 'nid' | 'mrn', searchValue: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/patients/emergency/search?searchType=${searchType}&searchValue=${encodeURIComponent(searchValue)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
  }
}

// Export default instance
export default ApiService;
