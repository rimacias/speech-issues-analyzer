import { useState, useCallback } from 'react';
import { GameQuestion, GameAnswer, GameResult, GameStats, GameSessionData, DetailedGameAnswer } from '../types';
import { GameLogicService } from '../services/gameLogic';

interface UseGameStateProps {
  questions: GameQuestion[];
  sessionData?: GameSessionData;
}

export function useGameState({ questions, sessionData }: UseGameStateProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [answers, setAnswers] = useState<DetailedGameAnswer[]>([]);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const maxScore = GameLogicService.getTotalMaxScore(questions);

  const stats: GameStats = GameLogicService.calculateStats(
    score,
    currentQuestionIndex,
    totalQuestions,
    maxScore,
    answers
  );

  const startGame = useCallback(() => {
    setGameStarted(true);
    setQuestionStartTime(new Date());
  }, []);

  const checkAnswer = useCallback((answer: string, transcription: string = answer) => {
    const isCorrect = GameLogicService.checkAnswer(answer, currentQuestion);
    const now = new Date();
    const timeToAnswer = questionStartTime ? (now.getTime() - questionStartTime.getTime()) / 1000 : 0;

    const result: GameResult = {
      correct: isCorrect,
      expected: currentQuestion.expectedAnswer,
      got: answer
    };

    const answerRecord: DetailedGameAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      expected: currentQuestion.expectedAnswer,
      got: answer,
      transcription,
      correct: isCorrect,
      points: currentQuestion.points,
      timeToAnswer,
      timestamp: now
    };

    setLastResult(result);
    setUserAnswer(answer);
    setAnswers(prev => [...prev, answerRecord]);

    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
    }

    // Auto advance after 3 seconds
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  }, [currentQuestion, questionStartTime]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setLastResult(null);
      setUserAnswer("");
      setQuestionStartTime(new Date()); // Start timing for next question
    } else {
      setGameFinished(true);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const resetGame = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameStarted(false);
    setGameFinished(false);
    setLastResult(null);
    setUserAnswer("");
    setAnswers([]);
    setQuestionStartTime(null);
  }, []);

  // Calculate total game duration
  const getTotalDuration = useCallback(() => {
    if (!sessionData?.startTime) return 0;
    return (new Date().getTime() - sessionData.startTime.getTime()) / 1000;
  }, [sessionData?.startTime]);

  return {
    // State
    currentQuestion,
    currentQuestionIndex,
    score,
    gameStarted,
    gameFinished,
    answers,
    lastResult,
    userAnswer,
    stats,
    totalQuestions,
    maxScore,
    sessionData,

    // Actions
    startGame,
    checkAnswer,
    nextQuestion,
    resetGame,
    getTotalDuration
  };
}
