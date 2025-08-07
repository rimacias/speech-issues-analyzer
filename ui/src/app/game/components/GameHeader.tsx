import {Card, ProgressBar} from "@/app/game/components/ui";
import {GameStats} from "@/app/game/types";

interface GameHeaderProps {
  stats: GameStats;
  currentQuestionPoints: number;
}

export function GameHeader({ stats, currentQuestionPoints }: GameHeaderProps) {
  return (
    <Card className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-3xl mr-2">📝</span>
            Pregunta {stats.currentQuestionIndex + 1} de {stats.totalQuestions}
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-lg flex items-center">
            <span className="text-2xl mr-1">⭐</span>
            <span className="text-white font-semibold">{stats.score} puntos</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <span className="text-lg mr-1">🎯</span>
          Máximo: {currentQuestionPoints} pts
        </div>
      </div>

      {/* Fun Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>🌟 Tu progreso</span>
          <span>{Math.round(((stats.currentQuestionIndex + 1) / stats.totalQuestions) * 100)}%</span>
        </div>
        <ProgressBar current={stats.currentQuestionIndex + 1} total={stats.totalQuestions} />
      </div>
    </Card>
  );
}
