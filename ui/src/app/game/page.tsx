"use client";

import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useGameState } from './hooks/useGameState';
import { gameQuestions } from './data/questions';

// Components
import { GameStartScreen } from './components/GameStartScreen';
import { GameHeader } from './components/GameHeader';
import { QuestionCard } from './components/QuestionCard';
import { AudioRecorder } from './components/AudioRecorder';
import { AnswerResult } from './components/AnswerResult';
import { GameResultsScreen } from './components/GameResultsScreen';
import Forest from './components/Forest';

export default function Game() {
    const gameState = useGameState({ questions: gameQuestions });
    const audioRecorder = useAudioRecorder();

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
            gameState.checkAnswer(transcription);
        } catch (error) {
            console.error("Failed to analyze audio:", error);
            gameState.checkAnswer("Error al procesar audio");
        }
    };

    const handleResetGame = () => {
        gameState.resetGame();
        audioRecorder.resetAudio();
    };

    // Game Start Screen
    if (!gameState.gameStarted) {
        return (
            <GameStartScreen
                totalQuestions={gameState.totalQuestions}
                maxScore={gameState.maxScore}
                onStartGame={gameState.startGame}
            />
        );
    }

    // Game Results Screen
    if (gameState.gameFinished) {
        return (
            <GameResultsScreen
                stats={gameState.stats}
                answers={gameState.answers}
                onResetGame={handleResetGame}
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
