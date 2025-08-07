'use client';

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { AppHeader } from '../../components/layout/AppHeader';
import PatientRegistrationForm from '../../components/patient/PatientRegistrationForm';

export default function PatientDemo() {
  const { t } = useLanguage();

  const handlePatientSuccess = (patient: any) => {
    alert(t('patient.registerSuccess'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title={t('patient.title')} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Demo Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('patient.registration')}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {t('dashboard.welcome')}
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  {t('settings.language')}:
                </label>
                <LanguageSwitcher variant="dropdown" />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Registration Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <PatientRegistrationForm onSuccess={handlePatientSuccess} />
          </div>
        </div>

        {/* Demo Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              {t('settings.language')} {t('dashboard.welcome')}
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>• {t('navigation.dashboard')}</p>
              <p>• {t('navigation.patients')}</p>
              <p>• {t('navigation.sessions')}</p>
              <p>• {t('navigation.analysis')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
