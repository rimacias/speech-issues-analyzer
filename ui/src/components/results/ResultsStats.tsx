import type { Patient } from '@/types/patient';
import type { GameSession } from '@/app/game/services/gameSessionService';
import { formatDuration } from './utils';

interface ResultsStatsProps {
  sessions: GameSession[];
  patient: Patient | null;
}

export function ResultsStats({ sessions, patient }: ResultsStatsProps) {
  // Early return if no sessions
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">📈</span>
          {patient ? `${patient.firstName}'s Statistics` : 'Overall Statistics'}
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">No session data available</p>
        </div>
      </div>
    );
  }

  // Filter completed sessions (those with endTime)
  const completedSessions = sessions.filter(s => s.endTime);

  // Basic counts
  const totalSessions = sessions.length;
  const completedCount = completedSessions.length;

  // Calculate totals from completed sessions only
  let totalQuestions = 0;
  let totalCorrect = 0;
  let totalScore = 0;
  let totalPercentage = 0;
  let totalDuration = 0;

  for (const session of completedSessions) {
    totalQuestions += session.answeredQuestions || 0;
    totalScore += session.finalScore || 0;
    totalPercentage += session.percentage || 0;
    totalDuration += session.totalDuration || 0;

    // Count correct answers from the answers array
    if (session.answers && Array.isArray(session.answers)) {
      totalCorrect += session.answers.filter(a => a.isCorrect).length;
    }
  }

  // Calculate averages
  const averageScore = completedCount > 0 ? totalScore / completedCount : 0;
  const averagePercentage = completedCount > 0 ? totalPercentage / completedCount : 0;
  const averageDuration = completedCount > 0 ? totalDuration / completedCount : 0;

  // Find best session
  let bestScore = 0;
  let bestPercentage = 0;
  let bestDate = '';

  if (completedSessions.length > 0) {
    const bestSession = completedSessions.reduce((best, current) => {
      return (current.percentage || 0) > (best.percentage || 0) ? current : best;
    });

    bestScore = bestSession.finalScore || 0;
    bestPercentage = bestSession.percentage || 0;
    bestDate = bestSession.startTime ? new Date(bestSession.startTime).toLocaleDateString() : '';
  }

  // Calculate improvement trend
  let improvementTrend = 0;
  let recentCount = 0;
  let olderCount = 0;
  let recentAverage = 0;
  let olderAverage = 0;

  if (completedSessions.length >= 2) {
    const recent = completedSessions.slice(0, 3);
    const older = completedSessions.slice(3, 6);

    if (recent.length > 0) {
      recentCount = recent.length;
      recentAverage = recent.reduce((sum, s) => sum + (s.percentage || 0), 0) / recent.length;
    }

    if (older.length > 0) {
      olderCount = older.length;
      olderAverage = older.reduce((sum, s) => sum + (s.percentage || 0), 0) / older.length;
    }

    improvementTrend = recentAverage - olderAverage;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">📈</span>
        {patient ? `${patient.firstName}'s Statistics` : 'Overall Statistics'}
      </h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Total Sessions Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🎮</span>
            <span className="text-blue-100 text-sm">Sessions</span>
          </div>
          <div className="text-3xl font-bold">{totalSessions}</div>
          <div className="text-blue-100 text-sm">
            {completedCount} completed
          </div>
        </div>

        {/* Average Score Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">⭐</span>
            <span className="text-green-100 text-sm">Avg Score</span>
          </div>
          <div className="text-3xl font-bold">{Math.round(averageScore)}</div>
          <div className="text-green-100 text-sm">
            {Math.round(averagePercentage)}% accuracy
          </div>
        </div>

        {/* Total Questions Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">❓</span>
            <span className="text-purple-100 text-sm">Questions</span>
          </div>
          <div className="text-3xl font-bold">{totalQuestions}</div>
          <div className="text-purple-100 text-sm">
            {totalCorrect} correct
          </div>
        </div>

        {/* Average Duration Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">⏱️</span>
            <span className="text-orange-100 text-sm">Avg Time</span>
          </div>
          <div className="text-2xl font-bold">{formatDuration(averageDuration)}</div>
          <div className="text-orange-100 text-sm">
            per session
          </div>
        </div>
      </div>

      {/* Progress and Best Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Performance Trend Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-xl mr-2">📊</span>
            Recent Progress
          </h3>

          {completedSessions.length >= 2 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Improvement Trend</span>
                <div className={`flex items-center ${
                  improvementTrend > 0 ? 'text-green-600' : 
                  improvementTrend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <span className="text-lg mr-1">
                    {improvementTrend > 0 ? '📈' : improvementTrend < 0 ? '📉' : '➡️'}
                  </span>
                  <span className="font-semibold">
                    {improvementTrend > 0 ? '+' : ''}{Math.round(improvementTrend)}%
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div>Recent sessions ({recentCount}): {Math.round(recentAverage)}% avg</div>
                <div>Previous sessions ({olderCount}): {Math.round(olderAverage)}% avg</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-3xl mb-2">📊</div>
              <p>Complete more sessions to see progress trends</p>
            </div>
          )}
        </div>

        {/* Best Performance Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-xl mr-2">🏆</span>
            Best Performance
          </h3>

          {completedSessions.length > 0 ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Highest Score</span>
                  <span className="font-semibold text-green-600">
                    {bestScore} pts ({Math.round(bestPercentage)}%)
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {bestDate || 'No date available'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="text-3xl mb-2">🏆</div>
              <p>No completed sessions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
