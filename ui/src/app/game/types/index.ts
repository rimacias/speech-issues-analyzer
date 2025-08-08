// Game types and interfaces
export interface GameQuestion {
  id: number;
  question: string;
  expectedAnswer: string;
  alternatives: string[];
  points: number;
}

export interface GameAnswer {
  question: string;
  expected: string;
  got: string;
  correct: boolean;
  points: number;
  timeToAnswer?: number; // in seconds
  timestamp?: Date;
}

export interface GameResult {
  correct: boolean;
  expected: string;
  got: string;
}

export interface GameStats {
  score: number;
  totalQuestions: number;
  maxScore: number;
  currentQuestionIndex: number;
  correctAnswers: number;
  percentage: number;
}

export interface AudioRecorderState {
  isRecording: boolean;
  isAnalyzing: boolean;
  audioUrl: string | null;
}

// New types for patient and session tracking
export interface GameSessionData {
  sessionId?: string;
  patientId: string;
  userId: string;
  patient: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
  };
  startTime: Date;
  questionStartTime?: Date;
}

export interface DetailedGameAnswer extends GameAnswer {
  questionId: number;
  transcription: string;
  timeToAnswer: number;
  timestamp: Date;
}
