import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { switchLanguage, isEnglish } = useLanguage();
  const { } = useTranslation();

  const handleLanguageSwitch = () => {
    const newLang = isEnglish ? 'np' : 'en';
    switchLanguage(newLang);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLanguageSwitch}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isEnglish
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
        title={isEnglish ? 'Switch to Nepali' : 'Switch to English'}
      >
        {isEnglish ? 'नेपाली' : 'English'}
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {isEnglish ? 'EN' : 'NP'}
      </span>
    </div>
  );
};

export default LanguageSwitcher;
