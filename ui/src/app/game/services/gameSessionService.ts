import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GameSession {
  id: string;
  patientId: string;
  userId: string;
  patient: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
  startTime: Date;
  endTime?: Date;
  totalDuration?: number; // in seconds
  totalQuestions: number;
  answeredQuestions: number;
  finalScore: number;
  maxScore: number;
  percentage: number;
  answers: GameSessionAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSessionAnswer {
  questionId: number;
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  transcription: string;
  isCorrect: boolean;
  points: number;
  timeToAnswer: number; // in seconds
  timestamp: Date;
}

export interface CreateGameSessionData {
  patientId: string;
  userId: string;
  patient: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
  totalQuestions: number;
  maxScore: number;
}

export class GameSessionService {
  /**
   * Get the game sessions collection reference for a specific user
   */
  private static getGameSessionsCollection(userId: string) {
    return collection(db, 'users', userId, 'gameSessions');
  }

  /**
   * Get a game session document reference
   */
  private static getGameSessionDoc(userId: string, sessionId: string) {
    return doc(db, 'users', userId, 'gameSessions', sessionId);
  }

  /**
   * Create a new game session
   */
  static async createGameSession(sessionData: CreateGameSessionData): Promise<GameSession> {
    try {
      const now = new Date();
      const sessionDoc = {
        ...sessionData,
        patient: {
          ...sessionData.patient,
          dateOfBirth: Timestamp.fromDate(sessionData.patient.dateOfBirth)
        },
        startTime: Timestamp.fromDate(now),
        answeredQuestions: 0,
        finalScore: 0,
        percentage: 0,
        answers: [],
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const sessionsCollection = this.getGameSessionsCollection(sessionData.userId);
      const docRef = await addDoc(sessionsCollection, sessionDoc);

      return {
        id: docRef.id,
        ...sessionData,
        startTime: now,
        answeredQuestions: 0,
        finalScore: 0,
        percentage: 0,
        answers: [],
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating game session:', error);
      throw new Error('Failed to create game session');
    }
  }

  /**
   * Update game session with final results
   */
  static async completeGameSession(
    userId: string,
    sessionId: string,
    results: {
      endTime: Date;
      totalDuration: number;
      answeredQuestions: number;
      finalScore: number;
      percentage: number;
      answers: GameSessionAnswer[];
    }
  ): Promise<void> {
    try {
      const sessionDocRef = this.getGameSessionDoc(userId, sessionId);

      const updateData = {
        endTime: Timestamp.fromDate(results.endTime),
        totalDuration: results.totalDuration,
        answeredQuestions: results.answeredQuestions,
        finalScore: results.finalScore,
        percentage: results.percentage,
        answers: results.answers.map(answer => ({
          ...answer,
          timestamp: Timestamp.fromDate(answer.timestamp)
        })),
        updatedAt: Timestamp.fromDate(new Date())
      };

      await updateDoc(sessionDocRef, updateData);
    } catch (error) {
      console.error('Error completing game session:', error);
      throw new Error('Failed to complete game session');
    }
  }

  /**
   * Get game sessions for a patient
   */
  static async getPatientGameSessions(
    userId: string,
    patientId: string,
    gameSessionId?: string,
    options?: {
      limitCount?: number;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<GameSession[]> {
    try {
      const sessionsCollection = this.getGameSessionsCollection(userId);
      let q = query(
        sessionsCollection,
        where('patientId', '==', patientId),
        orderBy('startTime', options?.sortOrder || 'desc')
      );

      if (options?.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          patient: {
            ...data.patient,
            dateOfBirth: data.patient.dateOfBirth.toDate()
          },
          startTime: data.startTime.toDate(),
          endTime: data.endTime ? data.endTime.toDate() : undefined,
          answers: data.answers?.map((answer: any) => ({
            ...answer,
            timestamp: answer.timestamp.toDate()
          })) || [],
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as GameSession;
      });
    } catch (error) {
      console.error('Error getting patient game sessions:', error);
      throw new Error('Failed to get patient game sessions');
    }
  }

  /**
   * Get all game sessions for a user
   */
  static async getUserGameSessions(
    userId: string,
    options?: {
      limitCount?: number;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<GameSession[]> {
    try {
      const sessionsCollection = this.getGameSessionsCollection(userId);
      let q = query(
        sessionsCollection,
        orderBy('startTime', options?.sortOrder || 'desc')
      );

      if (options?.limitCount) {
        q = query(q, limit(options.limitCount));
      }

      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          patient: {
            ...data.patient,
            dateOfBirth: data.patient.dateOfBirth.toDate()
          },
          startTime: data.startTime.toDate(),
          endTime: data.endTime ? data.endTime.toDate() : undefined,
          answers: data.answers?.map((answer: any) => ({
            ...answer,
            timestamp: answer.timestamp.toDate()
          })) || [],
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as GameSession;
      });
    } catch (error) {
      console.error('Error getting user game sessions:', error);
      throw new Error('Failed to get user game sessions');
    }
  }

  /**
   * Get game session statistics for a patient
   */
  static async getPatientStats(userId: string, patientId: string): Promise<{
    totalSessions: number;
    averageScore: number;
    bestScore: number;
    averagePercentage: number;
    totalQuestionsAnswered: number;
    lastSessionDate?: Date;
  }> {
    try {
      const sessions = await this.getPatientGameSessions(userId, patientId);

      if (sessions.length === 0) {
        return {
          totalSessions: 0,
          averageScore: 0,
          bestScore: 0,
          averagePercentage: 0,
          totalQuestionsAnswered: 0,
          lastSessionDate: undefined
        };
      }

      const completedSessions = sessions.filter(s => s.endTime);
      
      const totalScore = completedSessions.reduce((sum, s) => sum + s.finalScore, 0);
      const totalPercentage = completedSessions.reduce((sum, s) => sum + s.percentage, 0);
      const totalQuestions = completedSessions.reduce((sum, s) => sum + s.answeredQuestions, 0);

      return {
        totalSessions: sessions.length,
        averageScore: completedSessions.length > 0 ? totalScore / completedSessions.length : 0,
        bestScore: completedSessions.length > 0 ? Math.max(...completedSessions.map(s => s.finalScore)) : 0,
        averagePercentage: completedSessions.length > 0 ? totalPercentage / completedSessions.length : 0,
        totalQuestionsAnswered: totalQuestions,
        lastSessionDate: sessions[0]?.startTime
      };
    } catch (error) {
      console.error('Error getting patient stats:', error);
      throw new Error('Failed to get patient statistics');
    }
  }
}
