import { Button, Card } from "@/app/game/components/ui";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPlay } from '@fortawesome/free-solid-svg-icons';
import Forest from "./Forest";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons/faPlayCircle";

interface GameStartScreenProps {
  totalQuestions: number;
  maxScore: number;
  onStartGame: () => void;
}

export function GameStartScreen({ totalQuestions, maxScore, onStartGame }: GameStartScreenProps) {
  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center bg-amber-50">
      <Forest/>
      <Card className="flex flex-col w-2/3 max-w-2xl mx-4 text-center z-1">
        <div>
          {/* Fun emoji header */}
          <div className="text-6xl mb-4">🎮✨</div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
             ¡Hablando con Loli!
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

        <Card variant="info" className="mb-6 hidden">
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

        <button
          onClick={onStartGame}
          className=" py-4 cursor-pointer"
          title="Iniciar Juego"
        >
            <span className="w-20 h-20 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 rounded-full flex items-center justify-center mx-auto ">
            <FontAwesomeIcon icon={faPlay} className="text-white  text-xl font-bold"/>
            </span>
        </button>
      </Card>
    </div>
  );
}
