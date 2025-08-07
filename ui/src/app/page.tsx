"use client";

import AuthLayout from "@/components/AuthLayout";
import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import PatientFormModal from "@/components/dashboard/PatientFormModal";

export default function Home() {
  return (
    <AuthLayout>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <DashboardContent />
          </div>
        </main>
        <PatientFormModal />
      </div>
    </AuthLayout>
  );
}