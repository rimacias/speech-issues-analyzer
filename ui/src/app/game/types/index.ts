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
