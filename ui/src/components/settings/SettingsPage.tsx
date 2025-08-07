'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faExclamationTriangle,
  faSpinner,
  faUser,
  faCog,
  faSignOutAlt,
  faBell,
  faEnvelope,
  faMobile,
  faCalendarAlt,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { settings, updateSettings, loading, error } = useUserSettings();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    setSaveStatus('saving');
    const success = await updateSettings({ theme });
    setSaveStatus(success ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleNotificationChange = async (type: string, value: boolean) => {
    setSaveStatus('saving');
    const success = await updateSettings({
      notifications: {
        ...settings?.notifications,
        [type]: value
      }
    });
    setSaveStatus(success ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handlePreferenceChange = async (type: string, value: any) => {
    setSaveStatus('saving');
    const success = await updateSettings({
      preferences: {
        ...settings?.preferences,
        [type]: value
      }
    });
    setSaveStatus(success ? 'saved' : 'error');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          <button
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
            onClick={() => window.location.reload()}
          >
            {t('common.takingTooLong')}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('settings.errorLoadingSettings')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {t('settings.general')} {t('settings.appearance')}
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                {t('common.backToHome')}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{t('common.error')}</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-md ${
            saveStatus === 'saving' ? 'bg-blue-50 border border-blue-200' :
            saveStatus === 'saved' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {saveStatus === 'saving' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              )}
              <span className={`text-sm font-medium ${
                saveStatus === 'saving' ? 'text-blue-800' :
                saveStatus === 'saved' ? 'text-green-800' :
                'text-red-800'
              }`}>
                {saveStatus === 'saving' && t('common.saving')}
                {saveStatus === 'saved' && t('common.saved')}
                {saveStatus === 'error' && t('common.error')}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('settings.language')}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {t('settings.languageDescription')}
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t('settings.language')}
                  </label>
                  <p className="text-sm text-gray-500">
                    {t('settings.languageInterfaceDescription')}
                  </p>
                </div>
                <LanguageSwitcher variant="dropdown" />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('settings.appearance')}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {t('settings.appearanceDescription')}
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('settings.theme')}</label>
                  <div className="mt-2 space-y-2">
                    {['light', 'dark', 'system'].map((theme) => (
                      <label key={theme} className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value={theme}
                          checked={settings?.theme === theme}
                          onChange={() => handleThemeChange(theme as any)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {t(`settings.themes.${theme}`)} {theme === 'system' ? `(${t('settings.themes.auto')})` : ''}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('settings.notifications')}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {t('settings.notificationsDescription')}
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {[
                  { key: 'email', label: t('settings.notificationTypes.email') },
                  { key: 'push', label: t('settings.notificationTypes.push') },
                  { key: 'sessions', label: t('settings.notificationTypes.sessions') },
                  { key: 'reports', label: t('settings.notificationTypes.reports') }
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {notification.label}
                      </label>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.notifications?.[notification.key as keyof typeof settings.notifications] ?? true}
                        onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('settings.preferencesSection')}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {t('settings.preferencesDescription')}
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">{t('settings.preferences.dateFormat')}</label>
                  <select
                    value={settings?.preferences?.dateFormat || 'MM/DD/YYYY'}
                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{t('settings.preferences.autoSave')}</label>
                    <p className="text-sm text-gray-500">{t('settings.preferences.autoSaveDescription')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.preferences?.autoSave ?? true}
                      onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
