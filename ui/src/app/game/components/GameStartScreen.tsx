import {Button, Card} from "@/app/game/components/ui";

interface GameStartScreenProps {
  totalQuestions: number;
  maxScore: number;
  onStartGame: () => void;
}

export function GameStartScreen({ totalQuestions, maxScore, onStartGame }: GameStartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-100 flex items-center justify-center">
      <Card className="max-w-2xl mx-4 text-center bg-white">
        <div className="mb-6">
          {/* Fun emoji header */}
          <div className="text-6xl mb-4">🎮✨</div>
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🌟 ¡Juego de Completar Palabras! 🌟
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            🎤 Escucha las preguntas y responde completando las oraciones.
            <br />✨ ¡Acumula puntos por cada respuesta correcta! ✨
          </p>
        </div>

        {/* Fun illustrations section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-sm text-gray-600">Preguntas divertidas</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🎵</div>
            <p className="text-sm text-gray-600">Habla y gana</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm text-gray-600">Acumula puntos</p>
          </div>
        </div>

        <Card variant="info" className="mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center justify-center">
            <span className="text-2xl mr-2">📖</span>
            ¿Cómo jugar?
          </h3>
          <div className="text-left space-y-3 text-blue-700">
            <p className="flex items-center">
              <span className="text-xl mr-3">👂</span>
              Escucharás {totalQuestions} preguntas súper divertidas
            </p>
            <p className="flex items-center">
              <span className="text-xl mr-3">🎤</span>
              Presiona el micrófono mágico y di tu respuesta
            </p>
            <p className="flex items-center">
              <span className="text-xl mr-3">⭐</span>
              Gana puntos por cada respuesta correcta
            </p>
            <p className="flex items-center">
              <span className="text-xl mr-3">🎊</span>
              Puntuación máxima: {maxScore} puntos
            </p>
          </div>
        </Card>

        <Button
          onClick={onStartGame}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xl px-12 py-4"
        >
          🚀 ¡Comenzar la Aventura! 🚀
        </Button>
      </Card>
    </div>
  );
}
