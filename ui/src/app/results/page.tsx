"use client";

import AuthLayout from "@/components/AuthLayout";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Results() {
  const { t } = useLanguage();

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('navigation.results')}
              </h1>
              <p className="text-gray-600 mb-8">
                {t('navigation.resultsDescription')}
              </p>

              {/* Placeholder content for results dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Results Overview</h3>
                  <p className="text-blue-700">Coming soon: Comprehensive test results and analytics dashboard</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Progress Tracking</h3>
                  <p className="text-green-700">Coming soon: Patient progress visualization and trends</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Performance Metrics</h3>
                  <p className="text-purple-700">Coming soon: Detailed performance analytics and insights</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}
