import { useState, useCallback } from 'react';
import { GameQuestion, GameAnswer, GameResult, GameStats } from '../types';
import { GameLogicService } from '../services/gameLogic';

interface UseGameStateProps {
  questions: GameQuestion[];
}

export function useGameState({ questions }: UseGameStateProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [userAnswer, setUserAnswer] = useState("");

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
  }, []);

  const checkAnswer = useCallback((answer: string) => {
    const isCorrect = GameLogicService.checkAnswer(answer, currentQuestion);

    const result: GameResult = {
      correct: isCorrect,
      expected: currentQuestion.expectedAnswer,
      got: answer
    };

    const answerRecord = GameLogicService.createAnswerRecord(
      currentQuestion,
      answer,
      isCorrect
    );

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
  }, [currentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setLastResult(null);
      setUserAnswer("");
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
  }, []);

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

    // Actions
    startGame,
    checkAnswer,
    nextQuestion,
    resetGame
  };
}
