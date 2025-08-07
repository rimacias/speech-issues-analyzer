"use client";

import {useState, useRef} from "react";
import {
  FaFolderPlus,
  FaCheckCircle,
  FaVolumeUp,
  FaMicrophone,
  FaStop,
  FaSpinner,
  FaTimes,
  FaCheck
} from 'react-icons/fa';

export default function TestPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setRecordedBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());

                // Automatically start analysis after recording stops
                await analyzeRecording(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError("No se pudo acceder al micrófono. Por favor verifica los permisos.");
        }
    }

    async function analyzeRecording(blob: Blob) {
        const audioFile = new File([blob], "recording.wav", { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioFile);

        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Error al analizar la grabación");
            }
            const data = await res.json();
            setResult(data.analysis);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }

    async function handleAnalyze() {
        const audioToAnalyze = recordedBlob || file;
        if (!audioToAnalyze) return;

        const formData = new FormData();

        if (recordedBlob) {
            // Create a file from the recorded blob
            const audioFile = new File([recordedBlob], "recording.wav", { type: "audio/wav" });
            formData.append("file", audioFile);
        } else if (file) {
            formData.append("file", file);
        }

        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Error al analizar el archivo");
            }
            const data = await res.json();
            setResult(data.analysis);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function clearAll() {
        setFile(null);
        setRecordedBlob(null);
        setAudioUrl(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function handleFileSelect(selectedFile: File) {
        if (selectedFile && selectedFile.type.startsWith('audio/')) {
            setFile(selectedFile);
            setRecordedBlob(null);
            setAudioUrl(null);
            setError(null);
        } else {
            setError("Por favor selecciona un archivo de audio válido (MP3, WAV, M4A, etc.)");
        }
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Analizador de Problemas del Habla
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Sube un archivo de audio o graba tu voz para analizar patrones del habla e identificar posibles problemas.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        {/* Input Section */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* File Upload */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Subir Archivo de Audio</h3>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                                        isDragOver 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-300 hover:border-blue-400'
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <FaFolderPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => {
                                            const selectedFile = e.target.files?.[0];
                                            if (selectedFile) {
                                                handleFileSelect(selectedFile);
                                            }
                                        }}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <span className="text-blue-600 font-medium">
                                            {isDragOver ? 'Suelta el archivo aquí' : 'Haz clic para subir'}
                                        </span>
                                        {!isDragOver && (
                                            <>
                                                <span className="text-gray-500"> o arrastra y suelta</span>
                                                <p className="text-sm text-gray-400 mt-2">MP3, WAV, M4A hasta 10MB</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {file && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                            <FaCheckCircle className="h-5 w-5" />
                                            Archivo seleccionado: {file.name}
                                        </div>

                                        {/* Modern Audio Player */}
                                        <div className="bg-gray-50 rounded-xl p-4 border">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                    <FaVolumeUp className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                                    </p>
                                                </div>
                                            </div>

                                            <audio
                                                controls
                                                className="w-full h-8 [&::-webkit-media-controls-panel]:bg-gray-100 [&::-webkit-media-controls-play-button]:bg-blue-500 [&::-webkit-media-controls-play-button]:rounded-full [&::-webkit-media-controls-timeline]:bg-gray-200 [&::-webkit-media-controls-current-time-display]:text-gray-700 [&::-webkit-media-controls-time-remaining-display]:text-gray-700"
                                                src={URL.createObjectURL(file)}
                                                preload="metadata"
                                            >
                                                Tu navegador no soporta el elemento de audio.
                                            </audio>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recording */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-800">Grabar Audio</h3>
                                <div className="text-center p-6">
                                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                                        isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'
                                    } transition-all duration-300`}>
                                        <button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            className="text-white text-3xl"
                                        >
                                            {isRecording ? (
                                                <FaStop className="h-8 w-8" />
                                            ) : (
                                                <FaMicrophone className="h-8 w-8" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {isRecording ? 'Grabando... Haz clic para detener' : 'Haz clic para comenzar a grabar'}
                                    </p>
                                </div>
                                {audioUrl && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-green-600 mb-2">¡Grabación capturada!</p>
                                        <audio controls className="w-full" src={audioUrl} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={(!file && !recordedBlob) || loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin h-5 w-5" />
                                        Analizando...
                                    </div>
                                ) : (
                                    'Analizar Habla'
                                )}
                            </button>

                            {(file || recordedBlob || result) && (
                                <button
                                    onClick={clearAll}
                                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    Limpiar Todo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                            <div className="flex items-center gap-2">
                                <FaTimes className="h-5 w-5 text-red-500" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Results Display */}
                    {result && (
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FaCheck className="h-6 w-6 text-green-500" />
                                Resultados del Análisis
                            </h2>
                            <div className="bg-gray-50 rounded-xl p-6 overflow-auto">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}