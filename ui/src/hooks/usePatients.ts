import { useState, useEffect, useCallback } from 'react';
import { Patient, CreatePatientData, UpdatePatientData } from '@/types/patient';
import { PatientService } from '@/lib/patient-service';
import { useAuth } from '@/lib/auth-context';

export const usePatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    if (!user?.uid) {
      setPatients([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const patientsData = await PatientService.getPatients(user.uid, {
        activeOnly: true,
        sortBy: 'firstName',
        sortOrder: 'asc'
      });
      setPatients(patientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const createPatient = useCallback(async (patientData: CreatePatientData): Promise<Patient | null> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const newPatient = await PatientService.createPatient(user.uid, patientData);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const updatePatient = useCallback(async (id: string, updateData: UpdatePatientData): Promise<Patient | null> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const updatedPatient = await PatientService.updatePatient(user.uid, id, updateData);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const deletePatient = useCallback(async (id: string): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      await PatientService.deletePatient(user.uid, id);
      setPatients(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Auto-load patients when user changes
  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  return {
    patients,
    loading,
    error,
    loadPatients,
    createPatient,
    updatePatient,
    deletePatient
  };
};

export const usePatient = (patientId?: string) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatient = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const patientData = await PatientService.getPatientById(id);
      setPatient(patientData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSpeechIssue = useCallback(async (
    speechIssue: {
      type: string;
      severity: 'mild' | 'moderate' | 'severe';
      description?: string;
      dateReported: Date;
    }
  ): Promise<boolean> => {
    if (!patient?.id) return false;

    setLoading(true);
    setError(null);
    try {
      const updatedPatient = await PatientService.addSpeechIssue(patient.id, speechIssue);
      setPatient(updatedPatient);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add speech issue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  const addSession = useCallback(async (sessionId: string): Promise<boolean> => {
    if (!patient?.id) return false;

    setLoading(true);
    setError(null);
    try {
      const updatedPatient = await PatientService.addSession(patient.id, sessionId);
      setPatient(updatedPatient);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add session');
      return false;
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => {
    if (patientId) {
      loadPatient(patientId);
    }
  }, [patientId, loadPatient]);

  return {
    patient,
    loading,
    error,
    addSpeechIssue,
    addSession,
    refreshPatient: () => patient?.id && loadPatient(patient.id)
  };
};
