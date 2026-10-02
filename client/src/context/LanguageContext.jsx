import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations.js';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('app_language') || localStorage.getItem('diet_quest_lang') || 'en';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('app_language', language);
    localStorage.setItem('diet_quest_lang', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ar') {
      setLanguageState(lang);
    }
  };

  const t = useCallback((key, params = {}) => {
    const langDict = translations[language] || translations.en;
    let text = langDict?.[key] || translations.en?.[key];

    // Bulletproof Fallback: Never display raw dot key paths like "diet.page_title"
    if (!text) {
      if (key === 'diet.page_title') {
        text = language === 'ar' ? 'خطة النظام الغذائي اليومي' : 'Daily Diet Plan';
      } else if (typeof key === 'string' && key.includes('.')) {
        const parts = key.split('.');
        const lastPart = parts[parts.length - 1];
        text = lastPart.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      } else {
        text = key || '';
      }
    }

    // Interpolate {param} values
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        lang: language,
        direction,
        isRTL,
        toggleLanguage,
        setLanguage,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
