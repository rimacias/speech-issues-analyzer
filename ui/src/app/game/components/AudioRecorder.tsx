import {Card, LoadingSpinner} from "@/app/game/components/ui";
import {AudioRecorderState} from "@/app/game/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

interface AudioRecorderProps {
  state: AudioRecorderState;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function AudioRecorder({ state, onStartRecording, onStopRecording }: AudioRecorderProps) {
  const { isRecording, isAnalyzing, audioUrl } = state;

  return (
    <div className="text-center z-1">
      {/* Microphone Button */}
      <div>
        <div className={`inline-flex mt-1 items-center justify-center w-22 h-22 rounded-full transition-all duration-300 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-400 to-pink-500 animate-pulse shadow-lg shadow-red-200' 
            : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg hover:shadow-xl'
        }`}
        onClick={isRecording ? onStopRecording : onStartRecording}>
          <button
            
            className="text-white text-2xl transform transition-transform hover:scale-110"
            disabled={isAnalyzing}
          >
            {isRecording ? (
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faStop} className="h-12 w-12" />
                <span className="text-xs">PARAR</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faMicrophone} className="h-12 w-12" />
                <span className="text-xs">HABLAR</span>
              </div>
            )}
          </button>

        {/* Fun decorative wave animation for recording */}
        </div>
        {/* Status Text */}
        <div className="space-y-1 hidden">
          <p className="text-lg font-medium text-gray-700">
            {isRecording && false ? (
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-2">🎤</span>
                ¡Grabando tu voz mágica!
                <span className="text-2xl ml-2">✨</span>
              </span>
            ) : isAnalyzing && false ? (
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-2">🔍</span>
                Analizando tu respuesta...
                <span className="text-2xl ml-2">🤔</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-2">🎙️</span>
                Presiona para grabar tu respuesta
                <span className="text-2xl ml-2">🗣️</span>
              </span>
            )}
          </p>

          {isRecording && false && (
            <p className="text-sm text-gray-500 animate-pulse">
              📢 Habla claro y fuerte para que te escuche bien
            </p>
          )}
        </div>

        {/* Loading Animation */}
        {isAnalyzing &&  (
          <div className="">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500 mt-2 hidden">🧠 Procesando tu súper respuesta...</p>
          </div>
        )}
      
        {isRecording && (
        <div className="flex justify-center items-center space-x-1 pt-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-red-400 to-pink-500 rounded-full animate-pulse scale-75"
              style={{
                height: Math.random() * 20 + 10,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
      )}
      </div>

      {/* Audio Playback audioUrl */}
      {audioUrl && false && (
        <div className="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-blue-300">
          <div className="flex items-center justify-center mb-3">
            <span className="text-2xl mr-2">🎵</span>
            <h3 className="text-lg font-semibold text-gray-800">Tu grabación:</h3>
            <span className="text-2xl ml-2">🎵</span>
          </div>
          <audio controls className="w-full" src={audioUrl} />
        </div>
      )}


    </div>
  );
}
