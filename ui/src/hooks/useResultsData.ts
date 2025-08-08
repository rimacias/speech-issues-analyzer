import { useState, useEffect } from 'react';
import { GameSessionService, GameSession } from '@/app/game/services/gameSessionService';
import { PatientService } from '@/lib/patient-service';
import type { Patient } from '@/types/patient';

interface UseResultsDataReturn {
  loading: boolean;
  error: string | null;
  patients: Patient[];
  gameSessions: GameSession[];
  refreshData: () => Promise<void>;
}

export function useResultsData(
  userId: string | undefined,
  selectedPatient: Patient | null
): UseResultsDataReturn {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);

  const loadPatients = async () => {
    if (!userId) return [];

    return await PatientService.getPatients(userId, {
      activeOnly: true,
      sortBy: 'firstName',
      sortOrder: 'asc'
    });
  };

  const loadAllSessions = async () => {
    if (!userId) return [];

    return await GameSessionService.getUserGameSessions(userId, {
      limitCount: 50,
      sortOrder: 'desc'
    });
  };

  const loadPatientSessions = async (patientId: string) => {
    if (!userId) return [];

    return await GameSessionService.getPatientGameSessions(
      userId,
      patientId,
      { limitCount: 20, sortOrder: 'desc' }
    );
  };

  const refreshData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      // Always load patients
      const patientsData = await loadPatients();
      setPatients(patientsData);

      if (selectedPatient?.id) {
        // Load patient-specific data
        const sessions = await loadPatientSessions(selectedPatient.id);
        setGameSessions(sessions);
      } else {
        // Load all sessions when no patient is selected
        const allSessions = await loadAllSessions();
        setGameSessions(allSessions);
      }
    } catch (err) {
      console.error('Error loading results data:', err);
      setError('Failed to load results data');
    } finally {
      setLoading(false);
    }
  };

  // Load data when userId or selectedPatient changes
  useEffect(() => {
    refreshData();
  }, [userId, selectedPatient?.id]);

  return {
    loading,
    error,
    patients,
    gameSessions,
    refreshData
  };
}
