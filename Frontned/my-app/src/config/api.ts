// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      REFRESH: '/auth/token/refresh/',
      PROFILE: '/auth/profile/',
      LOGOUT: '/auth/logout/'
    },
    DOCTORS: {
      LIST: '/doctors/',
      CREATE: '/doctors/',
      UPDATE: (id: string) => `/doctors/${id}/`,
      DELETE: (id: string) => `/doctors/${id}/`,
      COUNT: '/doctors/count',
      SEARCH_NID: (nid: string) => `/doctors/search/nid/${nid}`
    },
    PATIENTS: {
      LIST: '/patients/',
      CREATE: '/patients/',
      UPDATE: (id: string) => `/patients/${id}/`,
      DELETE: (id: string) => `/patients/${id}/`,
      COUNT: '/patients/count'
    },
    MEDICAL_RECORDS: {
      LIST: '/medical-records/',
      CREATE: '/medical-records/',
      UPDATE: (id: string) => `/medical-records/${id}/`,
      DELETE: (id: string) => `/medical-records/${id}/`
    },
    PRESCRIPTIONS: {
      CREATE: '/prescriptions/',
      GET_USER: '/prescriptions/user',
      GET_DOCTOR: '/prescriptions/doctor',
      GET_PATIENT: (nid: string) => `/prescriptions/patient/${nid}`,
      GET_ONE: (id: string) => `/prescriptions/${id}`,
      UPDATE_STATUS: (id: string) => `/prescriptions/${id}/status`
    }
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// Helper function to get full backend URL
export const getBackendUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
