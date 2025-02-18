/**
 * Utility class for formatting dates and times in a consistent way throughout the application.
 */
export class DateFormatter {
  /**
   * Formats a time string to show only hours and minutes.
   *
   * @param time - ISO 8601 timestamp string
   * @returns Time formatted as "HH:mm" using the system locale
   * @example
   * formatHour("2024-01-24T15:30:00Z") // Returns "15:30"
   */
  static formatHour(time: string): string {
    const date = new Date(time)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  /**
   * Formats a timestamp for display with date and time.
   *
   * @param time - ISO 8601 timestamp string
   * @returns Date and time formatted as "DD/MM/YYYY, HH:mm" using British English locale
   * @example
   * formatDateTime("2024-01-24T15:30:00Z") // Returns "24/01/2024, 15:30"
   */
  static formatDateTime(time: string): string {
    return new Date(time).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}
