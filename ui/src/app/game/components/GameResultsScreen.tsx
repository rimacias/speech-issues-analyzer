import {GameAnswer, GameStats} from "@/app/game/types";
import {Button, Card} from "@/app/game/components/ui";

interface GameResultsScreenProps {
  stats: GameStats;
  answers: GameAnswer[];
  onResetGame: () => void;
}

export function GameResultsScreen({ stats, answers, onResetGame }: GameResultsScreenProps) {
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { emoji: '🏆', message: '¡Eres un súper campeón!', color: 'text-yellow-600' };
    if (percentage >= 75) return { emoji: '🌟', message: '¡Excelente trabajo!', color: 'text-green-600' };
    if (percentage >= 60) return { emoji: '🎯', message: '¡Muy bien hecho!', color: 'text-blue-600' };
    if (percentage >= 40) return { emoji: '💪', message: '¡Buen esfuerzo!', color: 'text-purple-600' };
    return { emoji: '🌈', message: '¡Sigue practicando!', color: 'text-pink-600' };
  };

  const performance = getPerformanceMessage(stats.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="mb-8 text-center bg-gradient-to-br from-white to-blue-50">
            <div className="text-8xl mb-6 animate-bounce">{performance.emoji}</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎊 ¡Juego Completado! 🎊
            </h1>
            <p className={`text-2xl font-bold mb-6 ${performance.color}`}>
              {performance.message}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-3xl font-bold">{stats.score}</div>
                <div className="text-yellow-100">Puntos Totales</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-3xl font-bold">{stats.correctAnswers}/{stats.totalQuestions}</div>
                <div className="text-green-100">Respuestas Correctas</div>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-3xl font-bold">{stats.percentage}%</div>
                <div className="text-purple-100">Precisión</div>
              </div>
            </div>

            {/* Fun celebration elements */}
            <div className="flex justify-center space-x-4 text-4xl mt-6 animate-pulse">
              <span>🎈</span><span>🎉</span><span>🎊</span><span>🌟</span><span>🦄</span>
            </div>
          </Card>

          {/* Detailed Results */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">📋</span>
              Tus respuestas detalladas
              <span className="text-3xl ml-3">📋</span>
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {answers.map((answer, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  answer.correct 
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-blue-50' 
                    : 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <span className="text-xl mr-2">{answer.correct ? '✅' : '❌'}</span>
                      Pregunta {index + 1}:
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                      answer.correct 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      <span className="mr-1">{answer.correct ? '⭐' : '💔'}</span>
                      {answer.correct ? `+${answer.points} pts` : '0 pts'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 italic">"{answer.question}"</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-700 flex items-center mb-1">
                        <span className="text-lg mr-2">🎯</span>
                        Esperado:
                      </span>
                      <span className="text-green-600 font-medium">"{answer.expected}"</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-700 flex items-center mb-1">
                        <span className="text-lg mr-2">🗣️</span>
                        Tu respuesta:
                      </span>
                      <span className={`font-medium ${answer.correct ? 'text-green-600' : 'text-red-600'}`}>
                        "{answer.got || 'Sin respuesta'}"
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievement Badges */}
          <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              🏅 Tus logros obtenidos 🏅
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {stats.correctAnswers > 0 && (
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-xs font-medium text-green-800">Primera Correcta</div>
                </div>
              )}
              {stats.correctAnswers >= 5 && (
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🌟</div>
                  <div className="text-xs font-medium text-blue-800">5 Correctas</div>
                </div>
              )}
              {stats.correctAnswers >= 10 && (
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">💎</div>
                  <div className="text-xs font-medium text-purple-800">10 Correctas</div>
                </div>
              )}
              {stats.percentage === 100 && (
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-medium text-yellow-800">Perfecto</div>
                </div>
              )}
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={onResetGame}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl px-12 py-4"
            >
              🎮 ¡Jugar de Nuevo! 🎮
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
