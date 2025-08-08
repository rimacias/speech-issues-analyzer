import {Card} from "@/app/game/components/ui";
import {GameResult} from "@/app/game/types";

interface AnswerResultProps {
  result: GameResult;
  points: number;
}

export function AnswerResult({ result, points }: AnswerResultProps) {
  return (
    <Card
      variant={result.correct ? 'success' : 'error'}
      className="mb-8 animate-fadeIn z-1"
    >
      <div className="text-center">
        {/* Result Animation */}
        <div className={`text-6xl mb-6 ${result.correct ? 'animate-bounce' : 'animate-pulse'}`}>
          {result.correct ? '🎉' : '😅'}
        </div>

        {/* Result Message */}
        <div className={`text-4xl font-bold mb-6 ${
          result.correct ? 'text-green-600' : 'text-red-600'
        }`}>
          {result.correct ? (
            <span className="flex items-center justify-center">
              ✅ ¡Súper correcto! 🌟
            </span>
          ) : (
            <span className="flex items-center justify-center">
              🤗 ¡Casi lo logras! 💪
            </span>
          )}
        </div>

        {/* Answer Details */}
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🗣️</span>
                Tu respuesta:
                <span className="text-2xl ml-2">🗣️</span>
              </span>
              <span className="text-xl font-medium text-blue-600">"{result.got}"</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold flex items-center justify-center mb-2">
                <span className="text-2xl mr-2">🎯</span>
                Respuesta esperada:
                <span className="text-2xl ml-2">🎯</span>
              </span>
              <span className="text-xl font-medium text-green-600">"{result.expected}"</span>
            </p>
          </div>

          {result.correct && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
              <p className="text-xl font-bold flex items-center justify-center">
                <span className="text-2xl mr-2">⭐</span>
                +{points} puntos ganados
                <span className="text-2xl ml-2">⭐</span>
              </p>
            </div>
          )}
        </div>

        {/* Encouragement Message */}
        <div className="text-center">
          {result.correct ? (
            <div className="space-y-2">
              <p className="text-lg text-green-700 font-medium">
                🎊 ¡Excelente trabajo! ¡Sigues siendo increíble! 🎊
              </p>
              <div className="flex justify-center space-x-2 text-2xl">
                <span>🌟</span><span>🎈</span><span>🦄</span><span>🌈</span><span>✨</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg text-orange-700 font-medium">
                💝 ¡No te preocupes! ¡La próxima lo harás genial! 💝
              </p>
              <div className="flex justify-center space-x-2 text-2xl">
                <span>🤗</span><span>💪</span><span>🌻</span><span>🎯</span><span>💫</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-6 animate-pulse">
          🚀 Avanzando a la siguiente pregunta en 3 segundos... 🚀
        </p>
      </div>
    </Card>
  );
}
