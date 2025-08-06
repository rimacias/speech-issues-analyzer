"use client";

import {useState, useRef, useEffect} from "react";

// Game data based on the therapy transcript
const gameQuestions = [
    {
        id: 1,
        question: "Comes con la boca, ¿y escribes con la...?",
        expectedAnswer: "mano",
        alternatives: ["mano", "manos"],
        points: 10
    },
    {
        id: 2,
        question: "Cuando estás con sueño, ¿duermes en la...?",
        expectedAnswer: "cama",
        alternatives: ["cama"],
        points: 10
    },
    {
        id: 3,
        question: "¿Juegas fútbol con la...?",
        expectedAnswer: "pelota",
        alternatives: ["pelota", "penota", "pedota"],
        points: 10
    },
    {
        id: 4,
        question: "¿En los pies te pones las medias y también los...?",
        expectedAnswer: "zapatos",
        alternatives: ["zapatos", "zapato"],
        points: 10
    },
    {
        id: 5,
        question: "¿Caminas con los pies y comes con...?",
        expectedAnswer: "boca",
        alternatives: ["boca", "la boca"],
        points: 10
    },
    {
        id: 6,
        question: "Es un animal grande y hace 'iihhhh ihhhh'. ¿Es el...?",
        expectedAnswer: "caballo",
        alternatives: ["caballo", "el caballo"],
        points: 15
    },
    {
        id: 7,
        question: "¿El bebé toma leche en la...?",
        expectedAnswer: "teta",
        alternatives: ["teta", "mama", "pecho"],
        points: 10
    },
    {
        id: 8,
        question: "El animal que nada en el agua y hace 'cua-cua', ¿es el...?",
        expectedAnswer: "pato",
        alternatives: ["pato", "el pato"],
        points: 15
    },
    {
        id: 9,
        question: "Cuando hace mucho calor, ¿puedes tomar un...?",
        expectedAnswer: "helado",
        alternatives: ["helado"],
        points: 10
    },
    {
        id: 10,
        question: "¿El dedo tiene una...?",
        expectedAnswer: "uña",
        alternatives: ["uña", "una uña"],
        points: 10
    },
    {
        id: 11,
        question: "El animal que hace 'mu' es una...?",
        expectedAnswer: "vaca",
        alternatives: ["vaca", "una vaca"],
        points: 15
    },
    {
        id: 12,
        question: "Te lavas las manos con agua y con...?",
        expectedAnswer: "jabón",
        alternatives: ["jabón", "el jabón"],
        points: 10
    },
    {
        id: 13,
        question: "¿Miras con los...?",
        expectedAnswer: "ojos",
        alternatives: ["ojos", "los ojos"],
        points: 10
    },
    {
        id: 14,
        question: "Para que la casa esté iluminada, ¿tienes que prender el...?",
        expectedAnswer: "foco",
        alternatives: ["foco", "el foco", "luz", "la luz"],
        points: 10
    },
    {
        id: 15,
        question: "El animal que hace 'oink oink oink' es un...?",
        expectedAnswer: "chancho",
        alternatives: ["chancho", "cerdo", "cochino"],
        points: 15
    },
    {
        id: 16,
        question: "Guardas tus cuadernos y tus libros en la...?",
        expectedAnswer: "mochila",
        alternatives: ["mochila", "bolsa"],
        points: 10
    },
    {
        id: 17,
        question: "Están en el cielo. Son blancas, a veces grises y de muchas formas. Son las...?",
        expectedAnswer: "nubes",
        alternatives: ["nubes", "las nubes"],
        points: 15
    },
    {
        id: 18,
        question: "El animalito que está en el árbol y salta de rama en rama, ¿es el...?",
        expectedAnswer: "mono",
        alternatives: ["mono", "el mono"],
        points: 15
    },
    {
        id: 19,
        question: "Te lleva volando a distintos lugares. ¿Es el...?",
        expectedAnswer: "avión",
        alternatives: ["avión", "el avión"],
        points: 15
    },
    {
        id: 20,
        question: "Sale en las noches. Cuando vas a dormir y está en el cielo, ¿es la...?",
        expectedAnswer: "luna",
        alternatives: ["luna", "la luna", "nuna"],
        points: 15
    },
    {
        id: 21,
        question: "Es redonda y puedes jugar con ella. ¿Es la...?",
        expectedAnswer: "pelota",
        alternatives: ["pelota", "pedota", "penota"],
        points: 10
    },
    {
        id: 22,
        question: "Sale en el día. Es brillante, nos ilumina y nos da calor. ¿Es el...?",
        expectedAnswer: "sol",
        alternatives: ["sol", "el sol"],
        points: 15
    },
    {
        id: 23,
        question: "Salta feliz en la laguna y es de color verde. ¿Es el...?",
        expectedAnswer: "sapo",
        alternatives: ["sapo", "el sapo", "rana"],
        points: 15
    },
    {
        id: 24,
        question: "¿Comes en la...?",
        expectedAnswer: "mesa",
        alternatives: ["mesa", "la mesa"],
        points: 10
    },
    {
        id: 25,
        question: "Te pones en los pies. ¿Son las...?",
        expectedAnswer: "medias",
        alternatives: ["medias", "las medias", "calcetines"],
        points: 10
    },
    {
        id: 26,
        question: "Es gris y chiquito y come quesito. ¿Es el...?",
        expectedAnswer: "ratón",
        alternatives: ["ratón", "el ratón"],
        points: 15
    },
    {
        id: 27,
        question: "¿Comes la sopa con la...?",
        expectedAnswer: "cuchara",
        alternatives: ["cuchara", "la cuchara", "cuchala"],
        points: 10
    },
    {
        id: 28,
        question: "¿El niño está triste, va a...?",
        expectedAnswer: "llorar",
        alternatives: ["llorar", "llonal"],
        points: 10
    }
];

export default function Game() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [lastResult, setLastResult] = useState<{correct: boolean, expected: string, got: string} | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Array<{question: string, expected: string, got: string, correct: boolean, points: number}>>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const currentQuestion = gameQuestions[currentQuestionIndex];
    const totalQuestions = gameQuestions.length;
    const maxScore = gameQuestions.reduce((sum, q) => sum + q.points, 0);

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
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());

                // Automatically analyze the recording
                await analyzeAnswer(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Could not access microphone:", err);
        }
    }

    function stopRecording() {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }

    async function analyzeAnswer(blob: Blob) {
        setIsAnalyzing(true);
        try {
            const audioFile = new File([blob], "answer.wav", { type: "audio/wav" });
            const formData = new FormData();
            formData.append("file", audioFile);

            const res = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                // Fix: The API returns transcript in data.analysis.transcript, not transcription
                const transcription = data.analysis?.transcript?.toLowerCase() || "";
                console.log("API Response:", data); // Debug log
                console.log("Extracted transcription:", transcription); // Debug log
                setUserAnswer(transcription);
                checkAnswer(transcription);
            } else {
                console.error("Failed to analyze audio");
                setUserAnswer("Error al procesar audio");
            }
        } catch (error) {
            console.error("Error analyzing answer:", error);
            setUserAnswer("Error al procesar audio");
        } finally {
            setIsAnalyzing(false);
        }
    }

    function checkAnswer(answer: string) {
        const cleanAnswer = answer.toLowerCase().trim();
        const isCorrect = currentQuestion.alternatives.some(alt =>
            cleanAnswer.includes(alt.toLowerCase()) || alt.toLowerCase().includes(cleanAnswer)
        );

        const result = {
            correct: isCorrect,
            expected: currentQuestion.expectedAnswer,
            got: answer
        };

        setLastResult(result);

        const answerRecord = {
            question: currentQuestion.question,
            expected: currentQuestion.expectedAnswer,
            got: answer,
            correct: isCorrect,
            points: isCorrect ? currentQuestion.points : 0
        };

        setAnswers(prev => [...prev, answerRecord]);

        if (isCorrect) {
            setScore(prev => prev + currentQuestion.points);
        }

        // Auto advance after 3 seconds
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    }

    function nextQuestion() {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setLastResult(null);
            setUserAnswer("");
            setAudioUrl(null);
        } else {
            setGameFinished(true);
        }
    }

    function resetGame() {
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameStarted(false);
        setGameFinished(false);
        setLastResult(null);
        setUserAnswer("");
        setAudioUrl(null);
        setAnswers([]);
    }

    if (!gameStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-4 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                            Juego de Completar Palabras
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Escucha las preguntas y responde completando las oraciones. ¡Acumula puntos por cada respuesta correcta!
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 mb-6">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">¿Cómo jugar?</h3>
                        <div className="text-left space-y-2 text-blue-700">
                            <p>• Escucharás {totalQuestions} preguntas basadas en una sesión de terapia del habla</p>
                            <p>• Presiona el micrófono y di tu respuesta</p>
                            <p>• Gana puntos por cada respuesta correcta</p>
                            <p>• Puntuación máxima: {maxScore} puntos</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setGameStarted(true)}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                        ¡Comenzar Juego!
                    </button>
                </div>
            </div>
        );
    }

    if (gameFinished) {
        const percentage = Math.round((score / maxScore) * 100);
        const correctAnswers = answers.filter(a => a.correct).length;

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Results Header */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Juego Completado!</h1>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-green-50 rounded-xl p-4">
                                    <div className="text-3xl font-bold text-green-600">{score}</div>
                                    <div className="text-green-800">Puntos Totales</div>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="text-3xl font-bold text-blue-600">{correctAnswers}/{totalQuestions}</div>
                                    <div className="text-blue-800">Respuestas Correctas</div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="text-3xl font-bold text-purple-600">{percentage}%</div>
                                    <div className="text-purple-800">Precisión</div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Results */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Respuestas Detalladas</h2>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {answers.map((answer, index) => (
                                    <div key={index} className={`p-4 rounded-lg border-2 ${
                                        answer.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                                    }`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-semibold text-gray-700">Pregunta {index + 1}:</span>
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                answer.correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                            }`}>
                                                {answer.correct ? `+${answer.points} pts` : '0 pts'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{answer.question}</p>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Esperado: </span>
                                                <span className="text-green-600">{answer.expected}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Tu respuesta: </span>
                                                <span className={answer.correct ? 'text-green-600' : 'text-red-600'}>
                                                    {answer.got || 'Sin respuesta'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={resetGame}
                                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                Jugar de Nuevo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Game Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-bold text-gray-800">
                                    Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                                </div>
                                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                                    <span className="text-blue-800 font-semibold">{score} puntos</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                Máximo: {currentQuestion.points} pts
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="text-center mb-8">
                            <div className="text-3xl mb-6">🎯</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Completa la oración:</h2>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                {currentQuestion.question}
                            </p>
                        </div>

                        {/* Recording Section */}
                        <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                                isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-600'
                            } transition-all duration-300`}>
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className="text-white text-3xl"
                                    disabled={isAnalyzing}
                                >
                                    {isRecording ? (
                                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                {isRecording ? 'Grabando... Haz clic para detener' :
                                 isAnalyzing ? 'Analizando tu respuesta...' :
                                 'Haz clic para grabar tu respuesta'}
                            </p>

                            {isAnalyzing && (
                                <div className="flex justify-center">
                                    <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Answer Result */}
                    {lastResult && (
                        <div className={`rounded-2xl shadow-xl p-6 mb-8 ${
                            lastResult.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                        }`}>
                            <div className="text-center">
                                <div className={`text-4xl mb-4 ${lastResult.correct ? 'text-green-600' : 'text-red-600'}`}>
                                    {lastResult.correct ? '✅ ¡Correcto!' : '❌ Incorrecto'}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Tu respuesta:</span> "{lastResult.got}"
                                    </p>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">Respuesta esperada:</span> "{lastResult.expected}"
                                    </p>
                                    {lastResult.correct && (
                                        <p className="text-green-600 font-semibold">
                                            +{currentQuestion.points} puntos
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    Avanzando a la siguiente pregunta en 3 segundos...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Audio Playback */}
                    {audioUrl && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tu grabación:</h3>
                            <audio controls className="w-full" src={audioUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
