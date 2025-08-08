import type { Patient } from '@/types/patient';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient | null) => void;
  loading: boolean;
}

export function PatientSelector({ patients, selectedPatient, onPatientSelect, loading }: PatientSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-2xl mr-3">👥</span>
        Select Patient
      </h2>

      <div className="flex flex-wrap gap-3">
        {/* All Patients Option */}
        <button
          onClick={() => onPatientSelect(null)}
          disabled={loading}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            !selectedPatient
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          All Patients
        </button>

        {patients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => onPatientSelect(patient)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedPatient?.id === patient.id
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {patient.firstName} {patient.lastName}
          </button>
        ))}
      </div>

      {selectedPatient && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-900">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </h3>
              <p className="text-sm text-green-700">
                Age: {new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} •
                {selectedPatient.email}
              </p>
            </div>
            <button
              onClick={() => onPatientSelect(null)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {patients.length === 0 && !loading && (
        <div className="text-center py-6 text-gray-500">
          <div className="text-4xl mb-2">👥</div>
          <p>No patients found. Create a patient first to view results.</p>
        </div>
      )}
    </div>
  );
}
