import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      home: 'Home',
      about: 'About',
      contact: 'Contact',
      emergency: 'Emergency',
      admin: 'Admin',
      doctor: 'Doctor',
      superadmin: 'Super Admin',
      dashboard: 'Dashboard',
      patients: 'Patients',
      medicalRecords: 'Medical Records',
      appointments: 'Appointments',
      settings: 'Settings',
      profile: 'Profile',
      search: 'Search',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      // Header translations
      header: {
        home: 'Home',
        about: 'About',
        features: 'Features',
        contact: 'Contact',
        login: 'Login',
        signup: 'Sign Up'
      },
      // Hero translations
      hero: {
        title: 'Revolutionizing Healthcare Management',
        subtitle: 'Streamline your medical records, enhance patient care, and improve healthcare delivery with our comprehensive platform.',
        cta: 'Get Started',
        learnMore: 'Learn More'
      },
      // Features translations
      features: {
        title: 'Advanced Features'
      },
      // User translations
      user: {
        signOut: 'Sign Out'
      }
    }
  },
  np: {
    translation: {
      welcome: 'स्वागत छ',
      login: 'लगइन',
      register: 'दर्ता गर्नुहोस्',
      logout: 'लगआउट',
      home: 'गृह',
      about: 'बारेमा',
      contact: 'सम्पर्क',
      emergency: 'आकस्मिक',
      admin: 'प्रशासक',
      doctor: 'डाक्टर',
      superadmin: 'सुपर एडमिन',
      dashboard: 'ड्यासबोर्ड',
      patients: 'रोगीहरू',
      medicalRecords: 'चिकित्सा रेकर्डहरू',
      appointments: 'भेटघाटहरू',
      settings: 'सेटिङहरू',
      profile: 'प्रोफाइल',
      search: 'खोज्नुहोस्',
      add: 'थप्नुहोस्',
      edit: 'सम्पादन गर्नुहोस्',
      delete: 'मेटाउनुहोस्',
      save: 'सुरक्षित गर्नुहोस्',
      cancel: 'रद्द गर्नुहोस्',
      submit: 'पेश गर्नुहोस्',
      loading: 'लोड हुँदैछ...',
      error: 'त्रुटि',
      success: 'सफल',
      warning: 'चेतावनी',
      info: 'जानकारी',
      // Header translations
      header: {
        home: 'गृह',
        about: 'बारेमा',
        features: 'विशेषताहरू',
        contact: 'सम्पर्क',
        login: 'लगइन',
        signup: 'साइन अप'
      },
      // Hero translations
      hero: {
        title: 'स्वास्थ्य सेवा व्यवस्थापनमा क्रान्ति',
        subtitle: 'हाम्रो व्यापक प्लेटफर्मसँग आफ्नो चिकित्सा रेकर्डहरू सुव्यवस्थित गर्नुहोस्, रोगी हेरचाह बढाउनुहोस्, र स्वास्थ्य सेवा वितरण सुधार गर्नुहोस्।',
        cta: 'सुरु गर्नुहोस्',
        learnMore: 'थप जान्नुहोस्'
      },
      // Features translations
      features: {
        title: 'उन्नत विशेषताहरू'
      },
      // User translations
      user: {
        signOut: 'साइन आउट'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
