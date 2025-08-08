import { useState, useEffect } from 'react';
import { GameSession } from '@/app/game/services/gameSessionService';
import type { Patient } from '@/types/patient';

interface UseSessionSelectionReturn {
  selectedSession: GameSession | null;
  setSelectedSession: (session: GameSession | null) => void;
}

export function useSessionSelection(selectedPatient: Patient | null): UseSessionSelectionReturn {
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);

  // Clear selected session when patient changes
  useEffect(() => {
    setSelectedSession(null);
  }, [selectedPatient?.id]);

  return {
    selectedSession,
    setSelectedSession
  };
}
