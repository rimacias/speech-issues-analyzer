import type { Patient } from '@/types/patient';
import type { GameSession } from '@/app/game/services/gameSessionService';

interface SessionOverviewProps {
  sessions: GameSession[];
  patient: Patient | null;
}

export function SessionOverview({ sessions, patient }: SessionOverviewProps) {
  const completedSessions = sessions.filter(s => s.endTime);

  // Calculate session distribution by date
  const sessionsByDate = completedSessions.reduce((acc, session) => {
    const date = new Date(session.startTime).toDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate performance categories
  const performanceCategories = {
    excellent: completedSessions.filter(s => s.percentage >= 90).length,
    good: completedSessions.filter(s => s.percentage >= 70 && s.percentage < 90).length,
    fair: completedSessions.filter(s => s.percentage >= 50 && s.percentage < 70).length,
    needsWork: completedSessions.filter(s => s.percentage < 50).length,
  };

  const recentSessions = completedSessions.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">📋</span>
        Session Overview
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Distribution */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <span className="text-xl mr-2">🎯</span>
            Performance Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Excellent (90%+)</span>
              </div>
              <span className="font-semibold text-green-600">{performanceCategories.excellent}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Good (70-89%)</span>
              </div>
              <span className="font-semibold text-blue-600">{performanceCategories.good}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Fair (50-69%)</span>
              </div>
              <span className="font-semibold text-yellow-600">{performanceCategories.fair}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span className="text-sm text-gray-700">Needs Work (&lt;50%)</span>
              </div>
              <span className="font-semibold text-red-600">{performanceCategories.needsWork}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <span className="text-xl mr-2">📅</span>
            Recent Activity
          </h3>
          <div className="space-y-2">
            {Object.entries(sessionsByDate)
              .slice(0, 5)
              .map(([date, count]) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {count} session{count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            {Object.keys(sessionsByDate).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No activity yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Quick Insights
          </h3>
          <div className="space-y-3 text-sm">
            {completedSessions.length > 0 ? (
              <>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">
                    Most active on{' '}
                    {Object.entries(sessionsByDate)
                      .sort(([,a], [,b]) => b - a)[0]?.[0]
                      ? new Date(Object.entries(sessionsByDate).sort(([,a], [,b]) => b - a)[0][0])
                          .toLocaleDateString('en-US', { weekday: 'long' })
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">
                    {performanceCategories.excellent > performanceCategories.needsWork
                      ? 'Showing strong performance trends'
                      : 'Has room for improvement'
                    }
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">
                    Average session: {Math.round(
                      completedSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) /
                      completedSessions.length / 60
                    )} minutes
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Complete sessions to see insights
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sessions Timeline */}
      {recentSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-xl mr-2">🕒</span>
            Recent Sessions Timeline
          </h3>
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div key={session.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg">
                    {session.percentage >= 90 ? '🏆' :
                     session.percentage >= 70 ? '⭐' :
                     session.percentage >= 50 ? '👍' : '💪'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {session.patient.firstName} {session.patient.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(session.startTime).toLocaleDateString()} at{' '}
                        {new Date(session.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">
                        {session.finalScore} pts
                      </div>
                      <div className="text-sm text-gray-600">
                        {session.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
