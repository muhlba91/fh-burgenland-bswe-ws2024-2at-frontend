/**
 * Utility class for formatting navigation breadcrumb paths.
 */
export class BreadcrumbFormatter {
  /**
   * Formats a location path for display in the navigation breadcrumb.
   *
   * @param username - Username of the current user, or null if no user is selected
   * @param locationName - Name of the current location, or null if no location is selected
   * @returns The formatted path string. Examples:
   *          - "Weather App" (no user or location selected)
   *          - "john_doe" (only user selected)
   *          - "john_doe / Home" (user and location selected)
   */
  static formatLocationPath(username: string | null, locationName: string | null): string {
    if (username === null) return 'Weather App'
    if (locationName === null) return username
    return `${username} / ${locationName}`
  }
}
