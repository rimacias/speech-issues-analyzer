import { useState } from 'react';
import type { GameSession } from '@/app/game/services/gameSessionService';
import { formatDuration, getPerformanceIcon, formatDateTime } from './utils';

interface SessionDetailsProps {
  session: GameSession;
  onClose: () => void;
}

export function SessionDetails({ session, onClose }: SessionDetailsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'summary' | 'questions'>('summary');

  const correctAnswers = session.answers.filter(a => a.isCorrect).length;
  const averageTimePerQuestion = session.answers.length > 0
    ? session.answers.reduce((sum, a) => sum + a.timeToAnswer, 0) / session.answers.length
    : 0;

  // Calculate question-by-question stats
  const questionStats = session.answers.map((answer, index) => ({
    ...answer,
    questionNumber: index + 1,
    timeRelativeToAverage: answer.timeToAnswer - averageTimePerQuestion
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <span className="text-3xl mr-3">📊</span>
                Session Details
              </h2>
              <p className="text-blue-100 mt-1">
                {session.patient.firstName} {session.patient.lastName} •
                {new Date(session.startTime).toLocaleDateString()} at{' '}
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'summary' 
                  ? 'bg-white text-blue-600' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              📈 Summary
            </button>
            <button
              onClick={() => setViewMode('questions')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'questions' 
                  ? 'bg-white text-blue-600' 
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              📝 Question by Question
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {viewMode === 'summary' ? (
            /* Summary View */
            <div className="space-y-6">
              {/* Overall Performance */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
                  <div className="text-2xl mb-1">{getPerformanceIcon(session.percentage)}</div>
                  <div className="text-2xl font-bold">{session.finalScore}</div>
                  <div className="text-green-100 text-sm">Total Points</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-2xl font-bold">{session.percentage.toFixed(1)}%</div>
                  <div className="text-blue-100 text-sm">Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white text-center">
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-2xl font-bold">{correctAnswers}/{session.answeredQuestions}</div>
                  <div className="text-purple-100 text-sm">Correct</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-2xl font-bold">{averageTimePerQuestion.toFixed(1)}s</div>
                  <div className="text-orange-100 text-sm">Avg Time/Q</div>
                </div>
              </div>

              {/* Session Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">🕒</span>
                  Session Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Started:</span>
                    <span className="font-medium">{new Date(session.startTime).toLocaleString()}</span>
                  </div>
                  {session.endTime && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium">{new Date(session.endTime).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Duration:</span>
                        <span className="font-medium">{formatDuration(session.totalDuration || 0)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">📊</span>
                  Performance Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Response Times</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fastest:</span>
                        <span className="font-medium text-green-600">
                          {Math.min(...session.answers.map(a => a.timeToAnswer)).toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Slowest:</span>
                        <span className="font-medium text-red-600">
                          {Math.max(...session.answers.map(a => a.timeToAnswer)).toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span className="font-medium">{averageTimePerQuestion.toFixed(1)}s</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Accuracy Patterns</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Correct Answers:</span>
                        <span className="font-medium text-green-600">{correctAnswers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incorrect Answers:</span>
                        <span className="font-medium text-red-600">{session.answeredQuestions - correctAnswers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <span className="font-medium">{session.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Question by Question View */
            <div className="space-y-6">
              {/* Question Navigation */}
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {currentQuestionIndex + 1} of {session.answers.length}
                  </h3>
                  <p className="text-gray-600">Navigate through each question to see detailed analysis</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.min(session.answers.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === session.answers.length - 1}
                    className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Current Question Details */}
              {session.answers[currentQuestionIndex] && (
                <div className={`border-l-4 p-6 rounded-lg ${
                  questionStats[currentQuestionIndex].isCorrect 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">
                          {questionStats[currentQuestionIndex].isCorrect ? '✅' : '❌'}
                        </span>
                        <h4 className="text-xl font-semibold text-gray-800">
                          Question {currentQuestionIndex + 1}
                        </h4>
                      </div>
                      <p className="text-gray-700 text-lg mb-4">
                        {questionStats[currentQuestionIndex].question}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-800">
                        {questionStats[currentQuestionIndex].isCorrect ? `+${questionStats[currentQuestionIndex].points}` : '0'} pts
                      </div>
                      <div className="text-sm text-gray-600">
                        {questionStats[currentQuestionIndex].timeToAnswer.toFixed(1)}s
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Expected Answer:</h5>
                      <p className="text-green-700 font-medium bg-green-100 p-3 rounded">
                        {questionStats[currentQuestionIndex].expectedAnswer}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-2">Patient's Answer:</h5>
                      <p className={`font-medium p-3 rounded ${
                        questionStats[currentQuestionIndex].isCorrect 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-red-700 bg-red-100'
                      }`}>
                        {questionStats[currentQuestionIndex].userAnswer}
                      </p>
                    </div>
                  </div>

                  {questionStats[currentQuestionIndex].transcription &&
                   questionStats[currentQuestionIndex].transcription !== questionStats[currentQuestionIndex].userAnswer && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Audio Transcription:</h5>
                      <p className="text-gray-700 bg-gray-100 p-3 rounded italic">
                        "{questionStats[currentQuestionIndex].transcription}"
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Response Time</div>
                        <div className={`font-medium ${
                          questionStats[currentQuestionIndex].timeRelativeToAverage > 5 ? 'text-red-600' :
                          questionStats[currentQuestionIndex].timeRelativeToAverage < -2 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {questionStats[currentQuestionIndex].timeToAnswer.toFixed(1)}s
                          {questionStats[currentQuestionIndex].timeRelativeToAverage > 0 && (
                            <span className="text-xs ml-1">(+{questionStats[currentQuestionIndex].timeRelativeToAverage.toFixed(1)}s)</span>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Points Earned</div>
                        <div className="font-medium text-gray-600">
                          {questionStats[currentQuestionIndex].isCorrect ? questionStats[currentQuestionIndex].points : 0} / {questionStats[currentQuestionIndex].points}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Time Answered</div>
                        <div className="font-medium text-gray-600">
                          {new Date(questionStats[currentQuestionIndex].timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3">All Questions Overview</h4>
                <div className="flex flex-wrap gap-2">
                  {questionStats.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-blue-600 text-white'
                          : question.isCorrect
                          ? 'bg-green-200 text-green-800 hover:bg-green-300'
                          : 'bg-red-200 text-red-800 hover:bg-red-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Session Data
          </button>
        </div>
      </div>
    </div>
  );
}
