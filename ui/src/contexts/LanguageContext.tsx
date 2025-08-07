'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserSettings } from '@/hooks/useUserSettings';
import '@/lib/i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  availableLanguages: { code: string; name: string; nativeName: string }[];
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' }
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t } = useTranslation();
  const { settings, updateLanguage, loading } = useUserSettings();

  // Initialize language from user settings when available
  useEffect(() => {
    if (settings?.language && settings.language !== i18n.language) {
      void i18n.changeLanguage(settings.language);
    }
  }, [settings?.language, i18n]);

  const changeLanguage = async (lang: string) => {
    // Update i18n immediately for responsive UI
    void i18n.changeLanguage(lang);

    // Save to database in background
    try {
      await updateLanguage(lang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
      // Could show a toast notification here
    }
  };

  useEffect(() => {
    // Set document language attribute for accessibility
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const value: LanguageContextType = {
    language: i18n.language,
    changeLanguage,
    t,
    availableLanguages,
    isLoading: loading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
