"use client";

import AuthLayout from "@/components/AuthLayout";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestLaboratory() {
  const { t } = useLanguage();

  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('navigation.testLaboratory')}
              </h1>
              <p className="text-gray-600 mb-8">
                {t('navigation.testLaboratoryDescription')}
              </p>
              
              {/* Placeholder content for test laboratory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Create Custom Tests</h3>
                  <p className="text-purple-700 mb-4">Design and configure custom speech evaluation tests</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">Test Templates</h3>
                  <p className="text-indigo-700 mb-4">Access pre-built test templates for common speech evaluations</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
                  <h3 className="text-lg font-semibold text-teal-900 mb-2">Test Configuration</h3>
                  <p className="text-teal-700 mb-4">Configure test parameters, scoring, and evaluation criteria</p>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                    Coming Soon
                  </button>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">Test Management</h3>
                  <p className="text-orange-700 mb-4">Manage, edit, and organize your custom test library</p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthLayout>
  );
}
