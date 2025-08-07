import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import type { Patient, CreatePatientData, UpdatePatientData } from '@/types/patient';

export class PatientService {
  /**
   * Get the patients collection reference for a specific user
   */
  private static getPatientsCollection(userId: string) {
    return collection(db, 'users', userId, 'patients');
  }

  /**
   * Get a patient document reference for a specific user
   */
  private static getPatientDoc(userId: string, patientId: string) {
    return doc(db, 'users', userId, 'patients', patientId);
  }

  /**
   * Create a new patient in the database for a specific user
   */
  static async createPatient(userId: string, patientData: CreatePatientData): Promise<Patient> {
    try {
      const now = new Date();
      const patientDoc = {
        ...patientData,
        dateOfBirth: Timestamp.fromDate(patientData.dateOfBirth),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        isActive: true,
        userId // Add userId to the patient document for reference
      };

      const patientsCollection = this.getPatientsCollection(userId);
      const docRef = await addDoc(patientsCollection, patientDoc);

      return {
        id: docRef.id,
        ...patientData,
        createdAt: now,
        updatedAt: now,
        isActive: true,
        userId
      };
    } catch (error) {
      console.error('Error creating patient:', error);
      throw new Error('Failed to create patient');
    }
  }

  /**
   * Get a patient by ID for a specific user
   */
  static async getPatient(userId: string, patientId: string): Promise<Patient | null> {
    try {
      const patientDocRef = this.getPatientDoc(userId, patientId);
      const patientDoc = await getDoc(patientDocRef);

      if (!patientDoc.exists()) {
        return null;
      }

      const data = patientDoc.data();
      return {
        id: patientDoc.id,
        ...data,
        dateOfBirth: data.dateOfBirth.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Patient;
    } catch (error) {
      console.error('Error getting patient:', error);
      throw new Error('Failed to get patient');
    }
  }

  /**
   * Get all patients for a specific user
   */
  static async getPatients(userId: string, options?: {
    limitCount?: number;
    activeOnly?: boolean;
    sortBy?: 'createdAt' | 'updatedAt' | 'lastName' | 'firstName';
    sortOrder?: 'asc' | 'desc';
  }): Promise<Patient[]> {
    try {
      const patientsCollection = this.getPatientsCollection(userId);
      let q = query(patientsCollection);

      // Filter by active status if specified
      if (options?.activeOnly) {
        q = query(q, where('isActive', '==', true));
      }

      // Add sorting
      const sortBy = options?.sortBy || 'createdAt';
      const sortOrder = options?.sortOrder || 'desc';
      q = query(q, orderBy(sortBy, sortOrder));

      // Add limit if specified
      if (options?.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Patient;
      });
    } catch (error) {
      console.error('Error getting patients:', error);
      throw new Error('Failed to get patients');
    }
  }

  /**
   * Update a patient for a specific user
   */
  static async updatePatient(userId: string, patientId: string, updateData: UpdatePatientData): Promise<Patient> {
    try {
      const patientDocRef = this.getPatientDoc(userId, patientId);

      // Prepare update data
      const updateDoc = {
        ...updateData,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Convert dateOfBirth to Timestamp if it's being updated
      if (updateData.dateOfBirth) {
        updateDoc.dateOfBirth = Timestamp.fromDate(updateData.dateOfBirth);
      }

      await updateDoc(patientDocRef, updateDoc);

      // Get and return the updated patient
      const updatedPatient = await this.getPatient(userId, patientId);
      if (!updatedPatient) {
        throw new Error('Patient not found after update');
      }

      return updatedPatient;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw new Error('Failed to update patient');
    }
  }

  /**
   * Soft delete a patient (mark as inactive) for a specific user
   */
  static async deletePatient(userId: string, patientId: string): Promise<void> {
    try {
      const patientDocRef = this.getPatientDoc(userId, patientId);
      await updateDoc(patientDocRef, {
        isActive: false,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw new Error('Failed to delete patient');
    }
  }

  /**
   * Hard delete a patient (permanently remove) for a specific user
   */
  static async hardDeletePatient(userId: string, patientId: string): Promise<void> {
    try {
      const patientDocRef = this.getPatientDoc(userId, patientId);
      await deleteDoc(patientDocRef);
    } catch (error) {
      console.error('Error hard deleting patient:', error);
      throw new Error('Failed to permanently delete patient');
    }
  }

  /**
   * Search patients by name for a specific user
   */
  static async searchPatients(userId: string, searchTerm: string): Promise<Patient[]> {
    try {
      const patientsCollection = this.getPatientsCollection(userId);

      // Firestore doesn't support full-text search, so we'll get all patients
      // and filter on the client side. For better performance, consider using
      // Algolia or another search service for production applications.
      const q = query(
        patientsCollection,
        where('isActive', '==', true),
        orderBy('lastName')
      );

      const querySnapshot = await getDocs(q);
      const allPatients = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Patient;
      });

      // Filter by search term (case-insensitive)
      const searchLower = searchTerm.toLowerCase();
      return allPatients.filter(patient =>
        patient.firstName.toLowerCase().includes(searchLower) ||
        patient.lastName.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching patients:', error);
      throw new Error('Failed to search patients');
    }
  }

  /**
   * Get patient statistics for a specific user
   */
  static async getPatientStats(userId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    try {
      const patientsCollection = this.getPatientsCollection(userId);
      const allPatientsQuery = query(patientsCollection);
      const activePatientsQuery = query(patientsCollection, where('isActive', '==', true));

      const [allSnapshot, activeSnapshot] = await Promise.all([
        getDocs(allPatientsQuery),
        getDocs(activePatientsQuery)
      ]);

      const total = allSnapshot.size;
      const active = activeSnapshot.size;
      const inactive = total - active;

      return { total, active, inactive };
    } catch (error) {
      console.error('Error getting patient stats:', error);
      throw new Error('Failed to get patient statistics');
    }
  }
}
