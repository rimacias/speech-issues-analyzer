"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResultsData } from '@/hooks/useResultsData';
import { useSessionSelection } from '@/hooks/useSessionSelection';
import type { Patient } from '@/types/patient';

// Components
import { SessionOverview } from '@/components/results/SessionOverview';
import { PatientSelector } from '@/components/results/PatientSelector';
import { SessionsList } from '@/components/results/SessionsList';
import { SessionDetails } from '@/components/results/SessionDetails';
import { ResultsStats } from '@/components/results/ResultsStats';

export default function ResultsPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Custom hooks for data management
    const {
        loading,
        error,
        patients,
        gameSessions,
        refreshData
    } = useResultsData(user?.uid, selectedPatient);

    const { selectedSession, setSelectedSession } = useSessionSelection(selectedPatient);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
                    <p className="text-gray-600">Please log in to view results.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="text-5xl mr-4">📊</span>
                        {t('navigation.results')}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {t('navigation.resultsDescription')}
                    </p>
                </div>

                {/* Patient Selector */}
                <div className="mb-8">
                    <PatientSelector
                        patients={patients}
                        selectedPatient={selectedPatient}
                        onPatientSelect={setSelectedPatient}
                        loading={loading}
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                        <button
                            onClick={refreshData}
                            className="ml-4 text-red-800 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-4 text-gray-600">Loading results...</span>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Results Statistics */}
                        {gameSessions.length > 0 && (
                            <ResultsStats
                                sessions={gameSessions}
                                patient={selectedPatient}
                            />
                        )}

                        {/* Sessions List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <SessionsList
                                    sessions={gameSessions}
                                    selectedSession={selectedSession}
                                    onSessionSelect={setSelectedSession}
                                />
                            </div>

                            {/* Session Details */}
                            <div>
                                {selectedSession ? (
                                    <SessionDetails
                                        session={selectedSession}
                                        onClose={() => setSelectedSession(null)}
                                    />
                                ) : (
                                    <SessionOverview
                                        sessions={gameSessions}
                                        patient={selectedPatient}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Empty State */}
                        {gameSessions.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎯</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {selectedPatient
                                        ? `No sessions found for ${selectedPatient.firstName} ${selectedPatient.lastName}`
                                        : 'No game sessions found'
                                    }
                                </h3>
                                <p className="text-gray-500">
                                    {selectedPatient
                                        ? 'This patient hasn\'t completed any game sessions yet.'
                                        : 'Start playing games to see results here.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
