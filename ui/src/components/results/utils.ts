/**
 * Utility functions for the results components
 */

/**
 * Format duration in seconds to MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted string in MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get performance icon based on percentage
 * @param percentage - Performance percentage (0-100)
 * @returns Emoji icon representing performance level
 */
export function getPerformanceIcon(percentage: number): string {
  if (percentage >= 90) return '🏆';
  if (percentage >= 70) return '⭐';
  if (percentage >= 50) return '👍';
  return '💪';
}

/**
 * Get performance color classes based on percentage
 * @param percentage - Performance percentage (0-100)
 * @returns Tailwind CSS classes for text and background colors
 */
export function getPerformanceColor(percentage: number): string {
  if (percentage >= 90) return 'text-yellow-600 bg-yellow-50';
  if (percentage >= 70) return 'text-green-600 bg-green-50';
  if (percentage >= 50) return 'text-blue-600 bg-blue-50';
  return 'text-red-600 bg-red-50';
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: Date): number {
  return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
}

/**
 * Format date to locale string with options
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Format time to locale string with options
 * @param date - Date to format for time
 * @returns Formatted time string (HH:MM)
 */
export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format date and time together
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}
