import { useState, useEffect, useCallback } from 'react';
import { Patient, CreatePatientData, UpdatePatientData } from '@/types/patient';
import { PatientService } from '@/lib/patient-service';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const patientsData = await PatientService.getAllActivePatients();
      setPatients(patientsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (patientData: CreatePatientData): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    try {
      const newPatient = await PatientService.createPatient(patientData);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: string, updateData: UpdatePatientData): Promise<Patient | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedPatient = await PatientService.updatePatient(id, updateData);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePatient = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await PatientService.deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete patient');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPatients = useCallback(async (searchTerm: string): Promise<Patient[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await PatientService.searchPatients(searchTerm);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search patients');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    refreshPatients: loadPatients
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
