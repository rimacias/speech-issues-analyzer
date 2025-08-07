import { GameQuestion, GameAnswer, GameStats } from '../types';

export class GameLogicService {
  static checkAnswer(userAnswer: string, question: GameQuestion): boolean {
    const cleanAnswer = userAnswer.toLowerCase().trim();
    return question.alternatives.some(alt =>
      cleanAnswer.includes(alt.toLowerCase()) || alt.toLowerCase().includes(cleanAnswer)
    );
  }

  static calculateStats(
    score: number,
    currentQuestionIndex: number,
    totalQuestions: number,
    maxScore: number,
    answers: GameAnswer[]
  ): GameStats {
    const correctAnswers = answers.filter(a => a.correct).length;
    const percentage = Math.round((score / maxScore) * 100);

    return {
      score,
      totalQuestions,
      maxScore,
      currentQuestionIndex,
      correctAnswers,
      percentage
    };
  }

  static createAnswerRecord(
    question: GameQuestion,
    userAnswer: string,
    isCorrect: boolean
  ): GameAnswer {
    return {
      question: question.question,
      expected: question.expectedAnswer,
      got: userAnswer,
      correct: isCorrect,
      points: isCorrect ? question.points : 0
    };
  }

  static getTotalMaxScore(questions: GameQuestion[]): number {
    return questions.reduce((sum, q) => sum + q.points, 0);
  }
}
