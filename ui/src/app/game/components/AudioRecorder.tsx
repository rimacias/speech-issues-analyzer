import {Card, LoadingSpinner} from "@/app/game/components/ui";
import {AudioRecorderState} from "@/app/game/types";

interface AudioRecorderProps {
  state: AudioRecorderState;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function AudioRecorder({ state, onStartRecording, onStopRecording }: AudioRecorderProps) {
  const { isRecording, isAnalyzing, audioUrl } = state;

  return (
    <Card className="text-center bg-gradient-to-br from-green-50 to-blue-50">
      {/* Microphone Button */}
      <div className="mb-6">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 transition-all duration-300 ${
          isRecording 
            ? 'bg-gradient-to-r from-red-400 to-pink-500 animate-pulse shadow-lg shadow-red-200' 
            : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg hover:shadow-xl'
        }`}>
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className="text-white text-4xl transform transition-transform hover:scale-110"
            disabled={isAnalyzing}
          >
            {isRecording ? (
              <div className="flex flex-col items-center">
                <svg className="h-12 w-12 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">PARAR</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="h-12 w-12 mb-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 715 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">HABLAR</span>
              </div>
            )}
          </button>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">
            {isRecording ? (
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-2">🎤</span>
                ¡Grabando tu voz mágica!
                <span className="text-2xl ml-2">✨</span>
              </span>
            ) : isAnalyzing ? (
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

          {isRecording && (
            <p className="text-sm text-gray-500 animate-pulse">
              📢 Habla claro y fuerte para que te escuche bien
            </p>
          )}
        </div>

        {/* Loading Animation */}
        {isAnalyzing && (
          <div className="mt-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500 mt-2">🧠 Procesando tu súper respuesta...</p>
          </div>
        )}
      </div>

      {/* Audio Playback */}
      {audioUrl && (
        <div className="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-blue-300">
          <div className="flex items-center justify-center mb-3">
            <span className="text-2xl mr-2">🎵</span>
            <h3 className="text-lg font-semibold text-gray-800">Tu grabación:</h3>
            <span className="text-2xl ml-2">🎵</span>
          </div>
          <audio controls className="w-full" src={audioUrl} />
        </div>
      )}

      {/* Fun decorative wave animation for recording */}
      {isRecording && (
        <div className="flex justify-center items-center space-x-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-red-400 to-pink-500 rounded-full animate-pulse"
              style={{
                height: Math.random() * 20 + 10,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.5s'
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
