import { Button, Card } from "@/app/game/components/ui";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

interface GameStartScreenProps {
  totalQuestions: number;
  maxScore: number;
  onStartGame: () => void;
  patientName?: string;
}

export function GameStartScreen({ totalQuestions, maxScore, onStartGame, patientName }: GameStartScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="flex flex-col h-fit max-w-2xl mx-4 text-center bg-white z-1">
        <div className="mb-2">
          {/* Patient greeting */}
          {patientName && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-4">
              <h2 className="text-lg font-semibold">¡Hola, {patientName}! 👋</h2>
              <p className="text-sm">¡Estás listo para una aventura divertida!</p>
            </div>
          )}
          
          {/* Fun emoji header */}
          <div className="text-6xl mb-4">🎮✨</div>
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faMicrophone} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
             ¡Juego de Completar Palabras!
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
