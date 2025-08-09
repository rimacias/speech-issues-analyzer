'use client';
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import type { GameSession } from "../services/gameSessionService";
import { GameSessionService } from "../services/gameSessionService";
import { GameHeader } from "../components/GameHeader";
import { AnswerResult } from "../components/AnswerResult";
import { AudioRecorder } from "../components/AudioRecorder";
import { QuestionCard } from "../components/QuestionCard";
import { useGameState } from "../hooks/useGameState";
import { gameQuestions } from '../data/questions';
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { GameResultsScreen } from "../components/GameResultsScreen";
import { GameStartScreen } from "../components/GameStartScreen";
import { GameSessionData } from "../types";


export default function GameSession() {
    const { user } = useAuth();
    const [patientId, setPatientId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [gameSession, setGameSession] = useState<GameSession | null | undefined>(null);
    const [gameSessionData, setGameSessionData] = useState<GameSessionData | undefined | null>(undefined)

    const [sessionSaved, setSessionSaved] = useState(false);
    const gameState = useGameState({
        questions: gameQuestions,
        sessionData: gameSessionData || undefined
    });
    const audioRecorder = useAudioRecorder();

    useEffect(() => {
        if (!user) return;
        const storedPatientId = localStorage.getItem('patientId');
        if (storedPatientId) {
            setPatientId(storedPatientId);
        }

        const storedSessionId = localStorage.getItem('gameSessionId');
        if (storedSessionId) {
            setSessionId(storedSessionId);

        }
    }, [user]);

    useEffect(() => {
    if (!user || !patientId || !sessionId) return;
        GameSessionService.getPatientGameSessions(user.uid, patientId)
            .then((sessions) => {
            const s = sessions.find((session) => {
                if(session.id.toString() === sessionId){
                    const gameSessionData: GameSessionData = {
                        sessionId: session.id,
                        patientId: patientId,
                        userId: user.uid,
                        patient: {
                            firstName: session.patient.firstName,
                            lastName: session.patient.lastName,
                            dateOfBirth: session.patient.dateOfBirth
                        },
                        startTime: session.startTime
                    };
                    setGameSessionData(gameSessionData);
                    return session;
                }
            });
            setGameSession(s);
            })
            .catch((err) => {
            console.error(err);
            });
    }, [user, sessionId]);


    const handleStartRecording = async () => {
        try {
            await audioRecorder.startRecording();
        } catch (error) {
            console.error("Failed to start recording:", error);
        }
    };

    const handleStopRecording = async () => {
        try {
            const transcription = await audioRecorder.stopRecording();
            gameState.checkAnswer(transcription, transcription);
        } catch (error) {
            console.error("Failed to analyze audio:", error);
            gameState.checkAnswer("Error al procesar audio", "Error al procesar audio");
        }
    };

    const handleResetGame = () => {
        gameState.resetGame();
        audioRecorder.resetAudio();
        setGameSessionData(null);
        setSessionId(null);
        setSessionSaved(false); // Reset saved state when resetting game
        localStorage.removeItem('patientId');
        localStorage.removeItem('gameSessionId');

    };

    const handleGameFinished = async () => {
        if (!sessionId || !user?.uid || !gameSessionData) return;

        try {
            const endTime = new Date();
            const totalDuration = gameState.getTotalDuration();

            await GameSessionService.completeGameSession(user.uid, sessionId, {
                endTime,
                totalDuration,
                answeredQuestions: gameState.answers.length,
                finalScore: gameState.score,
                percentage: gameState.stats.percentage,
                answers: gameState.answers.map(answer => ({
                    questionId: answer.questionId,
                    question: answer.question,
                    expectedAnswer: answer.expected,
                    userAnswer: answer.got,
                    transcription: answer.transcription,
                    isCorrect: answer.correct,
                    points: answer.points,
                    timeToAnswer: answer.timeToAnswer,
                    timestamp: answer.timestamp
                }))
            });

            setSessionSaved(true); // Mark session as saved
        } catch (error) {
            console.error('Error saving game session:', error);
            // Still allow the user to see results even if saving fails
        }
    };

    if (!user) return <span>Autenticándote…</span>;

    if (!gameSession ){
        return(
            <div>
                Loading Game Session...
            </div>
        )
    }

    // Game Start Screen
    if (!gameState.gameStarted && gameSessionData) {
        return (
            <GameStartScreen
                totalQuestions={gameState.totalQuestions}
                maxScore={gameState.maxScore}
                onStartGame={gameState.startGame}
                patientName={`${gameSessionData.patient.firstName} ${gameSessionData.patient.lastName}`}
            />
        );
    }

    // Game Results Screen
    if (gameState.gameFinished && gameSessionData) {
        // Save session data when game finishes (only once)
        if (sessionId && !sessionSaved) {
            // Call handleGameFinished asynchronously and handle the promise
            handleGameFinished().catch(error => {
                console.error('Failed to save session:', error);
            });
        }

        return (
            <GameResultsScreen
                stats={gameState.stats}
                answers={gameState.answers}
                onResetGame={() => {
                    handleResetGame();
                    setSessionSaved(false); // Reset saved state when resetting game
                }}
                patientName={`${gameSessionData.patient.firstName} ${gameSessionData.patient.lastName}`}
                sessionData={gameSessionData}
            />
        );
    }
    

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4 py-8 z-1">
                <div className="max-w-4xl mx-auto">
                    <GameHeader
                        stats={gameState.stats}
                        currentQuestionPoints={gameState.currentQuestion.points}
                        patientName={`${gameSessionData?.patient.firstName} ${gameSessionData?.patient.lastName}`}
                    />

                    <QuestionCard question={gameState.currentQuestion} />

                    <AudioRecorder
                        state={audioRecorder.state}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                    />

                    {gameState.lastResult && (
                        <AnswerResult
                            result={gameState.lastResult}
                            points={gameState.currentQuestion.points}
                        />
                    )}
                </div>
            </div>
        </div>
    );}
