import {Card, ProgressBar} from "@/app/game/components/ui";
import {GameStats} from "@/app/game/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faSun, faCloud, faStar } from '@fortawesome/free-solid-svg-icons';

interface GameHeaderProps {
  stats: GameStats;
  currentQuestionPoints: number;
}

export function GameHeader({ stats, currentQuestionPoints }: GameHeaderProps) {
  return (
    <Card className="z-1">
      <div className="flex justify-between items-center ">
        <div className="flex justify-between w-full items-center">
          <div className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-3xl mr-2">📝</span>
            Pregunta {stats.currentQuestionIndex + 1} de {stats.totalQuestions}
          </div>
          <div className="flex bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 rounded-lg items-center">
            <div className="relative">
            <FontAwesomeIcon icon={faStar} className="relative text-yellow-400 stroke-50 stroke-white" size="2x"
            />
            
            </div>
            <span className="text-white font-semibold">{stats.score}</span>
          </div>
        </div>
      </div>

      {/* Fun Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-600">
          <span>🌟 Tu progreso</span>
          <span>{Math.round(((stats.currentQuestionIndex + 1) / stats.totalQuestions) * 100)}%</span>
        </div>
        <ProgressBar current={stats.currentQuestionIndex + 1} total={stats.totalQuestions} />
      </div>
    </Card>
  );
}
