"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { PatientService } from '@/lib/patient-service';
import type { Patient } from '@/types/patient';

interface PatientSelectionProps {
  onPatientSelected: (patient: Patient) => void;
}

export function PatientSelection({ onPatientSelected }: PatientSelectionProps) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  useEffect(() => {
    const loadPatients = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const patientsList = await PatientService.getPatients(user.uid, {
          activeOnly: true,
          sortBy: 'firstName',
          sortOrder: 'asc'
        });
        setPatients(patientsList);
      } catch (err) {
        console.error('Error loading patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [user?.uid]);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleStartGame = () => {
    const selectedPatient = patients.find(p => p.id === selectedPatientId);
    if (selectedPatient) {
      onPatientSelected(selectedPatient);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <h3 className="font-semibold mb-2">No Patients Available</h3>
            <p>You need to create a patient before starting a game session.</p>
          </div>
          <button
            onClick={() => window.location.href = '/patients'}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Create Patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎮 Speech Test Game
          </h1>
          <p className="text-gray-600">
            Select a patient to start the speech evaluation game
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Choose Patient:
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {patients.map((patient) => (
              <label
                key={patient.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPatientId === patient.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="patient"
                  value={patient.id}
                  checked={selectedPatientId === patient.id}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {patient.email}
                  </p>
                  {patient.speechIssues && patient.speechIssues.length > 0 && (
                    <div className="mt-2">
                      <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        Speech Issues: {patient.speechIssues[0].type}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`ml-4 w-4 h-4 rounded-full border-2 ${
                  selectedPatientId === patient.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPatientId === patient.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartGame}
            disabled={!selectedPatientId}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              selectedPatientId
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Start Game Session
          </button>
        </div>
      </div>
    </div>
  );
}
