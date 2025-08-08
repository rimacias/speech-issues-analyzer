"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useGameState } from './hooks/useGameState';
import { gameQuestions } from './data/questions';
import { GameSessionService } from './services/gameSessionService';
import type { Patient } from '@/types/patient';
import type { GameSessionData } from './types';

// Components
import { PatientSelection } from './components/PatientSelection';
import { GameStartScreen } from './components/GameStartScreen';
import { GameHeader } from './components/GameHeader';
import { QuestionCard } from './components/QuestionCard';
import { AudioRecorder } from './components/AudioRecorder';
import { AnswerResult } from './components/AnswerResult';
import { GameResultsScreen } from './components/GameResultsScreen';
import Forest from './components/Forest';

export default function Game() {
    const { user } = useAuth();
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [sessionData, setSessionData] = useState<GameSessionData | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [sessionSaved, setSessionSaved] = useState(false); // Track if session has been saved

    const gameState = useGameState({
        questions: gameQuestions,
        sessionData: sessionData || undefined
    });
    const audioRecorder = useAudioRecorder();

    const handlePatientSelected = async (patient: Patient) => {
        if (!user?.uid) return;

        try {
            // Create game session
            const session = await GameSessionService.createGameSession({
                patientId: patient.id!,
                userId: user.uid,
                patient: {
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    dateOfBirth: patient.dateOfBirth
                },
                totalQuestions: gameQuestions.length,
                maxScore: gameQuestions.reduce((sum, q) => sum + q.points, 0)
            });

            const gameSessionData: GameSessionData = {
                sessionId: session.id,
                patientId: patient.id!,
                userId: user.uid,
                patient: {
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    dateOfBirth: patient.dateOfBirth
                },
                startTime: session.startTime
            };

            setSelectedPatient(patient);
            setSessionData(gameSessionData);
            setSessionId(session.id!);
        } catch (error) {
            console.error('Error creating game session:', error);
            // Handle error - maybe show a toast or alert
        }
    };

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
        setSelectedPatient(null);
        setSessionData(null);
        setSessionId(null);
        setSessionSaved(false); // Reset saved state when resetting game
    };

    const handleGameFinished = async () => {
        if (!sessionId || !user?.uid || !sessionData) return;

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

    // Patient Selection Screen
    if (!selectedPatient || !sessionData) {
        return <PatientSelection onPatientSelected={handlePatientSelected} />;
    }

    // Game Start Screen
    if (!gameState.gameStarted) {
        return (
            <GameStartScreen
                totalQuestions={gameState.totalQuestions}
                maxScore={gameState.maxScore}
                onStartGame={gameState.startGame}
                patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
            />
        );
    }

    // Game Results Screen
    if (gameState.gameFinished) {
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
                patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                sessionData={sessionData}
            />
        );
    }

    // Main Game Screen
    return (
       <div className="min-h-screen flex items-center justify-center">
            <Forest />
            <div className="container mx-auto px-4 py-8 z-1">
                <div className="max-w-4xl mx-auto">
                    <GameHeader
                        stats={gameState.stats}
                        currentQuestionPoints={gameState.currentQuestion.points}
                        patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
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
    );
}
