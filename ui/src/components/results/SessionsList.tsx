import type { GameSession } from '@/app/game/services/gameSessionService';
import { formatDuration, getPerformanceIcon, getPerformanceColor, calculateAge, formatDate, formatTime } from './utils';

interface SessionsListProps {
  sessions: GameSession[];
  onSessionSelect: (session: GameSession) => void;
  selectedSession: GameSession | null;
}

export function SessionsList({ sessions, onSessionSelect, selectedSession }: SessionsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <span className="text-3xl mr-3">📝</span>
          Game Sessions ({sessions.length})
        </h2>
        <p className="text-gray-600 mt-2">
          Click on any session to view detailed question-by-question analysis
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No sessions found</h3>
          <p className="text-gray-600">Start playing games to see session results here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => onSessionSelect(session)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">
                          {session.patient.firstName.charAt(0)}{session.patient.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {session.patient.firstName} {session.patient.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {calculateAge(session.patient.dateOfBirth)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(session.startTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(session.startTime)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getPerformanceIcon(session.percentage)}</span>
                      <div>
                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(session.percentage)}`}>
                          {session.percentage.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {session.finalScore} pts
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {session.answeredQuestions} / {session.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.answers.filter(a => a.isCorrect).length} correct
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {session.totalDuration ? formatDuration(session.totalDuration) : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.totalDuration && session.answeredQuestions > 0
                        ? `${(session.totalDuration / session.answeredQuestions).toFixed(1)}s/q`
                        : ''
                      }
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      session.endTime 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.endTime ? 'Completed' : 'In Progress'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSessionSelect(session);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                    {session.endTime && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Could add export functionality here
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Export
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
