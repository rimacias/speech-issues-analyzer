import React from 'react';
import { UserMenu } from '../common/UserMenu';
import {useLanguage} from "@/contexts/LanguageContext";
import {LanguageSwitcher} from "@/components/common/LanguageSwitcher";

interface AppHeaderProps {
  title?: string;
  showLanguageSwitcher?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showLanguageSwitcher = true
}) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {title || t('dashboard.welcome')}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('navigation.dashboard')}
            </a>
            <a
              href="/patients"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('navigation.patients')}
            </a>
            <a
              href="/sessions"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('navigation.sessions')}
            </a>
            <a
              href="/analysis"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              {t('navigation.analysis')}
            </a>
          </nav>

          {/* Right side - Language Switcher and User Menu */}
          <div className="flex items-center space-x-4">
            {showLanguageSwitcher && (
              <LanguageSwitcher variant="toggle" />
            )}

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
