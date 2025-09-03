import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  switchLanguage: (lang: string) => void;
  isEnglish: boolean;
  isNepali: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    try {
      const savedLang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'en' : 'en';
      setCurrentLanguage(savedLang);
    } catch (error) {
      console.warn('Error accessing localStorage for language:', error);
      setCurrentLanguage('en');
    }
  }, []);

  const switchLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('i18nextLng', lang);
      }
    } catch (error) {
      console.warn('Error saving language to localStorage:', error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    switchLanguage,
    isEnglish: currentLanguage === 'en',
    isNepali: currentLanguage === 'np',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
