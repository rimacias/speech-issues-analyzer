'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/lib/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'toggle';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'dropdown'
}) => {
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  const { updateSettings } = useUserSettings();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (newLanguage: string) => {
    setIsUpdating(true);
    try {
      // Update the language context first
      changeLanguage(newLanguage);

      // If user is authenticated, update their profile in the database
      if (user) {
        await updateSettings({ language: newLanguage });
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Error updating language in profile:', error);
      // Language context was already changed, so we don't need to revert it
      // The user will see the new language but the database update failed
    } finally {
      setIsUpdating(false);
    }
  };

  if (variant === 'toggle') {
    // Simple toggle between two languages
    const currentLang = availableLanguages.find(lang => lang.code === language);
    const otherLang = availableLanguages.find(lang => lang.code !== language);

    return (
      <button
        onClick={() => handleLanguageChange(otherLang?.code || 'en')}
        disabled={isUpdating}
        className={`px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={`Switch to ${otherLang?.nativeName}`}
      >
        {isUpdating ? '...' : currentLang?.code.toUpperCase()}
      </button>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdating}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {isUpdating ? (
            <>
              <span className="animate-pulse">Updating...</span>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 ml-2"></div>
            </>
          ) : (
            <>
              {availableLanguages.find(lang => lang.code === language)?.nativeName}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`-mr-1 ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </>
          )}
        </button>
      </div>

      {isOpen && !isUpdating && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  className={`${
                    language === lang.code
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150`}
                  role="menuitem"
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang.nativeName}</span>
                    {language === lang.code && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="h-4 w-4 text-blue-600"
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
