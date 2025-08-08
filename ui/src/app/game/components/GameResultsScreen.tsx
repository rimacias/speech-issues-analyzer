import {GameAnswer, GameStats, GameSessionData, DetailedGameAnswer} from "@/app/game/types";
import {Button, Card} from "@/app/game/components/ui";
import Forest from "./Forest";

interface GameResultsScreenProps {
  stats: GameStats;
  answers: DetailedGameAnswer[];
  onResetGame: () => void;
  patientName?: string;
  sessionData?: GameSessionData;
}

export function GameResultsScreen({ stats, answers, onResetGame, patientName, sessionData }: GameResultsScreenProps) {
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { emoji: '🏆', message: '¡Eres un súper campeón!', color: 'text-yellow-600' };
    if (percentage >= 75) return { emoji: '🌟', message: '¡Excelente trabajo!', color: 'text-green-600' };
    if (percentage >= 60) return { emoji: '🎯', message: '¡Muy bien hecho!', color: 'text-blue-600' };
    if (percentage >= 40) return { emoji: '💪', message: '¡Buen esfuerzo!', color: 'text-purple-600' };
    return { emoji: '🌈', message: '¡Sigue practicando!', color: 'text-pink-600' };
  };

  const performance = getPerformanceMessage(stats.percentage);
  const averageTimePerQuestion = answers.length > 0 ? answers.reduce((sum, a) => sum + a.timeToAnswer, 0) / answers.length : 0;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Forest />
      <div className="container mx-auto px-4 py-8 z-1">
        <div className="max-w-4xl mx-auto">
          {/* Patient Session Info */}
          {patientName && sessionData && (
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👤</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Sesión de {patientName}</h3>
                    <p className="text-sm text-gray-600">
                      Iniciado: {sessionData.startTime.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Duración promedio</div>
                  <div className="font-semibold text-gray-800">
                    {averageTimePerQuestion.toFixed(1)}s por pregunta
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Results Header */}
          <Card className="mb-8 text-center bg-gradient-to-br from-white to-blue-50">
            <div className="text-8xl mb-6 animate-bounce">{performance.emoji}</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎊 ¡Juego Completado! 🎊
            </h1>
            {patientName && (
              <p className="text-xl text-gray-600 mb-4">
                ¡Felicidades, {patientName}!
              </p>
            )}
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
          </Card>

          {/* Detailed Results */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">📝</span>
              Resumen de Respuestas
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    answer.correct
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">
                          {answer.correct ? '✅' : '❌'}
                        </span>
                        <span className="font-semibold text-gray-800">
                          Pregunta {index + 1}
                        </span>
                        <span className="ml-auto text-sm text-gray-500">
                          {answer.timeToAnswer.toFixed(1)}s
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{answer.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Respuesta esperada: </span>
                          <span className="font-medium text-green-700">{answer.expected}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tu respuesta: </span>
                          <span className={`font-medium ${
                            answer.correct ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {answer.got}
                          </span>
                        </div>
                        {answer.transcription && answer.transcription !== answer.got && (
                          <div className="md:col-span-2">
                            <span className="text-gray-600">Transcripción: </span>
                            <span className="font-medium text-gray-700">{answer.transcription}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-center">
                      <div className="text-lg font-bold text-gray-700">
                        {answer.correct ? `+${answer.points}` : '0'}
                      </div>
                      <div className="text-xs text-gray-500">puntos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onResetGame}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold text-lg px-8 py-3"
            >
              🎮 ¡Jugar de Nuevo!
            </Button>
            <Button
              onClick={() => window.location.href = '/results'}
              size="lg"
              variant="outline"
              className="border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-bold text-lg px-8 py-3"
            >
              📊 Ver Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
